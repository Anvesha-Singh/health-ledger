import { useState } from 'react'
import { Link } from 'react';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';



class User {
  constructor(name, email, age, gender, city){
    this.name = name;
    this.email = email;
    this.age = age;
    this.gender = gender;
    this.city = city;
  }

  getDetails() {
    return '';
  }
}

class Patient extends User {
  constructor(name, email, age, gender, city, history){
    super(name, email, age, gender, city);
    this.history = history;
  }
}

class Doctor extends User {
  constructor(name, email, age, gender, city, specialisation){
    super(name, email, age, gender, city);
    this.specialisation = specialisation;
  }
}

function NavBar() {
  return (
    <nav className="navbar fixed-top navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand text-new" href="#">Health Ledger</a>
        <button
          className="btn"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasWithBothOptions"
          aria-controls="offcanvasWithBothOptions"
        >
          <img src="src/assets/list.svg"  width="30px" height="30rem"/>
        </button>
      </div>
    </nav>
  );
}

function HomeCarousal(){
  return (
    <div>
    <div id="carouselExampleRide" class="carousel slide" data-bs-ride="true" data-bs-interval="3000">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img className= "images" src="src/assets/carousal_1.jpg" class="d-block w-100"></img>
    </div>
    <div class="carousel-item">
      <img className= "images" src="src/assets/carousal_2.jpg" class="d-block w-100"></img>
    </div>
    <div class="carousel-item">
      <img className= "images" src="src/assets/carousal_3.jpg" class="d-block w-100"></img>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
    </div>
  );
}
function HomeAccordion(){
  return (
    <div className="accordion">
    <div class="accordion accordion-flush" id="accordionFlushExample">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed text-new" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
      Tamper-Free Storage
      </button>
    </h2>
    <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
      <div class="accordion-body text">Patient histories are securely stored on the blockchain, ensuring that the data is tamper-proof. Each patient's records are encrypted and stored in blocks that are immutable, making it impossible to alter or falsify the data. This ensures transparency and security for all patient information.</div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed text-new" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
      Doctor Tools
      </button>
    </h2>
    <div id="flush-collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
      <div class="accordion-body text">Doctors can access comprehensive patient history and receive AI-generated summaries of past conditions. This allows for quicker decision-making and more accurate diagnoses. The AI tools analyze past records and help doctors understand the patient's health trajectory, leading to better treatment outcomes.</div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed text-new" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
      AI Chatbot
      </button>
    </h2>
    <div id="flush-collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
      <div class="accordion-body text">Our AI-powered chatbot assists patients in analyzing their symptoms and recommending the right specialist based on their needs. The chatbot also allows for easy appointment booking, ensuring that patients receive timely care and consultation from the appropriate healthcare professional.</div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed text-new" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
      Patient Uploads
      </button>
    </h2>
    <div id="flush-collapseFour" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
      <div class="accordion-body text">Patients can upload documents like prescriptions, diagnoses, and consultation reports from non-participating hospitals. This feature ensures that all relevant medical records are available for review, regardless of where the patient received care, enhancing the continuity of care.</div>
    </div>
  </div>
</div>
</div>
  );
}

function Review() {
  return (
    <div className="review-container">
      <div className="card text-center mb-3">
        <div className="card-body">
          <h5 className="card-title text-new">Rajesh ~</h5>
          <p className="card-text italic-text">"I’ve been using this system for a while now, and I have to say it’s been a huge help in managing patient care. It’s reassuring to know that all patient histories are securely stored, and I can trust that the data is tamper-proof. The ability to access a patient's past medical conditions and get AI-generated summaries has made my consultations much smoother and more informed.
          </p>
          <a href="#" className="btn btn-secondary">Read our Customer Reviews</a>
        </div>
      </div>
    </div>
  );
}

