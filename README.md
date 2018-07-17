# TODOs Smart Contract

- Upgradeable smart contracts

  - https://blog.zeppelinos.org/upgradeability-using-unstructured-storage/
  - https://blog.zeppelinos.org/proxy-patterns/
  - https://docs.zeppelinos.org/docs/building.html
  - https://blog.indorse.io/ethereum-upgradeable-smart-contract-strategies-456350d0557c

- Halbwertszeit

  - https://medium.com/@dappbridge/settimeout-for-ethereum-77005840bee8
  - https://ethereum.stackexchange.com/questions/42/how-can-a-contract-run-itself-at-a-later-time/252#252
  - https://docs.oraclize.it/#ethereum
  - http://www.ethereum-alarm-clock.com/

- Payout of drops at every transaction. Share distribution: 50% author (DONE), 25% InkDrop, 25% incentive pool

# TODOs Front-end

- Trigger messagelist re-render if message gets drops (ranking should be changed according to the messages' drops)
- Trigger comments # update in case of new comment
- Improved error handling (see https://github.com/NFhbar/Token-Deployer/blob/master/src/layouts/home/Home.js)
- Image resizing on ipfs upload
- React on metamask changes (https://medium.com/@sebinatx/building-an-ethereum-firebase-user-profile-dapp-part-2-226bcc11ae62)

# TODOs system architecture

### Prospectives

- Node.js server
- Batch transactions with drizzle-react (https://medium.com/@robertgreenfieldiv/any-simple-way-to-infuse-this-with-the-drizzle-framework-ef5419fc4b3a)
- Simulation with 1k+ users and messages/likes/drops/followers
- Return structs from smart contract functions
- Stateless smart contracts (https://medium.com/@childsmaidment/stateless-smart-contracts-21830b0cd1b6) or zero data storage (https://medium.com/@tjayrush/zero-storage-data-publishing-on-ethereum-1e0610d846d)

# Instructions

1.  Clone this repository
2.  Run `npm install`
3.  Get the [Ganache app](http://truffleframework.com/ganache/) and start it
4.  Run `truffle compile`
5.  Run `truffle migrate --reset`
6.  Run `npm run start`
