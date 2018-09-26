# InkDrop

This is the repository of the InkDrop platform. InkDrop is a microblogging platform everyday people can use to help spread their message. In return, people can earn crypto currency tokens by giving something back to the network in the form of appreciated content or care (by fighting platform abuse).

Our goal is to develop a fully decentralized platform based on ethereum and IPFS with no (or as little as possible) centralized entities involved. The project is based arround a set of smart contracts (you find them in the `contracts` folder) and a React frontend (check the `src` folder) with an optimistic UI apporach (we do not want to bother the user about the transaction speed or throughput issues).

## Smart Contracts

All of the platform's logic is embedded in the smart contract `InkDrop.sol`. We use `ZeppelinOS` for the implementation of a fully upgradeably smart contract using a proxy system: for each deployed contract implementation (the logic contract), another, user-facing contract is deployed as well (the proxy). The proxy will be the one in charge of the contract's storage, but will forward all function calls to the backing logic contract.

Please see the `DEPLOY_GUIDE.md` for further instructions how to deploy our upgradeable smart contract. Feel free to deploy the smart contract to your local testnet. **But: A deployment or update of the contract on the rinkeby testnet is only allowed by the admin (Michael Kaserer)!**

All unit tests for the smart contract can be found in the `test` folder. We write our test cases in Javascript based on [Mocha](https://mochajs.org/) testing framework and [Chai](http://chaijs.com/) for assertions. Tests can be run with `truffle test` or `truffle test ./test/InkDrop.user.test.js` in order to limit the tests being executed to a specific file. See the [truffle doc](https://truffleframework.com/docs/truffle/testing/writing-tests-in-javascript) for further explanations.

## React Frontend

InkDrop's frontend is implemented in React with heavy usage of [Redux](https://redux.js.org/), [Redux-Saga](https://redux-saga.js.org/), [Drizzle](https://truffleframework.com/docs/drizzle/overview) and [ipfs-api](https://github.com/ipfs/js-ipfs-api). The project is set up via [create-react-app](https://github.com/facebook/create-react-app) and uses a feature centric file structure (see explanation [here](https://reactjs.org/docs/faq-structure.html#grouping-by-features-or-routes)).

## Setup Guide

1.  Get the [Ganache app](http://truffleframework.com/ganache/) and start it
2.  Clone this repository
3.  Run `npm install`
4.  Compile and deploy the smart contracts to the testnet (see `DEPLOY_GUIDE.md`)
5.  Run `npm run start`

## Environment Variables

Set up a `.env` file with the following environment variables:

- REACT_APP_MNEMONIC=''
- REACT_APP_INFURA_API_KEY=''
- REACT_APP_GA_ID=''
- REACT_APP_IPFS_GATEWAY='https://cloudflare-ipfs.com/ipfs/'
- REACT_APP_MIN_DROP=0.001
