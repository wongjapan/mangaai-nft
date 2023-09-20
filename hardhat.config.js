

require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");


module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: "https://binance.nodereal.io",
        allowUnlimitedContractSize: true,
        chainId: 56
      }

    },
    binance: {
      url: process.env.RPC,
      accounts: [
        process.env.PRIVATE_KEY,
      ],
      allowUnlimitedContractSize: true
    }

  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.API_KEY,

  },

  solidity: {
    compilers: [
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },

      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },

    ],

  },

};
