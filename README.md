# Introduction to Health Ledger 

Health Ledger is a blockchain-based decentralized healthcare management system designed to securely store and manage medical records, prescriptions, and appointments. It leverages Ethereum smart contracts to ensure data integrity, transparency, and patient control over their health information.

### Key Features:
**1. Medical Record Management:** Patients can securely store and manage their medical records, including prescriptions and test results.

**2. Appointment Scheduling:** A system for booking appointments with healthcare providers, allowing only booked doctors to access a patient's records.

**3. Access Control:** Patients have full control over who can access their medical data, promoting privacy and consent.

**4. Blockchain Security:** Only authorized Admins able to register Doctors with valid accounts.

**5. AI Summarizer:** A Generative AI model used for providing quick overview of the patient's history highlighting key issues.

## Demo Video

https://github.com/user-attachments/assets/a7be000c-4385-446c-9d07-c82206ee9ddc

## Prerequisites

- Node.js & npm
- Python 3
- Ganache
- MetaMask
- Remix IDE

---

## Deploying the Website

```bash
git clone https://github.com/Anvesha-Singh/health-ledger.git
cd health-ledger
npm run dev
```

---

## Deploying Smart Contract

1. Start Ganache with specific network ID in a separate terminal:
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

---

## Deploying AI Summarizer 

1. Make an account on Gemini.
2. Create a new API Key.
3. Copy the key into a .env file.
   ```bash
   GEMINI_API_KEY
   ```
4. Start the summarizer in a third terminal:
   ```bash
   python3 app.py
   ```
   
