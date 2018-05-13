pragma solidity ^0.4.23;

contract InkDrop {

  struct User {
    bytes32 username;
    string bio;
    string ipfsHash;
    uint index;
    uint drops;
    // uint followers;
  }
  
  mapping(address => User) private userStructs;
  address[] private userIndex;

  event LogNewUser   (address indexed userAddress, uint index, bytes32 username);
  event LogUpdateUser(address indexed userAddress, uint index, bytes32 username);
  event LogDeleteUser(address indexed userAddress, uint index);
  
  function isUser(address userAddress) public constant returns(bool isIndeed) {
     // if the list is empty, the requested user is not present
    if(userIndex.length == 0) return false;
    // true = exists
    return (userIndex[userStructs[msg.sender].index] == msg.sender);
  }

  function isValidName(bytes32 name) public constant returns(bool isValid) {
    return (!(name == 0x0));
  }

  function insertUser(address userAddress, bytes32 username) public returns(uint index) {
    require(!isUser(userAddress)); 
    require(isValidName(username));
    userStructs[userAddress].username = username;
    userStructs[userAddress].index = userIndex.push(userAddress) - 1;
    emit LogNewUser(userAddress, userStructs[userAddress].index, username);
    return userIndex.length - 1;
  }

  function deleteUser(address userAddress) public returns(uint index) {
    require(isUser(userAddress)); 
    uint rowToDelete = userStructs[userAddress].index;
    address keyToMove = userIndex[userIndex.length-1];
    userIndex[rowToDelete] = keyToMove;
    userStructs[keyToMove].index = rowToDelete; 
    userIndex.length--;
    emit LogDeleteUser(
        userAddress, 
        rowToDelete);
    emit LogUpdateUser(
        keyToMove, 
        rowToDelete, 
        userStructs[keyToMove].username);
    return rowToDelete;
  }
  
  function getUser(address userAddress) public constant returns(bytes32 username, uint index) {
    require(isUser(userAddress)); 
    return(
      userStructs[userAddress].username, 
      userStructs[userAddress].index);
  } 
  
  function updateUserEmail(address userAddress, bytes32 username) public returns(bool success) {
    require(isUser(userAddress)); 
    userStructs[userAddress].username = username;
    emit LogUpdateUser(
      userAddress, 
      userStructs[userAddress].index,
      username);
    return true;
  }


  function getUserCount() public constant returns(uint count) {
    return userIndex.length;
  }

  function getUserAtIndex(uint index) public constant returns(address userAddress) {
    return userIndex[index];
  }

}
