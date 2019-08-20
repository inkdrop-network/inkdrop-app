![](i/inkdrop-screenshot.png)

# InkDrop – Eth Free Speech Bulletin Board.

Learn more @ [Medium](https://medium.com/inkdrop), [Twitter](https://twitter.com/JoinInkDrop) and [Reddit](https://www.reddit.com/r/InkDrop).

[InkDrop.tech](https://inkdrop.tech) is a new online bulletin board that combines free speech & civil discourse. It's part of the Web3 movement and the blockchain community’s answer to today's centralized social media.

InkDrop's goal is to pioneer the next generation of social media that regulates itself. Decentralization & community governance enable the users to take back control. It's an open source project that uses IPFS, blockchain technology, cryptocurrency & game theoretic principles.

## What's the point though?

"_Decentralization reduces large structural asymmetries._" – Nassim Nicholas Taleb

The Internet is plagued by a dilemma. Social networks are either:

- Censorship-free and unmoderated **but** people start posting ugly/harmful stuff that nobody wants to see (or very few).
- Centrally operated and mainstream **but** it's being censored by single entities that are ignorant or biased (or both). See Google, Facebook, Twitter, Patreon et al.

Additionally, these corporations control what users should see or not. Your newsfeed is edited by subjective algorithms that only show you what you already like. This creates echo chambers, which are "ripping apart the social fabric of how society works” (Chamath Palihapitiya, former Facebook executive). 

In the name of free speech & self-determination on the Internet, InkDrop proposes a new way forward. A new kind of network that cleverly combines ignorant/biased censorship with ugly/harmful posts. Just kidding…it's the other thing.

Decentralized systems allow us to disintermediate social media and empower the single user. This enables us to create an independent and self-regulating ecosystem. A social network of the users, by the users, for the users.

## Cool, but hoe does it work?

InkDrop distributes not only power, but profits as well. The ones that advance the network as a whole are the ones that profit from it. 

1. **Fully decentralized** – InkDrop uses IPFS to store data & content, Ethereum smart contracts to run the dApp, and Ether cryptocurrency to exchange value. You can use [InkDrop.tech](https://inkdrop.tech) (+ [MetaMask](https://metamask.io)) as your gateway to the Web3 network.

2. **Community governance** – A handful of tech giants shouldn't decide on your freedom of expression. The InkDrop network is governed by the ones who know best, the users. Community governance is made possible through math, game theory and…money. By integrating Ether cryptocurrency, we can design a protocol that incentivizes _common sense content moderation_. We call that [Proof-of-Care](#proof-of-care-concept) (PoC).

3. **Voting system** – The users decide what's hot and what's not. In contrast to traditional social media, InkDrop's ranking system is completely transparent. It’s based solely on user upvotes, which are denominated in Ether cryptocurrency. After a while, these upvotes are _used up_ and awarded to the content creator. The network charges a 10% fee to prevent endless self-upvoting and pay for the PoC protocol incentives.

## How far along are you?

The InkDrop private beta is now live on the Rinkeby-testnet. Join the movement and secure your favourite user name [here](https://inkdrop.tech).

## Other Perks of Decentralization.

* Censorship resistant – Upholding the basic human right to freedom of expression. Decentralized apps, like InkDrop, are uncensorable and always accessible anytime, anywhere. 

* Security – Blockchains are tamper proof system and offer protection against outside interference. A platform that runs on a decentralized network provides much stronger security than a private system with a single point of failure.

* Immutability – All too often individuals manipulate our collective memory by deleting posts from their timeline (like Trump deleting Tweets supporting Luther Strange). The blockchain’s decentralized consensus mechanism ensures its integrity and the validity of the events that occur on it. This ensures a timeline that is public, transparent and immutable.

* Availability – Building InkDrop on the blockchain, sets the network up for a high level of availability at minimal cost. Even today, major social networks built on private servers suffer from outages (e.g. Twitter’s infamous „fail whale“ outages). 

## Proof-of-Care Concept

Of course there will always be scumbags that post ugly stuff. InkDrop utilizes economic incentives to motivate users to moderate the network. Users that vote on harmful content are compensated in Ether. The Proof-of-Care protocol is based on Vitalik Buterin’s [SchellingCoin approach](http://www.the-blockchain.com/docs/Ethereum_white_paper-a_next_generation_smart_contract_and_decentralized_application_platform-vitalik-buterin.pdf), to encourage users to give their most objective opinions. 

When enough people reach a consensus, the post gets blacklisted and the reviewers are rewarded. The goal is to only block actually ugly/harmful content. To avoid oversensitive content moderation, the PoC governance protocol incentivizes content moderation based on the lowest common denominator. This empowers the community to regulate itself.

![](i/Cartman.png)

**Proof-of-Care Process:**
* Alice notices a violent post.
* She marks the post and puts a defined amount of ETH in escrow.
* The post is put up for review by the community.
    * A random set of reviewers is being chosen, based on the degrees of separation from Alice, to impede any collusion efforts.
    * Bob the scumbag, as one of the reviewers, stakes the same amount of tokens but votes in favour of the post.
* A consensus has been reached by the reviewers to blacklist the post. 
* Alice and other honest reviewers in consensus are rewarded with the tokens in escrow and from the incentive pool.
* Bob lost the tokens he put in escrow.
* The tokens used to upvote the post are transferred to the incentive pool.

## How to Contribute

“_They always say time changes things, but you actually have to change them yourself._” – Andy Warhol

How you can support the InkDrop project:
* spread the word.
* provide thoughts and feedback.
* write some code (features, tests).
* report bugs.
* protocol design.
* send some ETH to fund the switch to the mainnet: [0x7dd9540B2FE374E14231fe88c4ed78BfEE64357F](https://etherscan.io/address/0x7dd9540B2FE374E14231fe88c4ed78BfEE64357F).

# Technology Stack

The project uses all the latest frontend tech: React, Redux, Saga, Drizzle (check the `src` folder) with an optimistic UI approach (circumventing transaction speed issues). For smart contracts it uses Truffle and Zeppelin OS (you find them in the `contracts` folder). 

## Smart Contracts

The networks's logic is embedded in the smart contract `InkDrop.sol`. We use `ZeppelinOS` for a fully upgradeable smart contract using a proxy system: for each deployed contract implementation (the logic contract), another, user-facing contract is deployed as well (the proxy). The proxy will be the one in charge of the contract's storage, but will forward all function calls to the backing logic contract. Please see the `DEPLOY_GUIDE.md` for further instructions how to deploy our upgradeable smart contract. Feel free to deploy the smart contracts to your local testnet.

All unit tests for the smart contract can be found in the `test` folder. We write our test cases in JavaScript based on [Mocha](https://mochajs.org/) testing framework and [Chai](http://chaijs.com/) for assertions. Tests can be run with `truffle test` or `truffle test ./test/InkDrop.user.test.js` in order to limit the tests being executed to a specific file. See the [truffle doc](https://truffleframework.com/docs/truffle/testing/writing-tests-in-javascript) for further explanations.

Currently our smart contracts are deployed to Rinkeby at [0xc467653303a190248ba4642e8988a5e24b03160f](https://rinkeby.etherscan.io/address/0xc467653303a190248ba4642e8988a5e24b03160f).

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

## Contributors

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars1.githubusercontent.com/u/33573806?v=3" width="100px;"/><br /><sub><b>Tobias Schoder</b></sub>](https://github.com/Shoby101) | [<img src="https://avatars1.githubusercontent.com/u/3816690?v=3" width="100px;"/><br /><sub><b>Michael Kaserer</b></sub>](https://github.com/mi-kas) | [<img src="https://avatars1.githubusercontent.com/u/33594251?v=3" width="100px;"/><br /><sub><b>Torben Wollschläger</b></sub>](https://github.com/daaash) | [<img src="https://avatars2.githubusercontent.com/u/26111999?v=3" width="100px;"/><br /><sub><b>Rob Hitchens</b></sub>](https://github.com/rob-Hitchens) | [<img src="https://i.imgflip.com/2pg3da.jpg" width="100px;"/><br /><sub><b>We want you!</b></sub>](mailto:hello@inkdrop.tech)|
| :---: | :---: | :---: | :---: | :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->
