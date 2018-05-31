import Authentication from './../build/contracts/Authentication.json'
import InkDrop from './../build/contracts/InkDrop.json'

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545',
    },
  },
  contracts: [Authentication, InkDrop],
  // events: {
  //   InkDrop: ['LogNewUser', 'LogUpdateUser', 'LogDeleteUser'],
  // },
  polls: {
    accounts: 10000,
    blocks: 10000,
  },
}

export default drizzleOptions
