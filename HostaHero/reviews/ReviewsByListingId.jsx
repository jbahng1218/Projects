import React from "react";
import logger from "sabio-debug";
import * as userService from "../../services/reviewService";
import SingleReviewByListingId from "./SingleReviewByListingId";
import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faMedal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(fab, faMedal);

const _logger = logger.extend("Reviews");

class ReviewsByListingId extends React.Component {
  state = {
    review: [],
    currentPage: 0,
    totalPages: 0,
    listingId: 0,
    hostProfileId: 68
  };

  componentDidMount = () => {
    this.getAllByListingId(this.props.listing.id, this.state.currentPage);
  };

  changePage = page => {
    _logger(page);
    this.setState(() => ({ currentPage: page }));
    return this.getAllByListingId(this.props.listing.id, page.selected);
  };

  refreshReviews = () => {
    this.getAllByListingId(
      this.props.listing.id,
      this.state.currentPage.selected || 0,
      5
    );
  };

  mapReviews = aReview => (
    <SingleReviewByListingId
      oneReview={aReview}
      key={aReview.id}
      refreshAllReviews={this.refreshReviews}
      currentUserInfo={this.props.listingInfo.currentUser}
    />
  );

  onAddReviewClick = () => {
    this.props.listingInfo.history.push(
      `/reviews/new/${this.state.listingId}`,
      this.state.hostProfileId
    );
  };

  getAllByListingId = (listingId, pageNumber) => {
    userService
      .getByListingId(listingId, pageNumber, 5)
      .then(this.onGetByListingSuccess)
      .catch(this.onGetByListingFail);
  };

  onGetByListingSuccess = data => {
    let reviews = data.item;
    _logger(data);

    this.setState(() => ({
      reviewInfo: reviews.pagedItems.map(this.mapReviews),
      allReviews: reviews.pagedItems,
      totalPages: reviews.totalPages,
      totalCount: reviews.totalCount,
      totalRating: this.averageRating(reviews.pagedItems),
      listingId: this.props.listing.id
    }));
  };

  onGetByListingFail = () => {
    _logger("There are no reviews for this listing");
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
        {this.state.totalPages < 1 ? (
          "Reviews not available"
        ) : (
          <div className="col-sm-10 container-fluid">
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
            {this.state.reviewInfo}
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

ReviewsByListingId.propTypes = {
  listing: PropTypes.shape({ id: PropTypes.number }),
  listingInfo: PropTypes.shape({
    currentUser: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object
  })
};

export default ReviewsByListingId;
