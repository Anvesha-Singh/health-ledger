import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import DoctorDetails from './components/DoctorDetails';
import { ContractContext } from './context/ContractContext';
import Web3 from 'web3';
import './styles.css';

const DoctorDashboard = () => {
  const { contract } = useContext(ContractContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [summaryText, setSummaryText] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const web3 = new Web3(window.ethereum);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
          const accounts = await web3.eth.getAccounts();
          const doctorAddress = accounts[0]; // Assuming doctor is logged in
          
          // Use the new getter function with doctor's address
          const appointments = await contract.methods.getDoctorAppointments(doctorAddress).call();
          
          // Process appointments...
      } catch (error) {
          console.error("Error loading appointments:", error);
      }
    };
    
    if (contract) {
      loadAppointments();
      const interval = setInterval(loadAppointments, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [contract]);

  const handleAddSummary = async (index) => {
    if (!summaryText) return;
    
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.addAppointmentSummary(
        accounts[0],
        index,
        summaryText
      ).send({ from: accounts[0], gas: 500000 });
      setSummaryText('');
      setSelectedAppointment(null);
    } catch (err) {
      console.error('Error adding summary:', err);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <h1 className="dashboard-title">Doctor Dashboard</h1>
      
      <div className="dashboard-columns">
        <div className="column full-width">
          <div className="dashboard-section">
            <h4>Your Profile</h4>
            <DoctorDetails />
          </div>

          <div className="dashboard-section">
            <h4>Appointments ({appointments.length})</h4>
            <div className="patients-grid">
              {appointments.length > 0 ? (
                appointments.map((app) => (
                  <div key={app.index} className="patient-card">
                    <div className="card-header">
                      <h4>{app.name}</h4>
                      <span className="mono">{app.patient.substring(0, 6)}...</span>
                    </div>
                    <div className="card-details">
                      <p>📅 {app.date}</p>
                      <p>⏰ {app.time}</p>
                      {app.summary && (
                        <div className="summary-preview">
                          <p>📝 {app.summary.substring(0, 50)}...</p>
                        </div>
                      )}
                    </div>
                    <div className="card-actions">
                      <button 
                        className="action-btn view"
                        onClick={() => setSelectedAppointment(app)}
                      >
                        {app.summary ? 'View Summary' : 'Add Summary'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No appointments found</p>
                  <small>Patients' bookings will appear here automatically</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Modal */}
      {selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Appointment Summary</h3>
            {selectedAppointment.summary ? (
              <>
                <div className="summary-display">
                  <p>{selectedAppointment.summary}</p>
                </div>
                <button 
                  className="all-btns"
                  onClick={() => setSelectedAppointment(null)}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <textarea
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  placeholder="Enter clinical summary..."
                  className="summary-textarea"
                />
                <div className="modal-actions">
                  <button 
                    className="all-btns secondary"
                    onClick={() => setSelectedAppointment(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="all-btns"
                    onClick={() => handleAddSummary(selectedAppointment.index)}
                  >
                    Save Summary
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;