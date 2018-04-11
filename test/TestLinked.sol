pragma solidity ^0.4.21;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Linked.sol";

contract TestLinked {

    Linked linked = Linked(DeployedAddresses.Linked());

    function testSetProfile() public {
        linked.setProfile('Michael', 'Dev', 'MSc in CS');
    }

    function testWriteMessage() public {
        linked.writeMessage('Hello world!');
    }

    // function emptyInit() public {
    //     address adr = this;
    //     uint expected = 0;
    //     Assert.equal(linked.userFollowers(adr).length, expected, 'User should have 0 inital followers.');
    //     Assert.equal(linked.userMessages(adr).length, expected, 'User should have 0 inital messages.');

    // }

}