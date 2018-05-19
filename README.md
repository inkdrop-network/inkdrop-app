# TODOs Smart Contract

*   !!! Halbwertszeit !!!
    \*\* https://ethereum.stackexchange.com/questions/42/how-can-a-contract-run-itself-at-a-later-time/252#252
    \*\* https://docs.oraclize.it/#ethereum
    \*\* http://www.ethereum-alarm-clock.com/
*   !!! Payout of drops at every transaction. Share distribution: 50% author, 25% InkDrop, 25% incentive pool
*   !!! change InkDrop.sol functions to msg.sender approach in order to prevent scam/hijacking of user accounts

# TODOs Front-end

*   Show profile --> get user info via userInfo.call(adr)
*   Refactor comments (commentlist, commentitem, commentform)
*   Trigger messagelist re-render if message gets drops (ranking should be changed according to the messages' drops)
*   Use await/async instead of promise chaining with .then()
*   Improved error handling
*   Comments dropdown caret inline
*   Comment issue after re-rendering: new BigNumber() not a number:
*   Image resizing on ipfs upload
*   React on metamask changes (https://medium.com/@sebinatx/building-an-ethereum-firebase-user-profile-dapp-part-2-226bcc11ae62)
*   The front-end must check that the passend drop amount must be a positive number

# TODOs system architecture

*   !!! Deploy to testnet
*   Check out drizzle
*   Loading indicators (app init, signup, update profile)

### Prospectives

*   Include Analytics
*   Node.js server
*   Batch transactions with drizzle-react (https://medium.com/@robertgreenfieldiv/any-simple-way-to-infuse-this-with-the-drizzle-framework-ef5419fc4b3a)
*   Upgradeable smart contracts
*   Simulation with 1k+ users and messages/likes/drops/followers
*   Return structs from smart contract functions
*   Stateless smart contracts (https://medium.com/@childsmaidment/stateless-smart-contracts-21830b0cd1b6) or zero data storage (https://medium.com/@tjayrush/zero-storage-data-publishing-on-ethereum-1e0610d846d)

# Instructions

1.  Clone this repository
2.  Run `npm install`
3.  Get the [Ganache app](http://truffleframework.com/ganache/) and start it
4.  Run `truffle compile`
5.  Run `truffle migrate --reset`
6.  Run `npm run start`
