import React, { useState, useEffect, useContext } from 'react';
import { ContractContext } from './context/ContractContext';
import Web3 from 'web3';
import Header from './components/Header';
import './styles.css';

const AdminDashboard = () => {
  const [hospitalName, setHospitalName] = useState('');
  const [doctor, setDoctor] = useState({ address: '', name: '', specialization: '' });
  const [message, setMessage] = useState('');
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { contract } = useContext(ContractContext);
  const web3 = new Web3(window.ethereum);

  useEffect(() => {
    const loadHospitalAndDoctors = async () => {
      try {
        setLoading(true);
        const accounts = await web3.eth.getAccounts();
    
        // Load hospital details
        const hospitalData = await contract.methods.hospitals(accounts[0]).call();
        setHospitalName(hospitalData.name || '');
    
        // Fetch doctor addresses registered by this admin
        const doctorAddresses = await contract.methods.getDoctorsByAdmin(accounts[0]).call({
          from: accounts[0],
          gas: 300000
        });
    
        if (doctorAddresses && doctorAddresses.length > 0) {
          // Fetch full details for each doctor
          const doctorsData = await Promise.all(
            doctorAddresses.map(async (address) => {
              const [name, specialization, hospital] = await contract.methods.getDoctorDetails(address).call({
                from: accounts[0],
                gas: 100000
              });
              return {
                address,
                name,
                specialization,
                hospital
              };
            })
          );
          setDoctorsList(doctorsData);
        } else {
          setDoctorsList([]);
        }
        setMessage('');
      } catch (err) {
        console.error('Loading error:', err);
        setMessage('Failed to load data: ' + (err.message || 'Unknown error'));
        setDoctorsList([]);
      } finally {
        setLoading(false);
      }
    };        

    if (contract) loadHospitalAndDoctors();
  }, [contract]);

  const handleHospitalRegistration = async (e) => {
    e.preventDefault();
    try {
      setMessage('Processing transaction...');
      const accounts = await web3.eth.getAccounts();
      await contract.methods.registerHospital(hospitalName).send({ 
        from: accounts[0],
        gas: 200000 // Explicit gas limit
      });
      setMessage('Hospital registered successfully!');
      
      // Reload data after registration
      window.location.reload();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleDoctorRegistration = async (e) => {
    e.preventDefault();
    try {
      setMessage('Processing transaction...');
      const accounts = await web3.eth.getAccounts();
      await contract.methods.registerDoctor(
        doctor.address,
        doctor.name,
        doctor.specialization
      ).send({ 
        from: accounts[0],
        gas: 300000 // Explicit gas limit
      });
      setMessage('Doctor registered successfully!');
      setDoctor({ address: '', name: '', specialization: '' });
      
      // Reload data after registration
      window.location.reload();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        
        {/* Two-column layout container */}
        <div className="dashboard-columns">
          {/* Left Column: Hospital info and forms */}
          <div className="column left-column">
            {/* Hospital Info */}
            <div className="hospital-info">
              <h4>Hospital: {hospitalName}</h4>
            </div>
  
            {/* Hospital Registration */}
            <div className="section">
              <h4>Update Hospital: </h4>
              <form onSubmit={handleHospitalRegistration}>
                <input
                  type="text"
                  placeholder="Hospital Name"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  required
                />
                <button className="all-btns" type="submit">Register Hospital</button>
              </form>
            </div>
  
            {/* Doctor Registration */}
            <div className="section">
              <br></br>
              <h4>Register New Doctor</h4>
              <form onSubmit={handleDoctorRegistration}>
                <input
                  type="text"
                  placeholder="Doctor Wallet Address"
                  value={doctor.address}
                  onChange={(e) => setDoctor({ ...doctor, address: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={doctor.name}
                  onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Specialization"
                  value={doctor.specialization}
                  onChange={(e) => setDoctor({ ...doctor, specialization: e.target.value })}
                  required
                />
                <button className="all-btns" type="submit">Register Doctor</button>
              </form>
            </div>
          </div>
          
          {/* Right Column: Registered Doctors List */}
          <div className="column right-column">
            <div className="section doctors-section">
              <h4>Registered Doctors ({doctorsList.length})</h4>
              {loading ? (
                <div>Loading doctors data...</div>
              ) : doctorsList.length === 0 ? (
                <div className="empty-state">No doctors registered yet</div>
              ) : (
                <div className="doctors-grid">
                  {doctorsList.map((doc) => (
                    <div className="doctor-card" key={doc.address}>
                    <div className="doctor-header">
                      <h4>{doc.name}</h4>
                      <span>{doc.specialization}</span>
                    </div>
                    <div className="doctor-details">
                      <p>Hospital: {doc.hospital}</p>
                      <p className="address">Address: {doc.address.substring(0, 10)}...</p>
                    </div>
                  </div>                  
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
  
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );  
};

export default AdminDashboard;