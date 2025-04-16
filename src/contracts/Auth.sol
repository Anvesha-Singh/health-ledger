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

    mapping(address => Role) public roles;
    mapping(address => Hospital) public hospitals;
    mapping(address => Doctor) public doctors;
    mapping(address => Patient) public patients;
    mapping(address => address[]) public adminDoctors;
    mapping(address => address[]) public doctorPatients;

    event RoleUpdated(address indexed user, Role role);
    event PatientAdded(address indexed doctor, address patient, string name);

    function addPatient(address _patient, string memory _name) external onlyDoctor {
        require(roles[_patient] == Role.Unregistered, "Patient already registered");
        
        roles[_patient] = Role.Patient;
        patients[_patient] = Patient(_name, 0, "");  
        doctorPatients[msg.sender].push(_patient);
        
        emit PatientAdded(msg.sender, _patient, _name);
    }

    modifier onlyDoctor() {
        require(roles[msg.sender] == Role.Doctor || roles[msg.sender] == Role.Admin, "Not a doctor");
        _;
    }

    constructor() {
        roles[msg.sender] = Role.Admin;
        emit RoleUpdated(msg.sender, Role.Admin);
    }

    function getRole(address _user) external view returns (uint8) {
        return uint8(roles[_user]);
    }

    modifier onlyAdmin() {
        require(roles[msg.sender] == Role.Admin, "Unauthorized access");
        _;
    }

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
        doctors[_doctor] = Doctor({
            name: _name,
            specialization: _specialization,
            hospital: hospitals[msg.sender].name 
        });
        adminDoctors[msg.sender].push(_doctor);
        emit RoleUpdated(_doctor, Role.Doctor);
    }

    event PatientRegistered(address indexed patient);

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

    function getDoctorsByAdmin(address admin) public view returns (address[] memory) {
        return adminDoctors[admin];
    }

    function getDoctorDetails(address doctor) public view returns (string memory, string memory, string memory) {
        Doctor memory d = doctors[doctor];
        return (d.name, d.specialization, d.hospital);
    }

    function getPatientsByDoctor(address doctor) external view returns (Patient[] memory) {
        address[] memory patientAddresses = doctorPatients[doctor];
        Patient[] memory result = new Patient[](patientAddresses.length);
        
        for (uint i = 0; i < patientAddresses.length; i++) {
            result[i] = patients[patientAddresses[i]];
        }
        return result;
    }
}