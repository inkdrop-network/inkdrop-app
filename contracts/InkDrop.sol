pragma solidity ^0.4.23;

contract InkDrop {

  struct User {
    bytes32 username;
    string bio;
    string ipfsHash;
    uint index;
    uint drops;
    // uint followers;
    // User has many followers
    address[] followers; 
    mapping(address => uint) followerPointers;
  }
  
  mapping(address => User) private userStructs;
  address[] private userList;
  
    // The structure of a message
  struct Message {
    uint id;
    uint parent;
    string content;
    address writtenBy;
    uint timestamp;
    uint likes;
    uint drops;
    uint[] comments;
  }
  
  mapping(uint => Message) private messageStructs;
  uint[] private messageList;

  event LogNewUser   (address indexed userAddress, uint index, bytes32 username, string bio, string ipfsHash);
  event LogUpdateUser(address indexed userAddress, uint index, bytes32 username, string bio, string ipfsHash);
  event LogDeleteUser(address indexed userAddress, uint index);
  
  function isUser(address _userAddress) private view returns(bool isIndeed) {
     // if the list is empty, the requested user is not present
    if(userList.length == 0) return false;
    // true = exists
    return (userList[userStructs[_userAddress].index] == _userAddress);
  }

  function isValidName(bytes32 _username) private pure returns(bool isValid) {
    return (!(_username == 0x0));
  }

  function getUserCount() public constant returns(uint count) {
    return userList.length;
  }

  function getUserAtIndex(uint _index) public constant returns(address userAddress) {
    require(_index <= userList.length);
    return userList[_index];
  }
  
  function getUser(address _userAddress) public constant returns(bytes32 username, string bio, uint drops, string ipfsHash, uint followers) {
    require(isUser(_userAddress)); 
    return (userStructs[_userAddress].username, userStructs[_userAddress].bio, 
      userStructs[_userAddress].drops, userStructs[_userAddress].ipfsHash, 
      userStructs[_userAddress].followers.length);
  } 
  
  function createUser(address _userAddress, bytes32 _username, string _bio, string _ipfsHash) public returns(uint index) {
    require(!isUser(_userAddress)); 
    require(isValidName(_username));
    
    userStructs[_userAddress].username = _username;
    userStructs[_userAddress].bio = _bio;
    userStructs[_userAddress].ipfsHash = _ipfsHash;
    userStructs[_userAddress].index = userList.push(_userAddress) - 1;
    emit LogNewUser(_userAddress, userStructs[_userAddress].index, _username, _bio, _ipfsHash);
    return userList.length - 1;
  }

  function deleteUser(address _userAddress) public returns(uint index) {
    require(isUser(_userAddress)); 
    // this would break referential integrity
    // require(userStructs[_userAddress].messageIds.length <= 0);
    uint rowToDelete = userStructs[_userAddress].index;
    address keyToMove = userList[userList.length-1];
    userList[rowToDelete] = keyToMove;
    userStructs[keyToMove].index = rowToDelete; 
    userList.length--;
    emit LogDeleteUser(_userAddress, rowToDelete);
    emit LogUpdateUser(keyToMove, rowToDelete, userStructs[keyToMove].username, userStructs[keyToMove].bio, userStructs[keyToMove].ipfsHash);
    return rowToDelete;
  }
  
  function updateUserIpfsHash(address _userAddress, string _ipfsHash) public returns(bool success) {
    require(isUser(_userAddress)); 
    require(bytes(_ipfsHash).length > 0);
    userStructs[_userAddress].ipfsHash = _ipfsHash;
    emit LogUpdateUser(_userAddress, userStructs[_userAddress].index, userStructs[_userAddress].username, userStructs[_userAddress].bio, _ipfsHash);
    return true;
  }

  function updateUserBio(address _userAddress, string _bio) public returns(bool success) {
    require(isUser(_userAddress)); 
    require(bytes(_bio).length > 0);
    userStructs[_userAddress].bio = _bio;
    emit LogUpdateUser(_userAddress, userStructs[_userAddress].index, userStructs[_userAddress].username, _bio, userStructs[_userAddress].ipfsHash);
    return true;
  }

  function updateUsername(address _userAddress, bytes32 _username) public returns(bool success) {
    require(isUser(_userAddress)); 
    require(isValidName(_username));
    userStructs[_userAddress].username = _username;
    emit LogUpdateUser(_userAddress, userStructs[_userAddress].index, _username, userStructs[_userAddress].bio, userStructs[_userAddress].ipfsHash);
    return true;
  }

  function updateUser(address _userAddress, bytes32 _username, string _bio, string _ipfsHash) public returns(bool success) {
    require(isUser(_userAddress)); 
    require(isValidName(_username));
    require(bytes(_bio).length > 0);
    require(bytes(_ipfsHash).length > 0);
    userStructs[_userAddress].username = _username;
    userStructs[_userAddress].bio = _bio;
    userStructs[_userAddress].ipfsHash = _ipfsHash;
    emit LogUpdateUser(_userAddress, userStructs[_userAddress].index, _username, _bio, _ipfsHash);
    return true;
  }
  
  function followUser(address _user) public returns(uint followers) {
    require(isUser(_user));
    require(isUser(msg.sender));
    // require that a user can not follow a user twice
    require(userStructs[msg.sender].followers.length == 0 || userStructs[msg.sender].followerPointers[_user] > 0);
    userStructs[msg.sender].followerPointers[_user] = userStructs[msg.sender].followers.push(_user) - 1;
    return userStructs[msg.sender].followers.length;
  }
  
  function unfollowUser(address _user) public returns(uint followers) {
    require(isUser(_user));
    require(isUser(msg.sender));
    // require that a user can not unfollow a user twice
    require((userStructs[msg.sender].followers.length > 0 && userStructs[msg.sender].followerPointers[_user] > 0) 
      || (userStructs[msg.sender].followers.length == 1 && userStructs[msg.sender].followerPointers[_user] == 0));
    // delete user
    uint rowToDelete = userStructs[msg.sender].followerPointers[_user];
    address keyToMove = userStructs[msg.sender].followers[userStructs[msg.sender].followers.length-1];
    userStructs[msg.sender].followers[rowToDelete] = keyToMove;
    userStructs[msg.sender].followerPointers[keyToMove] = rowToDelete; 
    return userList.length--;
  }

}
