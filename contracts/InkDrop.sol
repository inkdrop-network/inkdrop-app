pragma solidity ^0.4.23;

import "zos-lib/contracts/migrations/Migratable.sol";
import "openzeppelin-zos/contracts/ownership/Ownable.sol";
import "openzeppelin-zos/contracts/lifecycle/Pausable.sol";
import "openzeppelin-zos/contracts/math/SafeMath.sol";

contract InkDrop is Migratable, Ownable, Pausable {

  using SafeMath for uint256;

  uint256 constant MULTIPLIER = 100;
  // reduce dropAmount by 10% (i.e. multiply by 90% or 9/10)
  uint256 constant DROP_REDUCE = 9;

  struct Data {
    uint256 value;
    bool isSet;
  }

  struct User {
    bytes32 username;
    string bio;
    string ipfsHash;
    uint256 index;
    // uint256 followers;
    // User has many followers
    address[] followers; 
    mapping(address => Data) followerPointers;
    // messages of a user
    uint[] messages;
    mapping(uint256 => uint256) messagePointers;
    // total drops in wei earned with likes, content, etc.
    uint256 dropAmount;
    // drops of a user
    // uint[] drops;
    // mapping(uint256 => uint) dropPointers;
  }
  
  mapping(address => User) private userStructs;
  address[] private userList;

    // The structure of a message
  struct Message {
    uint256 id;
    uint256 parent;
    string content;
    address writtenBy;
    uint256 timestamp;
    uint256 timetolive;
    // addresses of users' likes
    address[] likes;
    // mapping of message id to position in likes array
    mapping(address => Data) likePointers;
    // total drops in wei
    uint256 dropAmount;
    // addresses of users' drops
    address[] drops;
    // mapping of message id to position in drops array
    mapping(address => Data) dropPointers;
    uint[] comments;
  }
  
  // Message[] private messageList;
  Message[] private messageList;
  Message[] private commentList;

  // minimum drop amount in weis
  // 0.001 eth
  uint256 private MINIMUM_DROP = 1000000000000000;

  // Store the id and the related message in the struct
  // Example: { 1 --> msg1, 2 --> msg2, 3 --> msg3 }
  mapping(uint256 => Message) private messageStructs;
  // Store the newsfeed order of message ids in the array
  // Example: [3, 1, 2]
  uint256[] private messageOrder;
  // TODO: perform the same changes to comments as well!!!

  event LogNewUser   (address indexed userAddress, uint256 index, bytes32 username, string bio, string ipfsHash);
  event LogUpdateUser(address indexed userAddress, uint256 index, bytes32 username, string bio, string ipfsHash);
  event LogDeleteUser(address indexed userAddress, uint256 index);

  function initialize() isInitializer("InkDrop", "0") public {
  }
  
  function isUser(address _userAddress) public view returns(bool isIndeed) {
     // if the list is empty, the requested user is not present
    if(userList.length == 0) return false;
    // true = exists
    return (userList[userStructs[_userAddress].index] == _userAddress);
  }

  function isValidName(bytes32 _username) private pure returns(bool isValid) {
    return (!(_username == 0x0));
  }

  function isMessage(uint256 _parent) public view returns(bool isIndeed) {
     // if the list is empty, the requested message is not present
    if(messageOrder.length == 0) return false;
    // true = exists
    return (messageOrder.length > _parent);
  }

  function getUserCount() public view returns(uint256 count) {
    return userList.length;
  }

  function getUserAtIndex(uint256 _index) public view returns(address userAddress) {
    require(_index <= userList.length);
    return userList[_index];
  }
  
  function getUser(address _userAddress) public view returns(bytes32 username, string bio, uint256 drops, string ipfsHash, uint256 followers, uint[] messages) {
    require(isUser(_userAddress)); 
    return (userStructs[_userAddress].username, userStructs[_userAddress].bio, 
      userStructs[_userAddress].dropAmount, userStructs[_userAddress].ipfsHash, 
      userStructs[_userAddress].followers.length, userStructs[_userAddress].messages);
  } 

  function getUserFollowers(address _userAddress) public view returns(address[] followers) {
    require(isUser(_userAddress)); 
    return userStructs[_userAddress].followers;
  } 
  
  function createUser(bytes32 _username, string _bio, string _ipfsHash) whenNotPaused public returns(uint256 index) {
    require(!isUser(msg.sender)); 
    require(isValidName(_username));
    
    userStructs[msg.sender].username = _username;
    userStructs[msg.sender].bio = _bio;
    userStructs[msg.sender].ipfsHash = _ipfsHash;
    // userStructs[msg.sender].dropAmount = 10*MULTIPLIER;
    userStructs[msg.sender].index = userList.push(msg.sender) - 1;
    emit LogNewUser(msg.sender, userStructs[msg.sender].index, _username, _bio, _ipfsHash);
    return userList.length - 1;
  }

  function deleteUser() whenNotPaused public returns(uint256 index) {
    require(isUser(msg.sender)); 
    // this would break referential integrity
    // require(userStructs[msg.sender].messageIds.length <= 0);
    uint256 rowToDelete = userStructs[msg.sender].index;
    address keyToMove = userList[userList.length-1];
    userList[rowToDelete] = keyToMove;
    userStructs[keyToMove].index = rowToDelete; 
    userList.length--;
    emit LogDeleteUser(msg.sender, rowToDelete);
    emit LogUpdateUser(keyToMove, rowToDelete, userStructs[keyToMove].username, userStructs[keyToMove].bio, userStructs[keyToMove].ipfsHash);
    return rowToDelete;
  }
  
  function updateUserIpfsHash(string _ipfsHash) whenNotPaused public returns(bool success) {
    require(isUser(msg.sender)); 
    require(bytes(_ipfsHash).length > 0);

    userStructs[msg.sender].ipfsHash = _ipfsHash;
    emit LogUpdateUser(msg.sender, userStructs[msg.sender].index, userStructs[msg.sender].username, userStructs[msg.sender].bio, _ipfsHash);
    return true;
  }

  function updateUserBio(string _bio) whenNotPaused public returns(bool success) {
    require(isUser(msg.sender)); 
    require(bytes(_bio).length > 0);

    userStructs[msg.sender].bio = _bio;
    emit LogUpdateUser(msg.sender, userStructs[msg.sender].index, userStructs[msg.sender].username, _bio, userStructs[msg.sender].ipfsHash);
    return true;
  }

  function updateUsername(bytes32 _username) whenNotPaused public returns(bool success) {
    require(isUser(msg.sender)); 
    require(isValidName(_username));

    userStructs[msg.sender].username = _username;
    emit LogUpdateUser(msg.sender, userStructs[msg.sender].index, _username, userStructs[msg.sender].bio, userStructs[msg.sender].ipfsHash);
    return true;
  }

  function updateUser(bytes32 _username, string _bio, string _ipfsHash) whenNotPaused public returns(bool success) {
    require(isUser(msg.sender)); 
    require(isValidName(_username));
    require(bytes(_bio).length > 0);
    require(bytes(_ipfsHash).length > 0);

    userStructs[msg.sender].username = _username;
    userStructs[msg.sender].bio = _bio;
    userStructs[msg.sender].ipfsHash = _ipfsHash;
    emit LogUpdateUser(msg.sender, userStructs[msg.sender].index, _username, _bio, _ipfsHash);
    return true;
  }
  
  function followUser(address _user) whenNotPaused public returns(uint256 followers) {
    require(isUser(_user));
    require(isUser(msg.sender));
    require(!(msg.sender == _user));
    // require that a user can not follow a user twice
    require(!userStructs[msg.sender].followerPointers[_user].isSet);

    userStructs[msg.sender].followerPointers[_user].value = userStructs[msg.sender].followers.push(_user) - 1;
    userStructs[msg.sender].followerPointers[_user].isSet = true;
    return userStructs[msg.sender].followers.length;
  }
  
  function unfollowUser(address _user) whenNotPaused public returns(uint256 followers) {
    require(isUser(_user));
    require(isUser(msg.sender));
    require(!(msg.sender == _user));
    require(userStructs[msg.sender].followers.length > 0);
    // require that a user can not unfollow a user twice
    require(userStructs[msg.sender].followerPointers[_user].isSet);
    // delete user
    uint256 rowToDelete = userStructs[msg.sender].followerPointers[_user].value;
    address keyToMove = userStructs[msg.sender].followers[userStructs[msg.sender].followers.length-1];
    userStructs[msg.sender].followers[rowToDelete] = keyToMove;
    userStructs[msg.sender].followerPointers[keyToMove].value = rowToDelete; 
    userStructs[msg.sender].followerPointers[_user].isSet = false;
    return --userStructs[msg.sender].followers.length;
  }

  function getMessageCount() public view returns(uint256 count) {
    return messageOrder.length;
  }

  function getMessageIdAtIndex(uint256 _index) public view returns(uint256 msgId) {
    require(_index < messageOrder.length);
    return messageOrder[_index];
  }

  // The stack can only be 7 steps deep - only 7 return values allowed
  function getMessage(uint256 _id) public view returns(string content, address writtenBy, uint256 timestamp, uint256 timetolive, uint256 likes, uint256 drops, uint[] comments) {
    require(_id < messageOrder.length);
    return (messageStructs[_id].content, messageStructs[_id].writtenBy, messageStructs[_id].timestamp, messageStructs[_id].timetolive, 
      messageStructs[_id].likes.length, messageStructs[_id].dropAmount, messageStructs[_id].comments);
  }
  

  function createMessage(string _content) whenNotPaused public payable returns(uint256 index) {
    require(isUser(msg.sender));
    require(bytes(_content).length > 0);
    require(msg.value >= 0);

    uint256 msgId = messageOrder.length;
    messageStructs[msgId].content = _content;
    messageStructs[msgId].writtenBy = msg.sender;
    messageStructs[msgId].timestamp = now;
    messageStructs[msgId].timetolive = now;
    messageStructs[msgId].id = msgId;
    messageStructs[msgId].dropAmount = msg.value;
    messageStructs[msgId].dropPointers[msg.sender].value = messageStructs[msgId].drops.push(msg.sender) - 1;
    messageStructs[msgId].dropPointers[msg.sender].isSet = true;

    messageOrder.push(msgId);

    userStructs[msg.sender].messagePointers[userStructs[msg.sender].messages.push(msgId)-1] = msgId;

    return msgId;
  }

  function likeMessage(uint256 _id) whenNotPaused public returns(uint256 newlikes) {
    require(isUser(msg.sender));
    require(_id < messageOrder.length);
    // require that a user can not like a message twice
    require(!messageStructs[_id].likePointers[msg.sender].isSet);

    messageStructs[_id].likePointers[msg.sender].value = messageStructs[_id].likes.push(msg.sender) - 1;
    messageStructs[_id].likePointers[msg.sender].isSet = true;
    // TODO: prolongue timetolive
    return messageStructs[_id].likes.length;
  }

  function unlikeMessage(uint256 _id) whenNotPaused public returns(uint256 newlikes) {
    require(isUser(msg.sender));
    require(_id < messageOrder.length);
    require(messageStructs[_id].likes.length > 0);
    // require that a user can not unlike a message twice
    require(messageStructs[_id].likePointers[msg.sender].isSet);

    uint256 rowToDelete = messageStructs[_id].likePointers[msg.sender].value;
    address keyToMove = messageStructs[_id].likes[messageStructs[_id].likes.length-1];
    messageStructs[_id].likes[rowToDelete] = keyToMove;
    messageStructs[_id].likePointers[keyToMove].value = rowToDelete; 
    messageStructs[_id].likePointers[msg.sender].isSet = false;
    return --messageStructs[_id].likes.length;
  }

  function dropMessage(uint256 _id) whenNotPaused public payable returns(uint256 newdrops) {
    require(isUser(msg.sender));
    require(_id < messageOrder.length);
    // check if the minimum drop amount is reached
    require(msg.value >= MINIMUM_DROP);

    messageStructs[_id].drops.push(msg.sender);
    messageStructs[_id].dropPointers[msg.sender].value += msg.value;
    messageStructs[_id].dropPointers[msg.sender].isSet = true;
    messageStructs[_id].dropAmount += msg.value;
    // LINK: https://ethereum.stackexchange.com/questions/3010/how-does-ethereum-cope-with-division-of-prime-numbers
    userStructs[messageStructs[_id].writtenBy].dropAmount += (msg.value/2);
    // Let the users retrieve their earned drops with a payout (see userPayout function below)

    // TODO: payout of drops to InkDrop and incentive pool
    // TODO: extend the timetolive
    return messageStructs[_id].dropAmount;
  }

  function userPayout() whenNotPaused public returns(uint256 payoutamount) {
    require(isUser(msg.sender));
    require(userStructs[msg.sender].dropAmount > 0);

    uint256 payout = userStructs[msg.sender].dropAmount;
    // userStructs[msg.sender].dropAmount = 0;

    // if (!msg.sender.send(payout)) {
    //   // reverting state because send failed
    //   userStructs[msg.sender].dropAmount = payout; 
    // }

    msg.sender.transfer(payout);
    userStructs[msg.sender].dropAmount = 0;

    return payout;
  }

    // Write a comment
  function createComment(uint256 _parent, string _content) whenNotPaused public  returns(uint256 index) {
    require(isUser(msg.sender));
    require(bytes(_content).length > 0);
    require(isMessage(_parent));

    uint256 commentId = commentList.length;
    Message memory comment;
    comment.content = _content;
    comment.writtenBy = msg.sender;
    comment.timestamp = now;
    comment.id = commentId;
    comment.parent = _parent;
    comment.dropAmount = 0;
    commentList.push(comment);
    messageStructs[_parent].comments.push(commentId);
    return commentId;
  }

  function getComment(uint256 _commentId) public view returns(uint256 parent, string content, address writtenBy, uint256 timestamp, uint256 timetolive, uint256 likes, uint256 drops) {
    require(_commentId < commentList.length);
    return (commentList[_commentId].parent, commentList[_commentId].content, commentList[_commentId].writtenBy, commentList[_commentId].timestamp, 
      commentList[_commentId].timetolive, commentList[_commentId].likes.length, commentList[_commentId].dropAmount);
  }

  function getStats() onlyOwner public view returns(uint256 users, uint256 messages, uint256 comments) {
    return (userList.length, messageOrder.length, commentList.length);
  }

  function getMinimumDrop() public view returns(uint256 min_drop) {
    return MINIMUM_DROP;
  }

  function setMinimumDrop(uint256 _min_drop) onlyOwner whenNotPaused public  returns(uint256 min_drop) {
    MINIMUM_DROP = _min_drop;
    return MINIMUM_DROP;
  }

  function sort_item(uint256 pos) internal returns (bool) {
    // Inspired by: https://github.com/alianse777/solidity-standard-library/blob/master/Array.sol#L130
    uint256 min_pos = pos;
    for(uint256 i = pos; i < messageOrder.length; i++) {
      // compare according to messages' drop amounts
      if(messageStructs[messageOrder[i]].dropAmount < messageStructs[messageOrder[min_pos]].dropAmount) {
        min_pos = i;
      }
    }

    if(min_pos == pos) return false;
    // reorder the message ids
    uint256 tmp = messageOrder[pos];
    messageOrder[pos] = messageOrder[min_pos];
    messageOrder[min_pos] = tmp;

    return true;
  }
    
  function sort() whenNotPaused public  {
    for(uint256 i = 0; i < messageOrder.length - 1; i++) {
      sort_item(i);
    }
  }

  function reduceDrops(uint256 _id) onlyOwner whenNotPaused public  {
    // reduce dropAmount by 10% (i.e. multiply by 90% or 9/10)
    messageStructs[_id].dropAmount = messageStructs[_id].dropAmount * DROP_REDUCE / 10;
  }

}
