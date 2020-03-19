import React from "react";
import { Formik, FastField, Form } from "formik";
import PropTypes from "prop-types";
import reviewsFormValidationSchema from "./reviewsFormValidationSchema";
import swal from "sweetalert";
import logger from "sabio-debug";
import * as userService from "../../services/reviewService";

const _logger = logger.extend("AvailableServices");

class ReviewsForm extends React.Component {
  state = {
    listingId: 0,
    hostProfileId: 0
  };

  componentDidMount = () => {
    this.setState(() => ({
      listingId: parseInt(this.props.match.params.listingId),
      hostProfileId: parseInt(this.props.match.params.hostProfileId),
      reservationId: parseInt(this.props.match.params.reservationId)
    }));
  };

  onAddClick = formValues => {
    let inputFields = this.state;

    _logger(formValues);
    let data = {
      listingId: inputFields.listingId,
      hostProfileId: inputFields.hostProfileId,
      rating: formValues.rating,
      description: formValues.description
    };

    userService
      .addService(data)
      .then(this.onAddSuccess)
      .catch(this.onAddFail);
  };

  onAddSuccess = () => {
    _logger("success");
    swal({
      title: "Successful!",
      text: "Add Completed",
      icon: "success"
    });
    this.props.history.push(`/listings`);
  };

  onAddFail = res => {
    _logger(res);
    swal({
      title: "Something's Wrong",
      text: "Please try again.",
      icon: "error"
    });
  };

  onCancelClick = e => {
    e.preventDefault();
    swal({
      title: "Request Canceled!",
      icon: "success"
    });
    this.props.history.push(`/listings`);
  };

  render() {
    return (
      <div
        className="container-fluid"
        style={{
          width: "800px"
        }}
      >
        <Formik
          initialValues={this.state}
          onSubmit={this.onAddClick}
          validationSchema={reviewsFormValidationSchema}
          render={formikProps => (
            <div className="main-card mb-3 card">
              <div className="card-body">
                <div className="card-title" style={{ padding: "20px" }}>
                  <h5 align="center">Leave a Review</h5>
                </div>
                <Form>
                  <div className="row form-group">
                    <label
                      htmlFor="exampleRating"
                      className="col-sm-2 col-form-label"
                    >
                      Rating
                    </label>
                    <div className="col-sm-5">
                      <FastField
                        name="rating"
                        id="rating"
                        className="form-control"
                        min="1"
                        max="5"
                        step=".1"
                        type="range"
                      />
                      {formikProps.touched.rating &&
                        formikProps.errors.rating && (
                          <div className="text-danger">
                            {formikProps.errors.rating}
                          </div>
                        )}
                    </div>
                    <span>
                      <div className="col-sm-4">
                        <FastField
                          name="rating"
                          id="rating"
                          className="form-control"
                          component="input"
                        />
                        {formikProps.touched.rating &&
                          formikProps.errors.rating && (
                            <div className="text-danger">
                              {formikProps.errors.rating}
                            </div>
                          )}
                      </div>
                    </span>
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
                        style={{ height: "200px" }}
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
              </div>
            </div>
          )}
        />
      </div>
    );
  }
}

ReviewsForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      listingId: PropTypes.string,
      hostProfileId: PropTypes.string,
      reservationId: PropTypes.string
    })
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  location: PropTypes.shape({
    state: PropTypes.object
  })
};

export default ReviewsForm;
