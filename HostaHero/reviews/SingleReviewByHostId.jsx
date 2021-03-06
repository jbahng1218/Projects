import React from "react";
import Rating from "react-rating";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faMedal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logger from "sabio-debug";
import PropTypes from "prop-types";
import * as userService from "../../services/reviewService";
import swal from "sweetalert";

library.add(fab, faMedal);

const _logger = logger.extend("Reviews");

const dateOptions = {
  month: "long",
  year: "numeric"
};

class SingleReviewByHostId extends React.Component {
  componentDidMount = () => {
    _logger(this.props);
  };

  newDate = () => {
    let reviewCreated = new Date(this.props.oneReview.dateCreated);
    return reviewCreated;
  };

  onDeleteClick = () => {
    let reviewData = this.props.oneReview;

    userService
      .deleteById(reviewData.id, reviewData)
      .then(this.onDeleteSuccess)
      .catch(this.onDeleteFail);
  };

  onDeleteSuccess = () => {
    this.props.refreshAllReviews();
  };

  onDeleteFail = err => {
    _logger(err);
    swal({
      title: "Something's Wrong",
      text: "Please try again.",
      icon: "error"
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="main-card card">
          <div className="card-body">
            <div className="card-title">
              <img
                width={50}
                className="rounded-circle"
                src={this.props.oneReview.avatarUrl}
                alt="No Profile Information"
              />
              &nbsp;
              {this.props.oneReview.firstName}
              <div
                style={{
                  float: "right",
                  fontFamily: "Arial",
                  color: "#c4b4b4",
                  fontWeight: "normal",
                  textTransform: "lowerCase"
                }}
              >
                Booked at&nbsp;
                {this.props.oneReview.title}
                &nbsp;
                <img
                  width={50}
                  className="rounded-circle"
                  src={this.props.oneReview.fileUrl}
                  alt="File url not found"
                />
              </div>
            </div>

            <div>
              <Rating
                initialRating={this.props.oneReview.rating}
                readonly
                fractions={10}
                emptySymbol={
                  <FontAwesomeIcon
                    icon="medal"
                    style={{ color: "grey" }}
                    size="2x"
                  />
                }
                fullSymbol={
                  <FontAwesomeIcon
                    icon="medal"
                    style={{ color: "gold" }}
                    size="2x"
                  />
                }
              />
              &nbsp;
              <span style={{ fontStyle: "italic" }}>
                {this.newDate().toLocaleDateString("en-US", dateOptions)}
              </span>
            </div>
            <div>
              <p className="mt-3">{this.props.oneReview.description}</p>
            </div>
          </div>
          <div style={{ marginLeft: "3%" }}>
            {this.props.currentUserDetails.roles.includes("Administrator") ? (
              <button onClick={this.onDeleteClick} className="btn btn-primary">
                Delete
              </button>
            ) : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

SingleReviewByHostId.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  oneReview: PropTypes.shape({
    avatarUrl: PropTypes.string,
    createdBy: PropTypes.number.isRequired,
    dateCreated: PropTypes.string.isRequired,
    dateModified: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    hostProfileId: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    lastName: PropTypes.string,
    listingId: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    fileUrl: PropTypes.string,
    title: PropTypes.string.isRequired
  }),
  refreshAllReviews: PropTypes.func,
  currentUserDetails: PropTypes.shape({
    roles: PropTypes.object
  })
};

export default SingleReviewByHostId;
