import InkDrop from './contracts/InkDrop.json'

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545',
    },
  },
  contracts: [InkDrop],
  // events: {
  //   InkDrop: ['LogNewUser', 'LogUpdateUser', 'LogDeleteUser'],
  // },
  polls: {
    accounts: 3000,
    blocks: 3000,
  },
}

export default drizzleOptions
