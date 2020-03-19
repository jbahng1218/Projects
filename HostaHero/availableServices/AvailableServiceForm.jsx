import React from "react";
import logger from "sabio-debug";
import swal from "sweetalert";
import * as userService from "../../services/availableServicesService";
import serviceFormValidationSchema from "./availableServicesValidationSchema";
import PropTypes from "prop-types";
import { Row } from "reactstrap";
import LocationForm from "../locations/LocationForm";
import LocationCard from "../locations/LocationCard";
import * as LocationService from "../../services/locationsServices.js";

import { Formik, FastField, Form } from "formik";

const _logger = logger.extend("AvailableServices");

class AvailableServiceForm extends React.Component {
  state = {
    formData: {
      locationId: "",
      name: "",
      description: "",
      hasVeteranBenefits: "",
      isHostProvided: ""
    },
    isEditing: false
  };

  componentDidMount = () => {
    const { id } = this.props.match.params;
    if (id) {
      let { state } = this.props.location;
      if (state) {
        this.setFormData(state);
        this.getLocation(state.locationId);
      } else {
        this.getServicebyId(id);
      }
    }
  };

  getServicebyId = serviceId => {
    userService
      .getById(serviceId)
      .then(this.getServiceByIdSuccess)
      .catch(this.getServiceByIdError);
  };

  getServiceByIdSuccess = response => {
    this.setFormData(response.item);
    this.getLocation(response.item.locationId);
  };

  getServiceByIdError = errResponse => {
    _logger("could not find service" + errResponse);
  };

  getLocation = locationId => {
    LocationService.getLocationById(locationId)
      .then(this.getLocationDataSuccess)
      .catch(this.getLocationDataError);
  };

  getLocationDataSuccess = response => {
    let location = response.item;
    this.setState(() => {
      return {
        mappedLocation: this.mapLocationCard(location)
      };
    });
  };

  mapLocationCard = location => (
    <LocationCard
      key={"Location_" + location.id}
      location={location}
      edit={this.populateFormFields}
    />
  );

  populateFormFields = locationObj => {
    this.setState(() => {
      return (
        { editLocation: locationObj },
        this.props.history.push("/locations/add", locationObj)
      );
    });
  };

  getLocationDataError = errResponse => {
    _logger(errResponse);
  };

  setFormData = data => {
    this.setState(prevState => {
      return {
        ...prevState,
        formData: {
          ...prevState.formData,
          ...data
        },
        isEditing: true
      };
    });
  };

  onCancelClick = e => {
    e.preventDefault();
    swal({
      title: "Request Canceled!",
      icon: "success"
    });
    this.props.history.goBack();
  };

  onAddClick = formValues => {
    let data = {
      locationId: formValues.locationId,
      name: formValues.name,
      description: formValues.description,
      hasVeteranBenefits: formValues.hasVeteranBenefits,
      isHostProvided: formValues.isHostProvided
    };
    userService
      .addService(data)
      .then(this.onAddSuccess)
      .catch(this.onAddFail);
  };

  onAddSuccess = () => {
    swal({
      title: "Successful!",
      text: "Add Completed",
      icon: "success"
    });
    this.props.history.goBack();
  };

  onAddFail = res => {
    _logger(res);

    swal({
      title: "Something's Wrong",
      text: "Please try again.",
      icon: "error"
    });
  };

  onEditClick = formValues => {
    let data = {
      id: this.props.match.params.id,
      locationId: formValues.locationId,
      name: formValues.name,
      description: formValues.description,
      hasVeteranBenefits: formValues.hasVeteranBenefits,
      isHostProvided: formValues.isHostProvided
    };
    userService
      .editById(data.id, data)
      .then(this.onEditSuccess)
      .catch(this.onEditFail);
  };

  onEditSuccess = () => {
    swal({
      title: "Successful!",
      text: "Edit Completed",
      icon: "success"
    });
    this.props.history.goBack();
  };

  onEditFail = res => {
    _logger(res);

    swal({
      title: "Something's Wrong",
      text: "Please try again.",
      icon: "error"
    });
  };

  locationFormChangeValue = Id => {
    this.setState(prevState => ({
      ...prevState,
      formData: {
        locationId: Id
      }
    }));
  };

