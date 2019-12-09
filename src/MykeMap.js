import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import PropTypes from 'prop-types';

const ENV_API_KEY=process.env.REACT_APP_GOOGLE_API_KEY;

const mapStyles = {
  width: '100%',
  height: '100%'
};

/**
 * Some dummy icons
 */
const iconURLs = {
  FREE: "icons/bike-red-small.png",
  BOOKED: "icons/bike-blue-small.png",
  UNAVAILABLE: "icons/bike-green-small.png"
}

/**
 * The map component showing our bike information
 */
export class MykeMap extends Component {

  /**
   * Builds the map marker objects, one per bike record
   */
  displayMarkers = () => {
    return Object.keys(this.props.bikes).map((key, index) => {
      let bike = this.props.bikes[key];
      let iconUrl = iconURLs[bike.status]; 
      return <Marker key={index} id={bike.id} name={bike.name} position={{
       lat: bike.latitude,
       lng: bike.longitude
     }}
     icon={{
      url: iconUrl
    }}
     onClick = {this.onMarkerClick} 
     />
    })
  }

  /**
   * Call back for a marker click
   */
  onMarkerClick = (props, marker) => {
    this.props.onMarkerClick(this.props.bikes[props.id]);
  }

  render() {
    if (!this.props.loaded) {
      return <div>Loading...</div>
    }
    return (
        <Map
          google={this.props.google}
          zoom={15}
          style={mapStyles}
          initialCenter={this.props.initialPosition}>
          {this.displayMarkers()}
        </Map>
    );
  }

}

MykeMap.propTypes = {
  /** Call-back function to be called when a marker gets clicked */
  onMarkerClick: PropTypes.func,

  /** The current bikes record to be displayed */
  bikes: PropTypes.object,

  /** The initial map position.  */
  initialPosition: PropTypes.object
};

/**
 * The wrapper to trun this into a Google Maps wrapper
 */
export default GoogleApiWrapper({
  apiKey: ENV_API_KEY
})(MykeMap);