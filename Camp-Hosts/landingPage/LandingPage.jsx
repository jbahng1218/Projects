import React from "react";
import "./LandingPage.css";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class LandingPage extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="Container container-fluid">
          <div className="row">
            <div className="card">
              <img src={group} alt="setUp" className="Mimage" />
              <div className="Image-text">
                Camp Anywhere With Us
                <div className="Center">
                  <Button className="btn-secondary" href="#mailingList">
                    Join Our Community
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Spacing Container">
          <h3 className="Center col-12">
            Empowering RVers to have more options and better experiences.
          </h3>
          <div className="Spacing">
            <div className="Row row">
              <div className="col-sm-5">
                <div className="card">
                  <img src={yellowRv} alt="yellowRv" className="Image" />
                </div>
              </div>
              <div className="col-sm">
                <div className="Card-one card">
                  <FontAwesomeIcon icon="caravan" size="2x" />
                  <div className="Text-b">
                    Book unique locations instantly on your mobile device. All
                    you have to do is show up and we manage the expectations and
                    process for the reservation.
                  </div>
                </div>
              </div>
            </div>
            <div className="row Row">
              <div className="col-sm">
                <div className="card Card-two">
                  <FontAwesomeIcon icon="campground" size="2x" />
                  <div className="Text-w">
                    Hassle free check-in, then just set up and enjoy your stay.
                    If you need something, use the built in messaging app to
                    contact your host.{" "}
                  </div>
                </div>
              </div>
              <div className="col-sm-5">
                <div className="card Card-image">
                  <img src={tent} alt="tent" className="Image" />
                </div>
              </div>
            </div>
            <div className="row Row">
              <div className="col-sm-5">
                <div className="card">
                  <img src={host} alt="host" className="Image" />
                </div>
              </div>
              <div className="col-sm">
                <div className="card Card-one">
                  <FontAwesomeIcon icon="hand-holding-usd" size="2x" />
                  <div className="Text-b">
                    Our technology makes it easy for you to become a Camp Host
                    and start taking in extra money while fostering a healthy
                    community. We also provide expert advice to optimize your
                    listing!
                  </div>
                </div>
              </div>
            </div>
            <div className="row Row">
              <div className="col-sm">
                <div className="card Card-two">
                  <FontAwesomeIcon icon="handshake" size="2x" />
                  <div className="Text-w">
                    We recognize that your property/coach is valuable so we
                    built our system to help ensure guests and hosts respect
                    each others property by providing an experience that matches
                    your standards.
                  </div>
                </div>
              </div>
              <div className="col-sm-5">
                <div className="card">
                  <img src={closeUp} alt="group" className="Image" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Spacing" id="mailingList">
          <h2 className="Center">Sign up Here to Stay Updated</h2>
          <div className="Spacing">
            <MailingList />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
