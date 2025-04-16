import { useContract, useSigner } from 'wagmi';

export const checkUserRole = async (address) => {
  const contract = useContract({
    address: process.env.REACT_APP_CONTRACT_ADDRESS,
    abi: MedicalAuthABI,
    signerOrProvider: useSigner(),
  });

  const isPatient = await contract.hasRole(PATIENT_ROLE, address);
  const isDoctor = await contract.hasRole(DOCTOR_ROLE, address);
  
  return { isPatient, isDoctor };
};