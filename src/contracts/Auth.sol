// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract HealthAuth {
    enum Role { Unregistered, Patient, Doctor, Admin }
    
    struct Patient {
        string name;
        uint256 age;
        string gender;
    }

    struct Doctor {
        string name;
        string specialization;
        string hospital;
    }

    struct Hospital {
        string name;
        address admin;
    }

    struct Appointment {
        address patient;
        uint256 date;
        string timeSlot;
    }

    struct MedicalFile {
        string ipfsHash;
        uint256 timestamp;
        string fileName;
    }

    // Core Mappings
    mapping(address => Role) public roles;
    mapping(address => Hospital) public hospitals;
    mapping(address => Doctor) public doctors;
    mapping(address => Patient) public patients;
    
    // Access Control
    mapping(address => address[]) public adminDoctors;
    mapping(address => address[]) public doctorPatients;
    mapping(address => address[]) public doctorAccess; // Doctor => Allowed Patients
    
    // Medical Records
    mapping(address => MedicalFile[]) private patientFiles;
    
    // Appointments
    mapping(address => Appointment[]) public doctorAppointments;
    address[] public doctorsArray;

    // Events
    event RoleUpdated(address indexed user, Role role);
    event PatientAdded(address indexed doctor, address patient, string name);
    event PatientRegistered(address indexed patient);
    event AppointmentBooked(address indexed patient, address indexed doctor, uint256 date, string timeSlot);
    event FileAdded(address indexed patient, string ipfsHash, string fileName);
    event AccessGranted(address indexed patient, address indexed doctor);

    // Modifiers
    modifier onlyDoctor() {
        require(roles[msg.sender] == Role.Doctor || roles[msg.sender] == Role.Admin, "Not a doctor");
        _;
    }

    modifier onlyAdmin() {
        require(roles[msg.sender] == Role.Admin, "Unauthorized access");
        _;
    }

    constructor() {
        roles[msg.sender] = Role.Admin;
        emit RoleUpdated(msg.sender, Role.Admin);
    }

    function getRole(address _user) external view returns (uint8) {
        return uint8(roles[_user]);
    }

    // Core Functions
    function registerHospital(string memory _name) external onlyAdmin {
        require(bytes(hospitals[msg.sender].name).length == 0, "Hospital already registered");
        hospitals[msg.sender] = Hospital(_name, msg.sender);
    }

    function registerDoctor(
        address _doctor,
        string memory _name,
        string memory _specialization
    ) external onlyAdmin {
        require(roles[_doctor] == Role.Unregistered, "Address already registered");
        require(bytes(hospitals[msg.sender].name).length > 0, "Register hospital first");
        
        roles[_doctor] = Role.Doctor;
        doctors[_doctor] = Doctor(_name, _specialization, hospitals[msg.sender].name);
        adminDoctors[msg.sender].push(_doctor);
        doctorsArray.push(_doctor);
        emit RoleUpdated(_doctor, Role.Doctor);
    }

    function registerPatient(
        string memory _name,
        uint256 _age,
        string memory _gender
    ) external {
        require(roles[msg.sender] == Role.Unregistered, "Already registered");
        require(bytes(_name).length > 0, "Name required");
        require(_age > 0, "Invalid age");
        
        roles[msg.sender] = Role.Patient;
        patients[msg.sender] = Patient(_name, _age, _gender);
        emit PatientRegistered(msg.sender);
        emit RoleUpdated(msg.sender, Role.Patient);
    }

    // Appointment System

    function getDoctorAppointments(address _doctor) public view returns (Appointment[] memory) {
        return doctorAppointments[_doctor];
    }

    function bookAppointment(address _doctor, uint256 _date, string memory _timeSlot) external {
        require(roles[msg.sender] == Role.Patient, "Not a patient");
        require(roles[_doctor] == Role.Doctor, "Not a doctor");
        
        doctorAppointments[_doctor].push(Appointment(msg.sender, _date, _timeSlot));
        _grantAccess(_doctor, msg.sender);
        emit AppointmentBooked(msg.sender, _doctor, _date, _timeSlot);
    }

    // Medical Records
    function addMedicalFile(string memory _ipfsHash, string memory _fileName) external {
        require(roles[msg.sender] == Role.Patient, "Only patients can add files");
        require(bytes(_ipfsHash).length > 0, "Empty hash not allowed");
        
        patientFiles[msg.sender].push(MedicalFile(
            _ipfsHash,
            block.timestamp,
            _fileName
        ));
        emit FileAdded(msg.sender, _ipfsHash, _fileName);
    }

    // Access Control
    function grantAccess(address _doctor) external {
        require(roles[msg.sender] == Role.Patient, "Only patients can grant access");
        _grantAccess(_doctor, msg.sender);
    }

    // View Functions
    function getPatientFiles(address patient) external view returns (MedicalFile[] memory) {
        require(hasAccess(patient, msg.sender), "No access granted");
        return patientFiles[patient];
    }

    function getMyFiles() external view returns (MedicalFile[] memory) {
        return patientFiles[msg.sender];
    }

    function hasAccess(address patient, address doctor) public view returns (bool) {
        for (uint i = 0; i < doctorAccess[doctor].length; i++) {
            if (doctorAccess[doctor][i] == patient) return true;
        }
        return false;
    }

    // Internal Functions
    function _grantAccess(address _doctor, address _patient) internal {
        if (!hasAccess(_patient, _doctor)) {
            doctorAccess[_doctor].push(_patient);
            emit AccessGranted(_patient, _doctor);
        }
    }

    // Existing View Functions
    function getDoctorsByAdmin(address admin) public view returns (address[] memory) {
        return adminDoctors[admin];
    }

    function getDoctorDetails(address doctor) public view returns (string memory, string memory, string memory) {
        return (doctors[doctor].name, doctors[doctor].specialization, doctors[doctor].hospital);
    }

    function getDoctorAppointments() external view returns (Appointment[] memory) {
        return doctorAppointments[msg.sender];
    }

    function getAllDoctors() external view returns (address[] memory) {
        return doctorsArray;
    }

    function getMyFilesCount() external view returns (uint256) {
        return patientFiles[msg.sender].length;
    }

    function getMyFileAt(uint256 index) external view returns (
        string memory ipfsHash,
        uint256 timestamp,
        string memory fileName
    ) {
        require(index < patientFiles[msg.sender].length, "Index out of bounds");
        MedicalFile storage file = patientFiles[msg.sender][index];
        return (file.ipfsHash, file.timestamp, file.fileName);
    }
}