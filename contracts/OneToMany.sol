pragma solidity ^0.4.6;

// One-to-Many refential integrity maintenance and enforcement
// DOC: https://medium.com/@robhitchens/enforcing-referential-integrity-in-ethereum-smart-contracts-a9ab1427ff42

// contract Owned {
//     address public owner;

//     constructor() {
//         owner=msg.sender;
//     }

//     modifier onlyOwner {
//         require(msg.sender != owner);
//         _;
//     }
// }

contract InkDrop {
    
    struct User {
        uint userId; 
        // User has many messages
        bytes32[] messageIds; 
        mapping(bytes32 => uint) messageIdPointers;  
        // more app data
    }
    
    mapping(bytes32 => User) private userStructs;
    bytes32[] private userList;

    
    struct Message {
        uint messageId; 
        // many has exactly one user
        bytes32 userId; 
        // add app fields
    }
    
    mapping(bytes32 => Message) private messageStructs;
    bytes32[] private messageList;
    
    event LogNewUser(address sender, bytes32 userId);
    event LogNewMessage(address sender, bytes32 messageId, bytes32 userId);
    event LogUserDeleted(address sender, bytes32 userId);
    event LogMessageDeleted(address sender, bytes32 messageId);
    
    function getUserCount()  public constant returns(uint oneCount) {
        return userList.length;
    }
    function getMessageCount() public constant returns(uint manyCount) {
        return messageList.length;
    }
    
    function isUser(bytes32 userId) public constant returns(bool isIndeed) {
        // if the list is empty, the requested user is not present
        if(userList.length==0) return false;
        // true = exists
        return (userList[userStructs[userId].userId]==userId);
    }
    
    function isMessage(bytes32 messageId) public constant returns(bool isIndeed) {
        // if the list is empty, the requested message is not present
        if(messageList.length==0) return false;
        // true = exists
        return (messageList[messageStructs[messageId].messageId]==messageId);
    }
    
    // Iterate over a One's Many keys
    
    function getUsersMessageCount(bytes32 userId) public constant returns(uint manyCount) {
        require(isUser(userId));
        return userStructs[userId].messageIds.length;
    }
    
    function getUsersMessageAtIndex(bytes32 userId, uint row) public constant returns(bytes32 manyKey) {
        require(isUser(userId));
        return userStructs[userId].messageIds[row];
    }
    
    // Insert
    // onlyOwner
    function createUser(bytes32 userId) public returns(bool success) {
        // duplicate key prohibited
        require(!isUser(userId)); 
        userStructs[userId].userId = userList.push(userId)-1;
        emit LogNewUser(msg.sender, userId);
        return true;
    }
    // onlyOwner
    function createMessage(bytes32 messageId, bytes32 userId) public returns(bool success) {
        require(isUser(userId));
        // duplicate key prohibited
        require(!isMessage(messageId)); 
        messageStructs[messageId].messageId = messageList.push(messageId)-1;
        messageStructs[messageId].userId = userId; // each many has exactly one "One", so this is mandatory
        // We also maintain a list of "Many" that refer to the "One", so ... 
        userStructs[userId].messageIdPointers[messageId] = userStructs[userId].messageIds.push(messageId) - 1;
        emit LogNewMessage(msg.sender, messageId, userId);
        return true;
    }
    
    // Delete
    // onlyOwner
    function deleteUser(bytes32 userId) public returns(bool success) {
        require(isUser(userId));
        // this would break referential integrity
        require(userStructs[userId].messageIds.length <= 0); 
        uint rowToDelete = userStructs[userId].userId;
        bytes32 keyToMove = userList[userList.length-1];
        userList[rowToDelete] = keyToMove;
        userStructs[keyToMove].userId = rowToDelete;
        userList.length--;
        emit LogUserDeleted(msg.sender, userId);
        return true;
    }    
    // onlyOwner
    function deleteMessage(bytes32 messageId) public returns(bool success) {
        // non-existant key
        require(isMessage(messageId)); 
        
        // delete from the Many table
        uint rowToDelete = messageStructs[messageId].messageId;
        bytes32 keyToMove = messageList[messageList.length-1];
        messageList[rowToDelete] = keyToMove;
        messageStructs[messageId].messageId = rowToDelete;
        messageList.length--;
        
        // we ALSO have to delete this key from the list in the ONE that was joined to this Many
        bytes32 userId = messageStructs[messageId].userId; // it's still there, just not dropped from index
        rowToDelete = userStructs[userId].messageIdPointers[messageId];
        keyToMove = userStructs[userId].messageIds[userStructs[userId].messageIds.length-1];
        userStructs[userId].messageIds[rowToDelete] = keyToMove;
        userStructs[userId].messageIdPointers[keyToMove] = rowToDelete;
        userStructs[userId].messageIds.length--;
        emit LogMessageDeleted(msg.sender, messageId);
        return true;
    }
    
}


