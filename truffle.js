var HDWalletProvider = require('truffle-hdwallet-provider')
const MNEMONIC =
	'quality mansion situate route collect ordinary battle obtain steel cliff okay hood'
const INFURA_API_KEY = 'IUwznLojjNjORwD2X2bO'

module.exports = {
	// See <http://truffleframework.com/docs/advanced/configuration>
	// to customize your Truffle configuration!
	networks: {
		development: {
			host: '127.0.0.1',
			port: 8545,
			// provider: function() {
			// 	return new HDWalletProvider(MNEMONIC, 'http://127.0.0.1:8545/')
			// },
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
			gas: 4712388,
			gasPrice: 100000000000,
		},
	},
}
