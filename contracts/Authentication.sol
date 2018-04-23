pragma solidity ^0.4.21;

import './zeppelin/lifecycle/Killable.sol';

contract Authentication is Killable {
  struct User {
    bytes32 name;
    string bio;
    uint256 drops;
    string imgUrl;
    uint256 followers;
  }

  // The structure of a message
  struct Message {
    string content;
    address writtenBy;
    uint256 timestamp;
    uint256 likes;
    uint256 drops;
    uint256 id;
  }

  // Each address is linked to a user
  mapping (address => User) private userInfo;
  // uint private id; // Stores user id temporarily

  // Each address is linked to several follower addresses
  mapping(address => address[]) public userFollowers;
  // Each address is linked to its written message ids
  mapping(address => uint256[]) public userMessages;
  // Each address is linked to its liked messages
  mapping(address => uint256[]) public userLikes;
  // Each address is linked to its spend drops on messages
  mapping(address => uint256[]) public userDrops;

  // All the messages ever written
  Message[] public messages;
  // Message counter
  uint256 public msgCount = 0;

  // Event fired when a new message is created
  event MessageSend(address indexed writtenBy, bytes32 name, uint256 msgCount);

  modifier onlyExistingUser {
    // Check if user exists or terminate
    require(!(userInfo[msg.sender].name == 0x0));
    _;
  }

  modifier onlyValidName(bytes32 name) {
    // Only valid names allowed

    require(!(name == 0x0));
    _;
  }

  function login() constant public onlyExistingUser returns (bytes32, string) {
    return (userInfo[msg.sender].name, userInfo[msg.sender].bio);
  }

  function signup(bytes32 name, string bio) public payable onlyValidName(name) {
    // Check if user exists.
    // If yes, return user name.
    // If no, check if name was sent.
    // If yes, create and return user.

    if (userInfo[msg.sender].name == 0x0)
    {
        userInfo[msg.sender].name = name;
        userInfo[msg.sender].bio = bio;
    }
  }

  function update(bytes32 name) public payable onlyValidName(name) onlyExistingUser returns (bytes32) {
    // Update user name.

    if (userInfo[msg.sender].name != 0x0)
    {
        userInfo[msg.sender].name = name;

        return (userInfo[msg.sender].name);
    }
  }

  // Set the user profile
  function updateProfile(bytes32 _name, string _bio, string _url) public payable onlyValidName(_name) onlyExistingUser {
    if (userInfo[msg.sender].name != 0x0) {
      userInfo[msg.sender].name = _name;
      userInfo[msg.sender].bio = _bio;
      userInfo[msg.sender].imgUrl = _url;
    }
  }

  // Write a message
  function writeMessage(string _content) public payable onlyExistingUser returns (uint256) {
      msgCount += 1;
      Message memory message = Message(_content, msg.sender, now, 0, 0, msgCount);
      userMessages[msg.sender].push(msgCount);
      messages.push(message);
      emit MessageSend(msg.sender, userInfo[msg.sender].name, msgCount);
      return msgCount;
  }

  function getMessage(uint _id) public view onlyExistingUser returns (string, bytes32, uint256, uint256, uint256, string, address, uint256) {
      Message memory showMsg = messages[_id];
      return (showMsg.content, userInfo[showMsg.writtenBy].name, showMsg.timestamp, showMsg.likes, showMsg.drops, userInfo[showMsg.writtenBy].imgUrl, showMsg.writtenBy, showMsg.id);
  }

  function getUserMessages(address _address) public view onlyExistingUser returns (uint[]) {
      return userMessages[_address];
  }

  function likeMessage(uint _id) public payable onlyExistingUser {
      userLikes[msg.sender].push(_id);
      uint256 _newLikes = messages[_id].likes + 1;
      messages[_id].likes = _newLikes;
  }

  function unlikeMessage(uint _id) public payable onlyExistingUser {
      // loop through all the likes
      for(uint i = 0; i < userLikes[msg.sender].length; i++) {
          if(userLikes[msg.sender][i] == _id) {
              // delete the like
              delete userLikes[msg.sender][i];
              // reduce the like count of the message
              uint256 _newLikes = messages[_id].likes - 1;
              messages[_id].likes = _newLikes;
          }
      }
  }

  function dropMessage(uint _id, uint _drops) public payable onlyExistingUser {
      userDrops[msg.sender].push(_id);
      uint256 _newDrops = messages[_id].drops + _drops;
      messages[_id].drops = _newDrops;
      // Increment the drops of the message's author (writtenBy)
      uint256 _newUserDrops = userInfo[messages[_id].writtenBy].drops + _drops;
      userInfo[messages[_id].writtenBy].drops = _newUserDrops;
  }
  // TODO: implement destructing arrays
  // https://medium.com/@bryn.bellomy/solidity-tutorial-returning-structs-from-public-functions-e78e48efb378
  // Get all messages
  // function getAllMessages() public view returns (string[], bytes32[], uint256[]) {
  //     uint length = messages.length;
  
  //     string[] memory _content = new string[](length);
  //     bytes32[] memory _writtenBy = new bytes32[](length);
  //     uint256[] memory _timestamp = new uint256[](length);
  //     for (uint i = 0; i < length; i++) {
  //         Message memory showMsg;
  //         showMsg = messages[i];
          
  //         _content[i] = showMsg.content;
  //         _writtenBy[i] = userInfo[showMsg.writtenBy].name;
  //         _timestamp[i] = showMsg.timestamp;
  //     }
  //     return (_content, _writtenBy, _timestamp);
  // }

  // Follow a user
  function followUser(address _user) public payable onlyExistingUser {
      userFollowers[msg.sender].push(_user);
      userInfo[_user].followers += 1;
  }

  // Unfollow a user
  function unfollowUser(address _user) public payable onlyExistingUser {
      // loop through all the followers
      for(uint i = 0; i < userFollowers[msg.sender].length; i++) {
          // delete the unfollowering entry
          if(userFollowers[msg.sender][i] == _user) {
              delete userFollowers[msg.sender][i];
              userInfo[_user].followers -= 1;
          }
      }
  }
}
