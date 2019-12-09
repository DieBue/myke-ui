import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';


const BIKE_SERVICE_API = require('./BikeServiceAPI.json');
const STATUS_FREE = BIKE_SERVICE_API.STATUS.FREE;
const STATUS_BOOKED = BIKE_SERVICE_API.STATUS.BOOKED;

/**
 * Dialog that allows booking/releasing of a selected bike
 */
export default class BikeBookingDialog extends Component {

  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div>
        <Modal isOpen={this.props.show} >
          <ModalHeader>Bike "{this.props.bike.name}"</ModalHeader>
          <ModalBody>
            <DialogBody status={this.props.bike.status} hasBooking={this.props.hasBooking}/>
          </ModalBody>
          <ModalFooter>
            <Spinner isLoading={this.props.isLoading} />
            <RentButton status={this.props.bike.status} hasBooking={this.props.hasBooking} onClick={this.props.rentBike} />
            <ReleaseButton status={this.props.bike.status} hasBooking={this.props.hasBooking} onClick={this.props.releaseBike} />
            <Button color="secondary" onClick={this.props.cancel}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>);
  }
}

BikeBookingDialog.propTypes = {
  /** Shows or hides this dialog */
  show: PropTypes.bool,
  /** Shows or hides the loading indicator */
  isLoading: PropTypes.bool,
  /** Indicates if the current user has booked a different bike already */
  hasBooking: PropTypes.bool,
  /** The selected bike */
  bike: PropTypes.object,
  /** call-back for the cancel button */
  cancel: PropTypes.func,
  /** call-back for the rent button */
  rentBike: PropTypes.func,
  /** call-back for the release button */
  releaseBike: PropTypes.func
};

/**
 * The loading indicator
 */
function Spinner(props) {
  if (props.isLoading) {
    return <div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>;
  }
  return null;
}

/**
 * The rent button
 */
function RentButton(props) {
  if ((STATUS_FREE === props.status) && (!props.hasBooking)) {
    return <Button color="primary" onClick={props.onClick}>Rent Bike</Button>;
  }
  return null;
}

/**
 * The release button
 */
function ReleaseButton(props) {
  if (STATUS_BOOKED === props.status) {
    return <Button color="primary" onClick={props.onClick}>Release Bike</Button>;
  }
  return null;
}

/**
 * The dialog body text
 */

function DialogBody(props) {
  if ((STATUS_FREE === props.status) && (!props.hasBooking)) {
    return <div>
      This bike is free for rent
      <ol>
        <li>Click on "Rent Bike"</li>
        <li>Bicycle lock will unlock automatically"</li>
        <li>Adjust saddle hight</li>
      </ol>
    </div>;
  }
  if (STATUS_FREE === props.status) {
    return <div>
      You cannot book this bike since you booked a different bike already. 
    </div>;
  }
  if (STATUS_BOOKED === props.status) {
    return <div>
      You have booked this bike. Click on "Release Bike" to give back the bike.
      </div>
  }
  return <div>Sorry, this bike is already booked by someone else.</div>;
}

