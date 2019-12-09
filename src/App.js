import React, { Component } from 'react';
import MykeMap from './MykeMap';
import BikeBookingDialog from './BikeBookingDialog';
import BikeServiceConnector from './BikeServiceConnector';
import PropTypes from 'prop-types';

const ENV_USER = process.env.REACT_APP_USER;


/**
 * Main application class
 */
export default class Myke extends Component {
  constructor(props) {
    super(props);

    this.INITIAL_POSITION = { lat: 48.515669, lng: 9.061971 };

    this.state = {
      showDialog: false,
      isLoading: false,
      selectedBike: null,
      hasBooking: false,
      bikes: {}
    }

    this.bikeService = new BikeServiceConnector(this);
  }

  /**
   * Reveals the BikeBookingDialog for a given bike
   */
  showDialog = (bike) => {
    console.log("show: ", bike);
    this.setState({
      showDialog: true,
      isLoading: false,
      selectedBike: bike
    });
  }

  /**
   * Hides the BikeBookingDialog
   */
  hideDialog = () => {
    console.log("hide");
    this.setState({
      showDialog: false,
      isLoading: false
    });
  }

  /**
   * Updates the currently selected bike to be rented by the user and sets the new state accordingly
   */
  rentBike = () => {
    console.log("rentBike: ", this.state.selectedBike);
    this.setState({
      isLoading: true,
    });
    let selectedBikeId = this.state.selectedBike.id;
    let newBike = Object.assign({}, this.state.bikes[selectedBikeId]);
    this.updateBikes(this, this.state.bikes, newBike, true, ENV_USER);
  }


  /**
   * Updates the currently selected bike to be released and sets the new state accordingly
   */
  releaseBike = () => {
    console.log("releaseBike: ", this.state.selectedBike);
    this.setState({
      isLoading: true,
    });
    let selectedBikeId = this.state.selectedBike.id;
    let newBike = Object.assign({}, this.state.bikes[selectedBikeId]);
    this.updateBikes(this, this.state.bikes, newBike, false, null);
  }

  render() {
    return (
      <div>
        <BikeBookingDialog show={this.state.showDialog} isLoading={this.state.isLoading} hasBooking={this.state.hasBooking} bike={this.state.selectedBike} cancel={this.hideDialog} rentBike={this.rentBike} releaseBike={this.releaseBike} />
        <MykeMap onMarkerClick={this.showDialog} bikes={this.state.bikes} initialPosition={this.INITIAL_POSITION} />
      </div>
    );
  }

  componentDidMount() {
    var self = this;
    this.bikeService.fetchBikes().then(function (newState) {
      self.setState(newState);
    }).catch(function (error) {
      console.log(error);
    });

  }

  /**
   * Helper method to execute rent/release operations and update the state accordingly
   * @param {Object} myke The Myke app
   * @param {Object} bikes The current bikes object
   * @param {Object} newBike the updated bike
   * @param {bool} doRent Indicates if the update is a rent or release operation
   * @param {bool} owner The new owner (irrelvant for release operations)
   */
  updateBikes(myke, bikes, newBike, doRent, owner) {
    var updatePromise = doRent ? myke.bikeService.rentBike(bikes, newBike, owner) : myke.bikeService.releaseBike(bikes, newBike)
    updatePromise.then(function(newBikes) {
      myke.setState({
        hasBooking: doRent,
        showDialog: false,
        isLoading: false,
        bikes: newBikes
      });
    }).catch(function (error) {
      console.error(error);
    });
  }
}

Myke.propTypes = {
  /** Shoe the BikeBookingDialog */
  showDialog: PropTypes.bool,

  /** True iff the user already has a booking */
  hasBoolking: PropTypes.bool,

  /** True iff a backend operation is running */
  isLoading: PropTypes.bool,

  /** The currently selected bike */
  selectedBike: PropTypes.object,

  /** The bikes object */
  bikes: PropTypes.object
};
