# InkDrop

This is the repository of the InkDrop platform. InkDrop is a microblogging platform everyday people can use to help spread their message. In return, people can earn crypto currency tokens by giving something back to the network in the form of appreciated content or care (by fighting platform abuse).

Our goal is to develop a fully decentralized platform based on ethereum and IPFS with no (or as little as possible) centralized entities involved. The project is based arround a set of smart contracts (you find them in the `contracts` folder) and a React frontend (check the `src` folder) with an optimistic UI apporach (we do not want to bother the user about the transaction speed or throughput issues).

## Smart Contracts

All of the platform's logic is embedded in the smart contract `InkDrop.sol`. We use `ZeppelinOS` for the implementation of a fully upgradeably smart contract using a proxy system: for each deployed contract implementation (the logic contract), another, user-facing contract is deployed as well (the proxy). The proxy will be the one in charge of the contract's storage, but will forward all function calls to the backing logic contract.

Please see the `DEPLOY_GUIDE.md` for further instructions how to deploy our upgradeable smart contract.

Feel free to deploy the smart contract to your local testnet. **But: A deployment or update of the contract on the rinkeby testnet is only allowed by the admin (Michael Kaserer)!**

## React Frontend

## Setup Guide

1.  Get the [Ganache app](http://truffleframework.com/ganache/) and start it
2.  Clone this repository
3.  Run `npm install`
4.  Compile and deploy the smart contracts to the testnet (see `DEPLOY_GUIDE.md`)
5.  Run `npm run start`
