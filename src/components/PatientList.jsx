import React, { useState } from "react";

const PatientList = () => {
  const patients = [
    { id: "P1068", name: "Jane Doe" },
    { id: "P1067", name: "Prisha Patel" },
    { id: "P1048", name: "Sneha Prajapati" },
    { id: "P1022", name: "Hardik K" },
  ];

  const [summaries, setSummaries] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleSummarize = async (patientId) => {
    try {
      const response = await fetch("http://localhost:5000/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patient_id: patientId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSummaries((prev) => ({ ...prev, [patientId]: data.summary }));
      setOpenDropdown(openDropdown === patientId ? null : patientId);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  return (
    <div className="patient-list">
      {patients.map((patient) => (
        <div key={patient.id} className="patient-container">
          {/* Patient Details */}
          <div className="patient-item">
            <div className="patient-info">
              <span className="patient-id">{patient.id}</span>
              <span className="patient-name">{patient.name}</span>
            </div>
            <div className="doctor-actions">
              <button className="all-btns">View History</button>
              <button className="all-btns" onClick={() => handleSummarize(patient.id)}>
                Summarize AI {"\u2728"}
              </button>
            </div>
          </div>

          {/* Dropdown Summary (Separate Div) */}
          {openDropdown === patient.id && summaries[patient.id] && (
            <div className="summary-dropdown">
              <table className="summary-table">
                <tbody>
                  {Object.entries(summaries[patient.id]).map(([key, value], index) => (
                    <tr key={key} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                      <td><strong>{key}</strong></td>
                      <td>{Array.isArray(value) ? value.join(", ") : value || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PatientList;