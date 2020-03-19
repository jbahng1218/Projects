import React from "react";
import logger from "sabio-debug";
import PropTypes from "prop-types";
import { Col } from "reactstrap";
import swal from "sweetalert";
import * as userService from "../../services/availableServicesService";

const _logger = logger.extend("AvailableServices");

const SingleService = props => {
  _logger(props);

  const onEditClick = () => {
    _logger(props);
    props.editAService(props.service);
  };

  const onDeleteClick = e => {
    e.preventDefault();
    let serviceId = props.service.id;
    _logger(serviceId);
    deleteServiceById(serviceId);
  };

  const deleteServiceById = data => {
    _logger(data);
    userService
      .deleteById(data)
      .then(onDeleteSuccess)
      .catch(onDeleteFail);
  };

  const onDeleteSuccess = () => {
    _logger("delete success");
    swal({
      title: "Successful!",
      text: "Delete Confirmed",
      icon: "success"
    });
    props.deleteAService(props.service.id);
    props.refreshAllServices();
  };

  const onDeleteFail = err => {
    _logger(err);
    swal({
      title: "Something's Wrong",
      text: "Please try again.",
      icon: "error"
    });
  };

  const displayFlag = () => {
    return props.service.hasVeteranBenefits ? (
      <img
        src="https://a.slack-edge.com/production-standard-emoji-assets/10.2/google-small/1f1fa-1f1f2@2x.png"
        aria-label="flag um emoji"
        alt="flag-um"
        className="c-emoji c-emoji__small"
        data-qa="emoji"
        data-stringify-type="emoji"
        data-stringify-emoji="flag-um"
      />
    ) : null;
  };

  return (
    <React.Fragment>
      <Col sm="4">
        <div className="main-card mb-3 card">
          <div className="card-body">
            <div className="card-title">
              <p style={{ float: "right" }}>{displayFlag()}</p>
              <h4 style={{ fontWeight: "bold" }}>{props.service.name}</h4>
            </div>
            <div>
              <p style={{ fontStyle: "italic" }}>{props.service.lineOne}</p>
            </div>
            <p style={{ fontWeight: "bold" }}>{props.service.description}</p>
            {props.listingInfo.currentUser.roles.includes("Host") ||
            props.listingInfo.currentUser.roles.includes("Administrator") ? (
              <React.Fragment>
                <button onClick={onEditClick} className="btn btn-primary">
                  Edit
                </button>
                &nbsp;&nbsp;&nbsp;
                <button onClick={onDeleteClick} className="btn btn-secondary">
                  Delete
                </button>
                &nbsp;&nbsp;&nbsp;
              </React.Fragment>
            ) : null}
          </div>
        </div>
      </Col>
    </React.Fragment>
  );
};

SingleService.propTypes = {
  editAService: PropTypes.func,
  deleteAService: PropTypes.func,
  refreshAllServices: PropTypes.func,
  service: PropTypes.shape({
    id: PropTypes.number.isRequired,
    locationId: PropTypes.number,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    hasVeteranBenefits: PropTypes.bool.isRequired,
    isHostProvided: PropTypes.bool.isRequired,
    lineOne: PropTypes.string.isRequired
  }),
  listingInfo: PropTypes.shape({
    currentUser: PropTypes.object,
    location: PropTypes.object
  })
};

export default SingleService;
