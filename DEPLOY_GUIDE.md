# Deploying smart contracts

This guide intends to describe the process for deploying our smart contrancts to the ethereum networks (mainnet, rinkeby, local testnet) using zeppelinOS.

## Local Testnet (Ganache)

For a fresh deployment to an empty testnet pleas start from 1., otherwise jump straight to 4.

1.  Clean up zos.\* files
2.  Deploy all implementations to the network and inject a simulation of the stdlib with: `zos push --from $OWNER --deploy-stdlib --network development`
3.  Request a proxy for the upgradeably InkDrop.sol with: `zos create InkDrop --init initialize --args $OWNER --network development`
4.  Upgrade the project to a new version, so that new implementations can be registered: `zos bump 0.2`
5.  Push the new code to the network with: `zos push --from $OWNER --network development`
6.  Upgrade the already deployed contract with the new code: `zos update InkDrop --network development`

**VERY IMPORTANT**: Always add the network spceific proxy address (proxies --> InkDrop --> address) to the truffle contract json file under the networks object (build --> contracts --> InkDrop.json --> networks --> id: 5777 --> address).

https://github.com/zeppelinos/zos-cli/issues/206

## Rinkeby Testnet

1.  `zos push --network rinkeby`
2.  `zos create InkDrop --init initialize --args $OWNER --network rinkeby`
3.  Update deployed contract: `zos bump 0.2`
4.  `zos push --from $OWNER --network rinkeby`
5.  `zos update InkDrop --network rinkeby`

**VERY IMPORTANT**: Always add the network spceific proxy address (proxies --> InkDrop --> address) to the truffle contract json file under the networks object (build --> contracts --> InkDrop.json --> networks --> id: 4 --> address).

## Mainnet
