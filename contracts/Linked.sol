pragma solidity ^0.4.21;
// pragma experimental ABIEncoderV2;

contract Linked {
    // User profile
    struct User {
        bytes32 name;
        bytes32 occupation;
        string bio;
        uint256 drops;
    }
    
    // The structure of a message
    struct Message {
        string content;
        address writtenBy;
        uint256 timestamp;
        uint256 likes;
        uint256 drops;
    }
    
    // Each address is linked to a user with name, occupation and bio
    mapping(address => User) public userInfo;
    
    // Each address is linked to several follower addresses
    mapping(address => address[]) public userFollowers;
    
    // Each address is linked to its written messages
    mapping(address => Message[]) public userMessages;

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

    // Set the user profile
    function setProfile(bytes32 _name, bytes32 _occupation, string _bio) public {
        uint256 _drops = 0;
        if(userInfo[msg.sender].drops > 0) {
            _drops = userInfo[msg.sender].drops;
        }
        User memory user = User(_name, _occupation, _bio, _drops);
        userInfo[msg.sender] = user;
    }

    // Write a message
    function writeMessage(string _content) public {
        Message memory message = Message(_content, msg.sender, now, 0, 0);
        userMessages[msg.sender].push(message);
        messages.push(message);
        emit MessageSend(msg.sender, userInfo[msg.sender].name, msgCount);
        msgCount += 1;
    }

    function getMessage(uint _id) public view returns (string, bytes32, uint256, uint256, uint256) {
        Message memory showMsg = messages[_id];
        return (showMsg.content, userInfo[showMsg.writtenBy].name, showMsg.timestamp, showMsg.likes, showMsg.drops);
    }

    function likeMessage(uint _id) public {
        userLikes[msg.sender].push(_id);
        uint256 _newLikes = messages[_id].likes + 1;
        messages[_id].likes = _newLikes;
    }

    function unlikeMessage(uint _id) public {
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

    function dropMessage(uint _id, uint _drops) public {
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
    function followUser(address _user) public {
        userFollowers[msg.sender].push(_user);
    }

    // Unfollow a user
    function unfollowUser(address _user) public {
        // loop through all the followers
        for(uint i = 0; i < userFollowers[msg.sender].length; i++) {
            // delete the unfollowering entry
            if(userFollowers[msg.sender][i] == _user) {
                delete userFollowers[msg.sender][i];
            }
        }
    }
}