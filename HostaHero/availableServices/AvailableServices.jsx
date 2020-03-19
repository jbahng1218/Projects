import React from "react";
import logger from "sabio-debug";
import * as userService from "../../services/availableServicesService";
import SingleService from "./SingleService";
import { Jumbotron, Row } from "reactstrap";
import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";

const _logger = logger.extend("AvailableServices");

class AvailableServices extends React.Component {
  state = {
    availableService: [],
    currentPage: 0,
    totalPages: 0,
    radius: 10,
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {}
  };

  componentDidMount = () => {
    _logger(this.props);
    this.getByLocationId(
      this.props.listing.locationId,
      this.state.radius,
      this.state.currentPage,
      6
    );
  };

  changePage = page => {
    _logger(page);
    this.setState(() => ({ currentPage: page }));
    return this.getByLocationId(
      this.props.listing.locationId,
      this.state.radius,
      page.selected,
      6
    );
  };

  onAddServiceClick = e => {
    e.preventDefault();
    this.props.listingInfo.history.push("/services/new");
  };

  getByLocationId = (locationId, radius, pageIndex, pageSize) => {
    userService
      .getByLocationId(locationId, radius, pageIndex, pageSize)
      .then(this.onGetByLocationIdSuccess)
      .catch(this.onGetByLocationIdFail);
  };

  onGetByLocationIdSuccess = data => {
    let services = data.item.pagedItems;
    _logger(services);
    const OgCenter = {
      lat: services[0].listingLat,
      lng: services[0].listingLng
    };

    this.setState(prevState => ({
      ...prevState,
      availableService: services,
      serviceInfo: services.map(this.mapServices),
      totalPages: data.item.totalPages,
      mappedMarkers: services.map(this.mapMarker),
      center: OgCenter
    }));
  };

  onGetByLocationIdFail = err => {
    _logger(err);
  };

  updateService = service => {
    this.props.listingInfo.history.push(
      `/services/${service.id}/edit`,
      service
    );
  };

  deleteService = serviceId => {
    _logger(serviceId);

    const indexOfService = this.state.availableService.findIndex(
      serviceArrayId => serviceArrayId.id === serviceId
    );

    const serviceArray = [...this.state.serviceInfo];

    serviceArray.splice(indexOfService, 1);

    this.setState(() => {
      return {
        serviceInfo: serviceArray
      };
    });
  };

  refreshService = () => {
    _logger(this.state.currentPage.selected);
    this.getByLocationId(
      this.props.listing.locationId,
      this.state.radius,
      this.state.currentPage.selected || 0,
      6
    );
  };

  mapServices = aService => {
    return (
      <SingleService
        service={aService}
        key={aService.id}
        editAService={this.updateService}
        deleteAService={this.deleteService}
        refreshAllServices={this.refreshService}
        listingInfo={this.props.listingInfo}
      />
    );
  };

  onMarkerClick = (props, marker) =>
    this.setState(() => ({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    }));

  onMapClicked = () => {
    if (this.state.showingInfoWindow) {
      this.setState(() => ({
        showingInfoWindow: false,
        activeMarker: null
      }));
    }
  };

  mapMarker = location => {
    return (
      <Marker
        key={location.id}
        onClick={this.onMarkerClick}
        name={location.name}
        position={{ lat: location.latitude, lng: location.longitude }}
      />
    );
  };

  displayFlag = () => {
    return (
      <img
        src="https://a.slack-edge.com/production-standard-emoji-assets/10.2/google-small/1f1fa-1f1f2@2x.png"
        aria-label="flag um emoji"
        alt="flag-um"
        className="c-emoji c-emoji__small"
        data-qa="emoji"
        data-stringify-type="emoji"
        data-stringify-emoji="flag-um"
      />
    );
  };

  render() {
    return (
      <div>
        <div>
          {this.props.listingInfo.currentUser.roles.includes("Host") ||
          this.props.listingInfo.currentUser.roles.includes("Administrator") ? (
            <Jumbotron>
              <h1>Available Services</h1>
              <p className="lead">
                Services that are available around your location. Services
                marked with {this.displayFlag()} provides military
                discounts/perks for applicable service members and veterans.
              </p>
              <div>
                <p>Click below to create a new service</p>
                <button
                  className="btn btn-primary"
                  onClick={this.onAddServiceClick}
                >
                  Add a Service
                </button>
              </div>
            </Jumbotron>
          ) : null}
        </div>
        {this.state.totalPages < 1 ? null : (
          <React.Fragment>
            <div className="availableServices">
              <div
                className="mapContainer"
                style={{ position: "absolute", width: "100%", height: "auto" }}
              >
                <Map
                  style={{ height: "400px", width: "98%" }}
                  className="googleMap"
                  onClick={this.onMapClicked}
                  google={this.props.google}
                  initialCenter={this.state.center}
                  zoom={11}
                >
                  {this.state.mappedMarkers}
                  <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                  >
                    <div>
                      <h6>{this.state.selectedPlace.name}</h6>
                    </div>
                  </InfoWindow>
                </Map>
              </div>
              <div style={{ paddingTop: "400px" }}>
                <ReactPaginate
                  previousLabel={"<"}
                  nextLabel={">"}
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
              <div>
                <Row>{this.state.serviceInfo}</Row>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

AvailableServices.propTypes = {
  listing: PropTypes.shape({ locationId: PropTypes.number }),
  listingInfo: PropTypes.shape({
    location: PropTypes.object,
    currentUser: PropTypes.object,
    history: PropTypes.shape({
      push: PropTypes.func
    })
  }),
  google: PropTypes.shape({
    apiKey: PropTypes.string
  })
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY
})(AvailableServices);
