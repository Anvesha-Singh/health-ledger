import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ContractContext } from "./context/ContractContext";
import Web3 from "web3";
import Header from "./components/Header";
import "./styles.css";

const PatientAppointment = () => {
  const { contract } = useContext(ContractContext);
  const navigate = useNavigate();
  const web3 = new Web3(window.ethereum);
  const [mode, setMode] = useState("book");
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [slot, setSlot] = useState("");
  const [date, setDate] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [patientAddress, setPatientAddress] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [timeSlots, setTimeSlots] = useState(["10:00 AM", "2:00 PM", "4:00 PM"]);

  useEffect(() => {
    const loadData = async () => {
      const accounts = await web3.eth.getAccounts();
      setPatientAddress(accounts[0]);
      const doctorAddresses = await contract.methods.getAllDoctors().call();
      const doctorDetails = await Promise.all(
        doctorAddresses.map(async addr => {
          const details = await contract.methods.getDoctorDetails(addr).call();
          return { 
            address: addr,
            name: details[0],
            specialization: details[1]
          };
        })
      );
      const specs = [...new Set(doctorDetails.map(d => d.specialization))];
      setSpecializations(specs);
      setDoctors(doctorDetails);
    };
    if (contract) loadData();
  }, [contract]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedDoctorAddress = doctor;
    try {
      const accounts = await web3.eth.getAccounts();
      const timestamp = Math.floor(new Date(date).getTime() / 1000);
      await contract.methods.bookAppointment(
        selectedDoctorAddress,
        timestamp,
        slot
      ).send({ from: accounts[0], gas: 500000 });
      navigate(-1);
    } catch (err) {
      console.error("Booking failed:", err);
      alert(`Appointment failed: ${err.message}`);
    }
  };  

  return (
    <div className="app-container">
      <Header />
      <div className="dashboard-content" style={{
        maxWidth: "650px",
        margin: "2rem auto",
        background: "#fff",
        borderRadius: "14px",
        boxShadow: "0 2px 12px #0002",
        padding: "2.5rem 2.5rem"
      }}>
        <h1 className="dashboard-title" style={{textAlign: "center", marginBottom: "2rem"}}>
          {mode === "book" ? "Book Appointment" : "Reschedule Appointment"}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{marginBottom: "1.4rem"}}>
            <label>Patient Address</label>
            <input
              type="text"
              value={patientAddress}
              readOnly
              className="form-input"
              style={{width: "100%"}}
            />
          </div>
          <div className="form-group" style={{marginBottom: "1.4rem"}}>
            <label>Department</label>
            <select
              value={department}
              onChange={e => {
                setDepartment(e.target.value);
                setDoctor("");
                setSlot("");
              }}
              className="form-select"
              required
              style={{width: "100%"}}
            >
              <option value="">Select Department</option>
              {specializations.map((spec, i) => (
                <option key={i} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{marginBottom: "1.4rem"}}>
            <label>Doctor</label>
            <select
              value={doctor}
              onChange={e => {
                setDoctor(e.target.value);
                setSlot("");
              }}
              className="form-select"
              required
              disabled={!department}
              style={{width: "100%"}}
            >
              <option value="">Select Doctor</option>
              {doctors
                .filter(d => d.specialization === department)
                .map((d, i) => (
                  <option key={i} value={d.address}>{d.name}</option>
                ))}
            </select>
          </div>
          <div className="form-group" style={{marginBottom: "1.4rem"}}>
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="form-input"
              required
              min={new Date().toISOString().split('T')[0]}
              style={{width: "100%"}}
            />
          </div>
          <div className="form-group" style={{marginBottom: "2rem"}}>
            <label>Time Slot</label>
            <select
              value={slot}
              onChange={e => setSlot(e.target.value)}
              className="form-select"
              required
              disabled={!doctor}
              style={{width: "100%"}}
            >
              <option value="">Select Time Slot</option>
              {timeSlots.map((t, i) => (
                <option key={i} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="all-btns" style={{width: "100%", marginTop: "1.5rem"}}>
            {mode === "reschedule" ? "Reschedule" : "Book"} Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientAppointment;