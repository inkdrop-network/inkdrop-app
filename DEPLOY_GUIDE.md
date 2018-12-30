# Deploying smart contracts

This guide intends to describe the process for deploying our smart contrancts to the ethereum networks (mainnet, rinkeby, local testnet) using ZeppelinOS.

## Local Testnet (Ganache)

For a fresh deployment to an empty testnet please start from 1., otherwise jump straight to 4.

1.  Delete `zos.development.json`
2.  Deploy all implementations to the network and inject a simulation of the stdlib with: `zos push --deploy-stdlib --network development`
3.  Request a proxy for the upgradeably InkDrop.sol with: `zos create InkDrop --init initialize --args $OWNER --network development`
4.  Upgrade the project to a new version, so that new implementations can be registered: `zos bump 0.2`
5.  Push the new code to the network with: `zos push --network development`
6.  Upgrade the already deployed contract with the new code: `zos update InkDrop --network development`

**VERY IMPORTANT**: Always check the network spceific proxy address (proxies --> InkDrop --> address) to the truffle contract json file under the networks object (build --> contracts --> InkDrop.json --> networks --> id: 5777 --> address).

- https://github.com/zeppelinos/zos-cli/issues/206
- https://ethereum.stackexchange.com/questions/52721/truffle-react-with-proxy-contract-of-openzeppelin

## Rinkeby Testnet

For a fresh deployment please start from 1., otherwise jump straight to 4.

Check the gas limit before the deployment at https://rinkeby.etherscan.io/blocks and set the most recent value to `truffle.js`.

1.  Delete `zos.rinkeby.json`
2.  `zos push --network rinkeby`
3.  `zos create InkDrop --init initialize --args $OWNER --network rinkeby`
4.  Update deployed contract: `zos bump 0.2`
5.  `zos push --network rinkeby`
6.  `zos update InkDrop --network rinkeby`

**VERY IMPORTANT**: Always check the network spceific proxy address (proxies --> InkDrop --> address) to the truffle contract json file under the networks object (build --> contracts --> InkDrop.json --> networks --> id: 4 --> address).

## Mainnet

"_Well I need a dollar dollar, a dollar is what I need (for mainnet)_" - Aloe Blacc

Help us fund the switch to the mainnet: [0x7dd9540B2FE374E14231fe88c4ed78BfEE64357F](https://rinkeby.etherscan.io/address/0x7dd9540B2FE374E14231fe88c4ed78BfEE64357F)