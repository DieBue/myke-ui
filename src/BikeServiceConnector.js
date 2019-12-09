const ENV_USER = process.env.REACT_APP_USER;
const ENV_BIKE_SERVICE_BASE_URL = process.env.REACT_APP_BIKE_SERVICE_BASE_URL;
const BIKE_SERVICE_API = require('./BikeServiceAPI.json');

/**
 * Allows read/write access to the myke bike backend service
 */
export default class BikeServiceConnector {

  /**
   * Updates the bike with new status and owner information, 
   * send the updated bike to the backend, and create a new bikes object containing the updated information.
   * @param {object} bikes The current bikes object
   * @param {object} newBike The bike to be updated
   * @param {string} user The user that will now own the bike
   * @returns A promise on a new updated bikes object reflecting the new persisted state
   */
  rentBike(bikes, newBike, user) {
    newBike.status = BIKE_SERVICE_API.STATUS.BOOKED;
    newBike.owner = user;
    return this._updateBikes(bikes, newBike);
  }

  /**
   * Updates the bike with new status and owner information, 
   * send the updated bike to the backend, and create a new bikes object containing the updated information.
   * @param {object} bikes The current bikes object
   * @param {object} newBike The updated bike
   * @returns {Promise} A promise on a new updated bikes object reflecting the new persisted state
   */
  releaseBike(bikes, newBike) {
    newBike.status = BIKE_SERVICE_API.STATUS.FREE;
    newBike.owner = null;
    return this._updateBikes(bikes, newBike);
  }

  /**
   * Loads the relevant bikes object from the backend. If the user has booked a bike, this bike is guaranteed to 
   * be contained in the object
   * @returns A promise on a object containing a new updated bikes object and corresonding hasBooking information
   */
  fetchBikes() {
    let url = new URL(ENV_BIKE_SERVICE_BASE_URL + BIKE_SERVICE_API.ROUTE_MY_BIKES);
    url.searchParams.set(BIKE_SERVICE_API.PARAM_USER_ID, ENV_USER);    
    return fetch(url)
      .then((resp) => resp.json())
      .then(function (data) {
        var hasBooking = false;
        var bikes = data.items.reduce(function (map, obj) {
          map[obj.id] = obj;
          hasBooking = hasBooking || (ENV_USER === obj.owner)
          return map;
        }, {});
        console.log("has booking: ", hasBooking);
        return {
          bikes: bikes,
          hasBooking: hasBooking
        };
      });
  }

  /**
   * Performs the actial logic triggered by rentBike() and releaseBike() functions
   * @param {object} bikes The current bikes object
   * @param {object} newBike The updated bike
   * @returns A promise on a new updated bikes object reflecting the new persisted state
   */
  _updateBikes(bikes, newBike) {
    console.log("Sending bike update ...")
    return fetch(ENV_BIKE_SERVICE_BASE_URL + '/api/bikes/' + newBike.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBike)
    }).then((resp) => resp.json())
      .then(function (json) {
        console.log("put response: ", json);
        let newBikes = Object.assign({}, bikes);
        newBikes[newBike.id] = newBike;
        return newBikes;
      });
  }
}

