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
  }
  
  mapping(address => User) private userStructs;
  address[] private userIndex;

  event LogNewUser   (address indexed userAddress, uint index, bytes32 username);
  event LogUpdateUser(address indexed userAddress, uint index, bytes32 username);
  event LogDeleteUser(address indexed userAddress, uint index);
  
  function isUser(address _userAddress) private view returns(bool isIndeed) {
     // if the list is empty, the requested user is not present
    if(userIndex.length == 0) return false;
    // true = exists
    return (userIndex[userStructs[_userAddress].index] == _userAddress);
  }

  function isValidName(bytes32 _username) private pure returns(bool isValid) {
    return (!(_username == 0x0));
  }
  
  function createUser(address _userAddress, bytes32 _username, string _bio, string _ipfsHash) public returns(uint index) {
    require(!isUser(_userAddress)); 
    require(isValidName(_username));
    
    userStructs[_userAddress].username = _username;
    userStructs[_userAddress].bio = _bio;
    userStructs[_userAddress].ipfsHash = _ipfsHash;
    userStructs[_userAddress].index = userIndex.push(msg.sender) - 1;
    emit LogNewUser(_userAddress, userStructs[msg.sender].index, _username);
    return userIndex.length - 1;
  }

  function deleteUser(address _userAddress) public returns(uint index) {
    require(isUser(msg.sender)); 
    // this would break referential integrity
    // require(userStructs[msg.sender].messageIds.length <= 0);
    uint rowToDelete = userStructs[msg.sender].index;
    address keyToMove = userIndex[userIndex.length-1];
    userIndex[rowToDelete] = keyToMove;
    userStructs[keyToMove].index = rowToDelete; 
    userIndex.length--;
    emit LogDeleteUser(msg.sender, rowToDelete);
    emit LogUpdateUser(keyToMove, rowToDelete, userStructs[keyToMove].username);
    return rowToDelete;
  }
  
  function getUser(address _userAddress) public constant returns(bytes32 username, string bio, uint drops, string ipfsHash, uint followers) {
    require(isUser(msg.sender)); 
    return (userStructs[msg.sender].username, userStructs[msg.sender].bio, 
      userStructs[msg.sender].drops, userStructs[msg.sender].ipfsHash, 
      userStructs[msg.sender].followers.length);
  } 
  
  function updateUserEmail(address _userAddress, bytes32 _username) public returns(bool success) {
    require(isUser(_userAddress)); 
    userStructs[_userAddress].username = _username;
    emit LogUpdateUser(
      _userAddress, 
      userStructs[_userAddress].index,
      _username);
    return true;
  }


  function getUserCount() public constant returns(uint count) {
    return userIndex.length;
  }

  function getUserAtIndex(uint _index) public constant returns(address userAddress) {
    return userIndex[_index];
  }
  
  function followUser(address _user) public returns(uint followers) {
    require(isUser(_user));
    return userStructs[msg.sender].followers.push(_user);
  }
  
  function unfollowUser(address _user) public returns(uint followers) {
    require(isUser(_user));
    for(uint i = 0; i < userStructs[msg.sender].followers.length; i++) {
        // delete the unfollowering entry
        if(userStructs[msg.sender].followers[i] == _user) {
            delete userStructs[msg.sender].followers[i];
            return userStructs[msg.sender].followers.length;
        }
    }
  }

}
