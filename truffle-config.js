require('dotenv').config()

var HDWalletProvider = require('truffle-hdwallet-provider')
const MNEMONIC = process.env.REACT_APP_MNEMONIC
const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, 'https://ropsten.infura.io/' + INFURA_API_KEY)
      },
      network_id: 3,
      gas: 4712388,
      gasPrice: 100000000000,
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, 'https://kovan.infura.io/' + INFURA_API_KEY)
      },
      network_id: 42,
      gas: 4712388,
      gasPrice: 100000000000,
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, 'https://rinkeby.infura.io/' + INFURA_API_KEY)
      },
      network_id: 4,
      gas: 6998777,
      gasPrice: 100000000000,
    },
  },
  solc: {
    // Turns on the Solidity optimizer. For development the optimizer's
    // quite helpful, just remember to be careful, and potentially turn it
    // off, for live deployment and/or audit time. For more information,
    // see the Truffle 4.0.0 release notes.
    //
    // https://github.com/trufflesuite/truffle/releases/tag/v4.0.0
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
}
