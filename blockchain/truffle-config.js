module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545, // Port from Ganache
      network_id: "5777", // Match any network ID
    },
  },
  compilers: {
    solc: {
      version: "0.8.0", // Solidity version
    },
  },
};