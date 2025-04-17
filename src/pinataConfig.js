import { PinataSDK } from "pinata-web3";

// Use environment variables for security
const pinataJwt = import.meta.env.VITE_PINATA_JWT;
const pinataGateway = import.meta.env.VITE_PINATA_GATEWAY;

// Create and export the Pinata client
export const pinata = new PinataSDK({
  pinataJwt,
  pinataGateway,
});

// Helper function to upload a file to Pinata
export const uploadToPinata = async (file) => {
  try {
    const result = await pinata.upload.file(file);
    if (!result || !result.IpfsHash) {
      throw new Error("Pinata upload failed: No hash returned.");
    }
    return result.IpfsHash;
  } catch (error) {
    console.error("Pinata upload error:", error);
    return null; // Always return null on failure
  }
};

// Export the gateway for use in file URLs
export { pinataGateway };