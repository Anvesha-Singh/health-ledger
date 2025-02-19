import React from 'react';

const PatientList = () => {
  const patients = [
    { id: 'P1068', name: 'Kevin Jose' },
    { id: 'P1067', name: 'Prisha Patel' },
    { id: 'P1048', name: 'Sneha Prajapati' },
    { id: 'P1022', name: 'Hardik K' }
  ];

  return (
    <div className="patient-list">
      {patients.map(patient => (
        <div key={patient.id} className="patient-item">
          <div className="patient-info">
            <span className="patient-id">{patient.id}</span>
            <span className="patient-name">{patient.name}</span>
          </div>
          <div className="doctor-actions">
            <button className="all-btns">View History</button>
            <button className="all-btns">Summarize {'\u2728'}</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientList;