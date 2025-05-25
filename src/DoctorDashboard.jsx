import React, { useState, useContext, useEffect } from 'react';
import Header from './components/Header';
import DoctorDetails from './components/DoctorDetails';
import { ContractContext } from './context/ContractContext';
import Web3 from 'web3';
import './styles.css';

const DoctorDashboard = () => {
  const { contract } = useContext(ContractContext);
  const [appointments, setAppointments] = useState([]);
  const [historyModal, setHistoryModal] = useState({ open: false, files: [], patientName: '', patientAddress: '' });
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Summarize modal state
  const [summaryModal, setSummaryModal] = useState({ open: false, summary: null, loading: false, error: null, patientName: '' });

  const web3 = new Web3(window.ethereum);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        const doctorAddress = accounts[0];
        const appointmentsRaw = await contract.methods.getDoctorAppointments().call({ from: doctorAddress });
        const appointmentsWithNames = await Promise.all(
          appointmentsRaw.map(async (app, idx) => {
            const patientDetails = await contract.methods.patients(app.patient).call();
            return {
              index: idx,
              name: patientDetails.name,
              patient: app.patient,
              date: new Date(Number(app.date) * 1000).toLocaleDateString(),
              time: app.timeSlot,
            };
          })
        );
        setAppointments(appointmentsWithNames);
      } catch (error) {
        console.error("Error loading appointments:", error);
      }
    };

    if (contract) {
      loadAppointments();
      const interval = setInterval(loadAppointments, 10000);
      return () => clearInterval(interval);
    }
  }, [contract]);

  const handleViewHistory = async (patientAddress, patientName) => {
    setLoadingHistory(true);
    try {
      const accounts = await web3.eth.getAccounts();
      const files = await contract.methods.getPatientFiles(patientAddress).call({ from: accounts[0] });
      setHistoryModal({ open: true, files, patientName, patientAddress });
    } catch (err) {
      alert('Unable to fetch history. You may not have access.');
      setHistoryModal({ open: false, files: [], patientName: '', patientAddress: '' });
    } finally {
      setLoadingHistory(false);
    }
  };

  // Summarize Handler
  const handleSummarize = async (patientAddress, patientName) => {
    setSummaryModal({ open: true, summary: null, loading: true, error: null, patientName });
    try {
      const accounts = await web3.eth.getAccounts();
      const files = await contract.methods.getPatientFiles(patientAddress).call({ from: accounts[0] });
      const pdfFiles = files
        .filter(f => f.fileName && f.fileName.toLowerCase().endsWith('.pdf'))
        .map(f => ({
          url: `https://gateway.pinata.cloud/ipfs/${f.ipfsHash}`,
          fileName: f.fileName
        }));

      if (pdfFiles.length === 0) {
        setSummaryModal({ open: true, summary: null, loading: false, error: "No PDF files found for summarization.", patientName });
        return;
      }

      const response = await fetch("http://localhost:5000/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: pdfFiles })
      });
      const result = await response.json();
      if (result.summary) {
        setSummaryModal({ open: true, summary: result.summary, loading: false, error: null, patientName });
      } else {
        setSummaryModal({ open: true, summary: null, loading: false, error: result.error || "Summarization failed.", patientName });
      }
    } catch (err) {
      setSummaryModal({ open: true, summary: null, loading: false, error: err.message, patientName });
    }
  };

  return (
    <div className="app-container" style={{ background: "#e0f7fa", minHeight: "100vh", padding: "2rem" }}>
      <Header />
      <div className="dashboard-content" style={{ maxWidth: 700, margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px #0001", padding: "2rem" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Your Profile</h2>
        <DoctorDetails />
        <h2 style={{ margin: "2rem 0 1rem" }}>Appointments ({appointments.length})</h2>
        <div>
          {appointments.length > 0 ? (
            appointments.map((app) => (
              <div key={app.index} style={{
                background: "#222",
                color: "#fff",
                borderRadius: 12,
                marginBottom: "1.5rem",
                padding: "1.25rem 1.5rem",
                boxShadow: "0 1px 4px #0002"
              }}>
                <div style={{ fontSize: "1.15rem", fontWeight: 600, marginBottom: 4 }}>{app.name}</div>
                <div style={{ fontSize: "0.95rem", color: "#b2ebf2", marginBottom: 8 }}>
                  {app.patient.substring(0, 8)}...
                </div>
                <div style={{ display: "flex", gap: "1.5rem", marginBottom: 12 }}>
                  <span>📅 <b>{app.date}</b></span>
                  <span>⏰ <b>{app.time}</b></span>
                </div>
                <div style={{ display: "flex", gap: "1em" }}>
                  <button
                    className="all-btns"
                    style={{
                      background: "#0288d1",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "0.6em 1.2em",
                      fontWeight: 600,
                      fontSize: "1rem",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                    onClick={() => handleViewHistory(app.patient, app.name)}
                    disabled={loadingHistory && historyModal.patientAddress === app.patient}
                  >
                    {loadingHistory && historyModal.patientAddress === app.patient ? "Loading..." : "View History"}
                  </button>
                  <button
                    className="all-btns"
                    style={{
                      background: "#43a047",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "0.6em 1.2em",
                      fontWeight: 600,
                      fontSize: "1rem",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                    onClick={() => handleSummarize(app.patient, app.name)}
                  >
                    Summarize
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: "#444", textAlign: "center", marginTop: "2rem" }}>
              <p>No appointments found</p>
              <small>Patients' bookings will appear here automatically</small>
            </div>
          )}
        </div>
      </div>

      {/* History Modal */}
      {historyModal.open && (
        <div className="modal-overlay" style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div className="modal-content" style={{
            background: "#fff", borderRadius: 12, padding: "2rem", width: "95%", maxWidth: 500, boxShadow: "0 2px 12px #0003"
          }}>
            <h3 style={{ marginBottom: 12 }}>
              Medical History for <b>{historyModal.patientName}</b>
              <span style={{ fontSize: "0.9em", color: "#0288d1", marginLeft: 8 }}>
                ({historyModal.patientAddress.substring(0, 8)}...)
              </span>
            </h3>
            {historyModal.files.length === 0 ? (
              <p>No medical files found for this patient.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: "1em 0" }}>
                {historyModal.files.map((file, idx) => (
                  <li key={idx} style={{
                    background: "#f5f5f5", borderRadius: 8, marginBottom: 10, padding: "0.7em 1em", display: "flex", alignItems: "center", justifyContent: "space-between"
                  }}>
                    <span>📄 {file.fileName}</span>
                    <span style={{ color: "#0288d1", fontSize: "0.95em" }}>🗓️ {new Date(Number(file.timestamp) * 1000).toLocaleDateString()}</span>
                    <a
                      href={`https://gateway.pinata.cloud/ipfs/${file.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#fff", background: "#0288d1", borderRadius: 4, padding: "0.3em 0.8em", textDecoration: "none", fontWeight: 500
                      }}
                    >
                      View File
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <button
              className="all-btns"
              style={{
                background: "#0288d1", color: "#fff", border: "none", borderRadius: 6, padding: "0.6em 1.2em", fontWeight: 600, fontSize: "1rem", cursor: "pointer"
              }}
              onClick={() => setHistoryModal({ open: false, files: [], patientName: '', patientAddress: '' })}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Summarize Modal */}
      {summaryModal.open && (
        <div className="modal-overlay" style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.45)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div className="modal-content" style={{
            background: "#fff", borderRadius: 12, padding: "2rem", width: "95%", maxWidth: 600, boxShadow: "0 2px 12px #0003"
          }}>
            <h3 style={{ marginBottom: 12 }}>
              Medical Summary for <b>{summaryModal.patientName}</b>
            </h3>
            {summaryModal.loading && <p>Summarizing...</p>}
            {summaryModal.error && <p style={{ color: "red" }}>{summaryModal.error}</p>}
            {summaryModal.summary && (
              <div style={{ textAlign: "left" }}>
                {Object.entries(summaryModal.summary).map(([key, values]) => (
                  <div key={key} style={{ marginBottom: "1em" }}>
                    <strong>{key}:</strong>
                    <ul>
                      {values.map((val, idx) => (
                        <li key={idx}>{val}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            <button
              className="all-btns"
              style={{
                background: "#43a047", color: "#fff", border: "none", borderRadius: 6, padding: "0.6em 1.2em", fontWeight: 600, fontSize: "1rem", cursor: "pointer"
              }}
              onClick={() => setSummaryModal({ open: false, summary: null, loading: false, error: null, patientName: '' })}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;