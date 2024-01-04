import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Lock from "./artifacts/contracts/Lock.sol/Lock.json";

const LockAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

function App() {
  const [amount, setAmount] = useState("");
  const [licensor, setLicensor] = useState("");
  const [account, setAccount] = useState("");

  const requestAccount = async () => {
    if (typeof window != "undefined" && typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        console.log(accounts[0]);
      } catch (err) {
        console.error(err);
      }
    }
  }


  async function sendPayment() {
    if (!amount) return;

    if (window.ethereum) {
      await requestAccount();

      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(Lock.abi, LockAddress);
      const transaction = await contract.methods
        .receive({
          value: web3.utils.toWei(amount, "ether"),
          from: accounts[0],
        })
        .send();

      setAmount("");
      console.log("Transaction Hash:", transaction.transactionHash);
    }
  }

  async function updateLicensor() {
    if (!licensor) return;

    if (window.ethereum) {
      await requestAccount();

      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(Lock.abi, LockAddress);
      const transaction = await contract.methods
        .updateLicensor(licensor)
        .send({ from: accounts[0] });

      setLicensor("");
      console.log("Transaction Hash:", transaction.transactionHash);
    }
  }

  useEffect(() => {
    requestAccount();
  }, []);

  return (
    <div className="App">
      <div className="App-header">
        <h1>Lock Contract</h1>
        <h3>Interact with the Lock contract</h3>
        <div className="custom-buttons">
          <button onClick={sendPayment} style={{ backgroundColor: "green" }}>
            Send Payment
          </button>
          <button onClick={updateLicensor} style={{ backgroundColor: "red" }}>
            Update Licensor
          </button>
        </div>
        <input
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
          placeholder="Enter payment amount"
        />
        <input
          onChange={(e) => setLicensor(e.target.value)}
          value={licensor}
          placeholder="Enter new licensor address"
        />
      </div>
    </div>
  );
}

export default App;
