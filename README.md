# TODOs

*   !!! Halbwertszeit !!!
*   change InkDrop.sol functions to msg.sender approach in order to prevent scam/hijacking of user accounts
*   Show profile --> get user info via userInfo.call(adr)
*   Refactor comments (commentlist, commentitem, commentform)
*   Trigger messagelist re-render if message gets drops (ranking should be changed according to the messages' drops)
*   Check out drizzle

### TODOs nice to have

*   Use await/async instead of promise chaining with .then()
*   Comment issue after re-rendering: new BigNumber() not a number:
*   Map user address to its likes and prohibit double likes etc.
*   Improved error handling
*   Loading indicators (app init, signup, update profile)
*   Image resizing on ipfs upload
*   Comments dropdown caret inline

# Instructions

1.  Clone this repository
2.  Run `npm install`
3.  Get the [Ganache app](http://truffleframework.com/ganache/) and start it
4.  Run `truffle compile`
5.  Run `truffle migrate --reset`
6.  Run `npm run start`