function SideBar() {
  return (
    <div
      className="offcanvas offcanvas-start"
      data-bs-scroll="true"
      tabIndex="-1"
      id="offcanvasWithBothOptions"
      aria-labelledby="offcanvasWithBothOptionsLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Menu</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        <ul className="canvas-list">
          <button type="button" className="btn"><li className="canvas-items">Home</li></button>
          <button type="button" className="btn"><li className="canvas-items">About</li></button>
          <button type="button" className="btn"><li className="canvas-items">Login/Signup</li></button>
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
        <div className="team-member">
          <img src="src/assets/SS_photo.jpeg" alt="Team Member 1" className="team-image" />
          <p className="team-caption text-new">YS Snigdha</p>
        </div>
        <div className="team-member">
          <img src="src/assets/SS_photo.jpeg" alt="Team Member 2" className="team-image" />
          <p className="team-caption text-new">Team Member 2</p>
        </div>
        <div className="team-member">
          <img src="src/assets/SS_photo.jpeg" alt="Team Member 3" className="team-image" />
          <p className="team-caption text-new">Team Member 3</p>
        </div>
        <div className="team-member">
          <img src="src/assets/SS_photo.jpeg" alt="Team Member 4" className="team-image" />
          <p className="team-caption text-new">Team Member 4</p>
        </div>
      </div>
    </div>
  );
}

function ContactUs() {
  return (
    <div className="contact-us-container">
      <div className="contact-us-header text-new">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you! Please fill out the form below and we'll get in touch with you as soon as possible.</p>
      </div>
      
      <form className="contact-form">
        <div className="form-group text-new">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" className="form-control" placeholder="Enter your full name" required />
        </div>

        <div className="form-group text-new">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" className="form-control" placeholder="Enter your email" required />
        </div>

        <div className="form-group text-new">
          <label htmlFor="subject">Subject</label>
          <input type="text" id="subject" className="form-control" placeholder="Enter the subject" required />
        </div>

        <div className="form-group text-new">
          <label htmlFor="message">Message</label>
          <textarea id="message" className="form-control" rows="4" placeholder="Your message here..." required></textarea>
        </div>

        <button type="submit" className="btn btn-secondary text-new ">Submit</button>
      </form>

      <div className="contact-info text-new">
        <h3>Our Office</h3>
        <p>1234 Gandhi Street, Hyderabad, India</p>
        <p>Email: contactus@healthLedger.com</p>
        <p>Phone: +91 7075550207</p>
      </div>
    </div>
  );
}

function DoctorDashboard() {
  return (
    <>
      <NavBar />
    </>
  );
}
function HomePage() {
  return (
    <>
      <NavBar />
      <SideBar />
      <HomeCarousal />
      <HomeAccordion />
      <Review />
      <OurTeam />
      <ContactUs />
    </>
  );
}

function Signup() {
  const [userType, setUserType] = useState('patient'); // Default to 'patient'

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-header">Signup</h2>
        <form className="signup-form">
          <div className="form-groups">
            <label htmlFor="userType">User Type</label>
            <select
              id="userType"
              name="userType"
              className="form-control"
              value={userType}
              onChange={handleUserTypeChange}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <div className="form-groups">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" className="form-control" required />
          </div>
          <div className="form-groups">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" className="form-control" required />
          </div>
          <div className="form-groups">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" className="form-control" required />
          </div>
          <div className="form-groups">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" className="form-control" required />
          </div>
          <div className="form-groups">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input type="tel" id="phoneNumber" name="phoneNumber" className="form-control" required />
          </div>
          <div className="form-groups">
            <label htmlFor="age">Age</label>
            <input type="number" id="age" name="age" className="form-control" required />
          </div>
          <div className="form-groups">
            <label htmlFor="gender">Gender</label>
            <select id="gender" name="gender" className="form-control" required>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-groups">
            <label htmlFor="city">City</label>
            <input type="text" id="city" name="city" className="form-control" required />
          </div>

          {userType === 'doctor' && (
            <div className="form-groups">
              <label htmlFor="hospital">Hospital</label>
              <input type="text" id="hospital" name="hospital" className="form-control" required />
            </div>
          )}

          <button type="submit" className="btn btn-secondary">Signup</button>
        </form>
        <p className="login-link">
          Already a user? {/* <Link to="/login">Login</Link> */}
        </p>
      </div>
    </div>
  );
}
function LoginList(){
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-header">Login</h2>
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="loginId">Login ID</label>
            <input type="text" id="loginId" name="loginId" className="form-control" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" className="form-control" required />
          </div>
          <button type="submit" className="btn btn-secondary">Login</button>
        </form>
        <p className="signup-link">
          Not a user? {/*<Link to="/signup">Signup</Link>*/}
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/login" element={<LoginList />} />
    //     <Route path="/signup" element={<Signup />} />
    //   </Routes>
    // </Router>
    <HomePage />
  )
}

export default App 
