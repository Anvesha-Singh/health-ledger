import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

function NavBar() {
  return (
    <nav className="navbar fixed-top navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand text-new" href="#">
          Health Ledger
        </a>
        <button
          className="btn"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasWithBothOptions"
          aria-controls="offcanvasWithBothOptions"
        >
          <img src="src/assets/list.svg" width="30px" height="30rem" alt="Menu" />
        </button>
      </div>
    </nav>
  );
}

function HomeCarousel() {
  return (
    <div>
      <div
        id="carouselExampleRide"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="3000"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              className="d-block w-100 images"
              src="src/assets/carousal_1.jpg"
              alt="Slide 1"
            />
          </div>
          <div className="carousel-item">
            <img
              className="d-block w-100 images"
              src="src/assets/carousal_2.jpg"
              alt="Slide 2"
            />
          </div>
          <div className="carousel-item">
            <img
              className="d-block w-100 images"
              src="src/assets/carousal_3.jpg"
              alt="Slide 3"
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleRide"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleRide"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

function HomeAccordion() {
  return (
    <div className="accordion accordion-flush" id="accordionFlushExample">
      {[
        {
          title: "Tamper-Free Storage",
          content:
            "Patient histories are securely stored on the blockchain, ensuring that the data is tamper-proof.",
          id: "flush-collapseOne",
        },
        {
          title: "Doctor Tools",
          content:
            "Doctors can access comprehensive patient history and receive AI-generated summaries of past conditions.",
          id: "flush-collapseTwo",
        },
        {
          title: "AI Chatbot",
          content:
            "Our AI-powered chatbot assists patients in analyzing their symptoms and recommending the right specialist.",
          id: "flush-collapseThree",
        },
        {
          title: "Patient Uploads",
          content:
            "Patients can upload documents like prescriptions, diagnoses, and consultation reports from non-participating hospitals.",
          id: "flush-collapseFour",
        },
      ].map((item, index) => (
        <div className="accordion-item" key={index}>
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed text-new"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#${item.id}`}
              aria-expanded="false"
              aria-controls={item.id}
            >
              {item.title}
            </button>
          </h2>
          <div
            id={item.id}
            className="accordion-collapse collapse"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body text">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Review() {
  return (
    <div className="review-container">
      <div className="card text-center mb-3">
        <div className="card-body">
          <h5 className="card-title text-new">Rajesh ~</h5>
          <p className="card-text italic-text">
            "I’ve been using this system for a while now, and it’s been a huge
            help in managing patient care..."
          </p>
          <a href="#" className="btn btn-secondary">
            Read our Customer Reviews
          </a>
        </div>
      </div>
    </div>
  );
}

function SideBar() {
  const navigate = useNavigate();

  return (
    <div
      className="offcanvas offcanvas-start"
      data-bs-scroll="true"
      tabIndex="-1"
      id="offcanvasWithBothOptions"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">Menu</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
        ></button>
      </div>
      <div className="offcanvas-body">
        <ul className="canvas-list">
          <button type="button" className="btn" onClick={() => navigate("/")}>
            Home
          </button>
          <button type="button" className="btn" onClick={() => navigate("/login")}>
            Login/Signup
          </button>
        </ul>
      </div>
    </div>
  );
}

function OurTeam() {
  return (
    <div className="our-team-container">
      <h2 className="our-team-header text-new">Our Team</h2>
      <div className="team-members">
        {["YS Snigdha", "Team Member 2", "Team Member 3", "Team Member 4"].map(
          (member, index) => (
            <div className="team-member" key={index}>
              <img src="src/assets/SS_photo.jpeg" alt={member} className="team-image" />
              <p className="team-caption text-new">{member}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function ContactUs() {
  return (
    <div className="contact-us-container">
      <h2 className="text-new">Contact Us</h2>
      <form className="contact-form">
        {["Full Name", "Email Address", "Subject", "Message"].map((field, index) => (
          <div className="form-group text-new" key={index}>
            <label>{field}</label>
            <input type={index === 1 ? "email" : "text"} className="form-control" required />
          </div>
        ))}
        <button type="submit" className="btn btn-secondary text-new">
          Submit
        </button>
      </form>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <NavBar />
      <SideBar />
      <HomeCarousel />
      <HomeAccordion />
      <Review />
      <OurTeam />
      <ContactUs />
    </>
  );
}

export default HomePage;
