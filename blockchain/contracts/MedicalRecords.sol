// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;



contract MedicalRecords {

    struct Record {

        string patientName;

        string medicalHistory;

        address uploadedBy;

    }



    mapping(address => Record[]) public patientRecords;



    // Add a new record

    function addRecord(string memory _name, string memory _history) public {

        patientRecords[msg.sender].push(Record(_name, _history, msg.sender));

    }



    // Get all records for a patient

    function getRecords(address _patient) public view returns (Record[] memory) {

        return patientRecords[_patient];

    }

}