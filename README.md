# Introduction to Health Ledger 

The Health Ledger project is a blockchain-based decentralized healthcare management system designed to securely store and manage medical records, prescriptions, and appointments. It leverages Ethereum smart contracts to ensure data integrity, transparency, and patient control over their health information.

### Key Features:
**Medical Record Management:** Patients can securely store and manage their medical records, including prescriptions and test results.

**Appointment Scheduling:** A system for booking appointments with healthcare providers, ensuring efficient scheduling and management.

**Access Control:** Patients have full control over who can access their medical data, promoting privacy and consent.

**Blockchain Security:** Utilizes blockchain technology to ensure data is tamper-proof and secure.

## Prerequisites

- Node.js & npm
- Python 3
- Ganache
- MetaMask
- Remix IDE

---

## Running the Website

```bash
git clone https://github.com/Anvesha-Singh/health-ledger.git
cd health-ledger
npm run dev
```

---

## Deploying Smart Contract

1. Start Ganache with specific network ID:
   ```bash
   ganache --networkId 1337
   ```
2. Copy the **first private key** and import it into MetaMask.
3. Make sure MetaMask is connected to **Localhost 8545**.
4. Open [Remix IDE](https://remix.ethereum.org/), paste and compile the contract in Auth.sol. (This project runs on ver 0.8.19)
5. In the "Deploy & Run" section:
   - Select **Injected Web3** as environment.
   - It should automatically load the imported account.
6. Deploy the contract.
7. Copy the **ABI** and **Contract Address** after deployment and paste them into Auth.json.

---

## Deploying IPFS (Pinata)

1. Make an account on Pinata.
2. Create a new API Key.
3. Copy the keys into a .env file.
   ```bash
   REACT_APP_PINATA_KEY
   REACT_APP_PINATA_SECRET
   VITE_PINATA_JWT
   VITE_PINATA_GATEWAY
   ```
