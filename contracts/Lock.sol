// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lock {
    address public licensor;

    event PaymentReceived(address indexed from, uint256 amount);
    event LicensorUpdated(address indexed oldLicensor, address indexed newLicensor);

    constructor() {
        licensor = msg.sender;
    }

    receive() external payable {
        require(msg.sender != licensor, "Licensor cannot pay itself");

        // Perform any additional logic or emit events as needed
        emit PaymentReceived(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function updateLicensor(address newLicensor) external {
        require(msg.sender == licensor, "Only licensor can update licensor");
        require(newLicensor != address(0), "Invalid address");

        emit LicensorUpdated(licensor, newLicensor);
        licensor = newLicensor;
    }

    function withdrawFunds() external {
        require(msg.sender == licensor, "Only licensor can withdraw funds");

        // Transfer the entire contract balance to the licensor
        payable(licensor).transfer(address(this).balance);
    }
}