  render() {
    let locationForm;

    if (this.state.isEditing === true) {
      locationForm = <Row>{this.state.mappedLocation}</Row>;
    } else {
      locationForm = (
        <LocationForm
          onChangeValue={this.locationFormChangeValue}
          locationData={this.state.location}
        />
      );
    }

    return (
      <div
        className="container-fluid"
        style={{
          width: "800px"
        }}
      >
        <div className="main-card mb-3 card">
          <div className="card-title" style={{ paddingTop: "20px" }}>
            <h5 align="center">Create a Service</h5>
          </div>
          <div className="card-body">
            <div>{locationForm}</div>
            <Formik
              enableReinitialize={true}
              initialValues={this.state.formData}
              onSubmit={
                this.state.isEditing ? this.onEditClick : this.onAddClick
              }
              validationSchema={serviceFormValidationSchema}
              render={formikProps => (
                <Form>
                  <div className="row form-group">
                    <label
                      htmlFor="exampleName"
                      className="col-sm-2 col-form-label"
                    >
                      Name
                    </label>
                    <div className="col-sm-10">
                      <FastField
                        name="name"
                        id="name"
                        placeholder="Service Name"
                        component="input"
                        className="form-control"
                        values={formikProps.values.name}
                      />
                      {formikProps.touched.name && formikProps.errors.name && (
                        <div className="text-danger">
                          {formikProps.errors.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row form-group">
                    <label
                      htmlFor="exampleDescription"
                      className="col-sm-2 col-form-label"
                    >
                      Description
                    </label>
                    <div className="col-sm-10">
                      <FastField
                        name="description"
                        className="form-control"
                        style={{ height: "100px" }}
                        id="description"
                        component="textarea"
                      />
                      {formikProps.touched.description &&
                        formikProps.errors.description && (
                          <div className="text-danger">
                            {formikProps.errors.description}
                          </div>
                        )}
                    </div>
                  </div>
                  <fieldset className="row form-group">
                    <legend className="col-form-label col-sm-10">
                      Military Benefits
                    </legend>
                    <div className="col-sm-10">
                      <div className="form-check">
                        <label className="form-check-label">
                          <FastField
                            name="hasVeteranBenefits"
                            value={true}
                            checked={
                              formikProps.values.hasVeteranBenefits === true
                                ? "checked"
                                : null
                            }
                            type="radio"
                            className="form-check-input"
                          />
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <label className="form-check-label">
                          <FastField
                            name="hasVeteranBenefits"
                            value={false}
                            className="form-check-input"
                            checked={
                              formikProps.values.hasVeteranBenefits === false
                                ? "checked"
                                : null
                            }
                            type="radio"
                          />
                          No
                        </label>
                        {formikProps.touched.hasVeteranBenefits &&
                          formikProps.errors.hasVeteranBenefits && (
                            <div className="text-danger">
                              {formikProps.errors.hasVeteranBenefits}
                            </div>
                          )}
                      </div>
                    </div>
                  </fieldset>
                  <fieldset className="row form-group">
                    <legend className="col-form-label col-sm-10">
                      Host Provided Service
                    </legend>
                    <div className="col-sm-10">
                      <div className="form-check">
                        <label className="form-check-label">
                          <FastField
                            type="radio"
                            name="isHostProvided"
                            value={true}
                            className="form-check-input"
                            checked={
                              formikProps.values.isHostProvided === true
                                ? "checked"
                                : null
                            }
                          />
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <label className="form-check-label">
                          <FastField
                            type="radio"
                            name="isHostProvided"
                            value={false}
                            className="form-check-input"
                            checked={
                              formikProps.values.isHostProvided === false
                                ? "checked"
                                : null
                            }
                          />
                          No
                        </label>
                        {formikProps.touched.isHostProvided &&
                          formikProps.errors.isHostProvided && (
                            <div className="text-danger">
                              {formikProps.errors.isHostProvided}
                            </div>
                          )}
                      </div>
                    </div>
                  </fieldset>
                  <div className="row form-check">
                    <div className="col-sm-10 offset-sm-5">
                      <button className="btn btn-primary" type="submit">
                        Submit
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button
                        className="btn btn-secondary"
                        onClick={this.onCancelClick}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}

AvailableServiceForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    goBack: PropTypes.func
  }),
  location: PropTypes.shape({
    state: PropTypes.object
  }),
  match: PropTypes.shape({
    params: PropTypes.object
  })
};

export default AvailableServiceForm;
