import React from "react";
import logger from "sabio-debug";
import * as userService from "../../services/reviewService";
import PropTypes from "prop-types";
import SingleReviewByHostId from "./SingleReviewByHostId";
import ReactPaginate from "react-paginate";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faMedal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(fab, faMedal);

const _logger = logger.extend("Reviews");

class ReviewsByHostId extends React.Component {
  state = {
    review: [],
    currentPage: 0,
    totalPages: 0
  };

  componentDidMount = () => {
    _logger(this.props);
    this.getAllByHostId(this.props.hostInfo.id, this.state.currentPage);
  };

  changePage = page => {
    _logger(this.props);
    this.setState(() => ({
      currentPage: page
    }));
    return this.getAllByHostId(this.props.hostInfo.id, page.selected);
  };

  refreshReviews = () => {
    this.getAllByHostId(
      this.props.hostInfo.id,
      this.state.currentPage.selected,
      5
    );
  };

  mapReviews = aReview => (
    <SingleReviewByHostId
      oneReview={aReview}
      key={aReview.id}
      refreshAllReviews={this.refreshReviews}
      currentUserDetails={this.props.currentUserInfo}
    />
  );

  getAllByHostId = (hostId, pageNumber) => {
    userService
      .getByHostProfileId(hostId, pageNumber, 5)
      .then(this.onGetByHostSuccess)
      .catch(this.onGetByHostFail);
  };

  onGetByHostSuccess = data => {
    let reviews = data.item;

    this.setState(() => ({
      allReviews: reviews.pagedItems,
      reviewInfo: reviews.pagedItems.map(this.mapReviews),
      totalPages: reviews.totalPages,
      totalCount: reviews.totalCount,
      totalRating: this.averageRating(reviews.pagedItems)
    }));
  };

  onGetByHostFail = () => {
    _logger("There are no reviews for this host");
  };

  averageRating = data => {
    for (let i = 0; i < 1; i++) {
      let results = data[i].overAllRating;
      return results;
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.state.totalPages === 0 ? (
          "Reviews not available"
        ) : (
          <div style={{ float: "center" }} className="col-sm-7 container-fluid">
            <div
              style={{
                paddingBottom: "20px",
                fontWeight: "bold",
                fontSize: "200%"
              }}
            >
              Reviews
            </div>
            <div style={{ paddingBottom: "20px" }}>
              <FontAwesomeIcon icon="medal" style={{ color: "gold" }} />
              <strong>
                {(this.state.totalRating / this.state.totalCount).toFixed(2)}
                /5&nbsp;&nbsp;&nbsp;
                <span>{this.state.totalCount} reviews</span>
              </strong>
            </div>
            <div>{this.state.reviewInfo}</div>
            <div>
              <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={this.state.totalPages}
                marginPagesDisplayed={5}
                pageRangeDisplayed={2}
                onPageChange={this.changePage}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              />
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

ReviewsByHostId.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  hostId: PropTypes.number,
  key: PropTypes.number,
  hostInfo: PropTypes.shape({
    id: PropTypes.number
  }),
  currentUserInfo: PropTypes.shape({})
};

export default ReviewsByHostId;
