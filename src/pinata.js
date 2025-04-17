import axios from 'axios';

// Always use environment variables for sensitive data
const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET = process.env.REACT_APP_PINATA_SECRET;

export const uploadToPinata = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add metadata directly to FormData
    formData.append('pinataMetadata', JSON.stringify({
        name: file.name,
        keyvalues: {
            uploadedBy: 'patient-dapp'
        }
    }));
    
    try {
        const res = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET
                },
                maxContentLength: Infinity, // For large files
                maxBodyLength: Infinity
            }
        );
        console.log('Pinata Response:', res.data);
        return res.data.IpfsHash;
    } catch (error) {
        console.error('Pinata Error:', error.response?.data || error.message);
        throw new Error('File upload failed');
    }
};