// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract HealthLedger {
    enum Role { Patient, Doctor, Admin }
    
    struct Patient {
        string name;
        uint256 age;
        string gender;
        string username;
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
    mapping(address => Patient) public patients;
    mapping(address => Doctor) public doctors;
    mapping(address => Hospital) public hospitals;
    
    address[] public allHospitals;

    constructor() {
        roles[msg.sender] = Role.Admin;
    }

    modifier onlyAdmin() {
        require(roles[msg.sender] == Role.Admin, "Only admin");
        _;
    }

    function registerHospital(string memory _name) public onlyAdmin {
        hospitals[msg.sender] = Hospital(_name, msg.sender);
        allHospitals.push(msg.sender);
    }

    function addDoctor(
        address _doctorAddress,
        string memory _name,
        string memory _specialization
    ) public onlyAdmin {
        require(roles[_doctorAddress] == Role.Doctor, "Not a doctor");
        doctors[_doctorAddress] = Doctor(
            _name,
            _specialization,
            hospitals[msg.sender].name
        );
    }

    function registerPatient(
        string memory _name,
        uint256 _age,
        string memory _gender,
        string memory _username
    ) public {
        require(roles[msg.sender] != Role.Admin, "Admins cannot register as patients");
        roles[msg.sender] = Role.Patient;
        patients[msg.sender] = Patient(_name, _age, _gender, _username);
    }
}