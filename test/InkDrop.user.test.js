var InkDrop = artifacts.require('InkDrop')
const MULTIPLIER = 100

contract('InkDrop (basic user CRUD functions)', function(accounts) {
  it('...empty contract instance', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.getUserCount.call()
      })
      .then(function(userCount) {
        assert.equal(userCount, 0, 'The contract should have 0 users initially.')
      })
  })

  it('...create user', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.createUser('testuser', 'testbio', 'testhash', { from: accounts[0] })
      })
      .then(function() {
        return inkdropInstance.getUserCount.call()
      })
      .then(function(userCount) {
        assert.equal(userCount.toNumber(), 1, 'One user should have been created.')
        return inkdropInstance.getUser(accounts[0])
      })
      .then(function(user) {
        assert.equal(web3.toUtf8(user[0]), 'testuser', 'The user should have the defined username.')
        assert.equal(user[1], 'testbio', 'The user should have the defined bio.')
        assert.equal(user[2].toNumber() / MULTIPLIER, 10, 'The user user should have 10 drops.')
        assert.equal(user[3], 'testhash', 'The user should have the defined ipfsHash.')
        assert.equal(user[4].toNumber(), 0, 'The user should have 0 followers.')
        assert.equal(user[5].length, 0, 'The user should have 0 messages.')
      })
  })

  it('...create user with address already in use', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.createUser('testuser', 'testbio', 'testhash', { from: accounts[0] })
      })
      .then(function() {
        assert.fail('Should throw error.')
      })
      .catch(function(error) {
        const revertFound = error.message.search('revert') >= 0
        assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
      })
  })

  it('...create user with empty username', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.createUser('', 'testbio', 'testhash', { from: accounts[1] })
      })
      .then(function() {
        assert.fail('Should throw error.')
      })
      .catch(function(error) {
        const revertFound = error.message.search('revert') >= 0
        assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
      })
  })

  it('...delete user', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.deleteUser({ from: accounts[0] })
      })
      .then(function() {
        return inkdropInstance.getUserCount.call()
      })
      .then(function(userCount) {
        assert.equal(userCount.toNumber(), 0, 'One user should have been created.')
      })
  })

  it('...delete user that does not exist', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.deleteUser({ from: accounts[0] })
      })
      .then(function() {
        assert.fail('Should throw error.')
      })
      .catch(function(error) {
        const revertFound = error.message.search('revert') >= 0
        assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
      })
  })

  it('...get user with index', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.createUser('testuser1', 'testbio1', 'testhash1', {
          from: accounts[0],
        })
      })
      .then(function() {
        return inkdropInstance.createUser('testuser2', 'testbio2', 'testhash2', {
          from: accounts[1],
        })
      })
      .then(function() {
        return inkdropInstance.getUserCount.call()
      })
      .then(function(userCount) {
        assert.equal(userCount.toNumber(), 2, '2 user should have been created.')
        return inkdropInstance.getUserAtIndex(0)
      })
      .then(function(userAdr) {
        assert.equal(userAdr, accounts[0], 'Should return the adress of the first user')
        return inkdropInstance.getUserAtIndex(1)
      })
      .then(function(userAdr) {
        assert.equal(userAdr, accounts[1], 'Should return the adress of the first user')
      })
  })

  it('...get user with index out of bound', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.getUserAtIndex(10)
      })
      .then(function() {
        assert.fail('Should throw error.')
      })
      .catch(function(error) {
        const revertFound = error.message.search('revert') >= 0
        assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
      })
  })

  it('...delete user and check new order of user', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.createUser('testuser3', 'testbio3', 'testhash3', {
          from: accounts[2],
        })
      })
      .then(function() {
        return inkdropInstance.getUserCount.call()
      })
      .then(function(userCount) {
        assert.equal(userCount.toNumber(), 3, '3 user should have been created.')
        return inkdropInstance.deleteUser({ from: accounts[0] })
      })
      .then(function() {
        return inkdropInstance.getUserAtIndex(0)
      })
      .then(function(userAdr) {
        assert.equal(userAdr, accounts[2], 'The third added user should now be on position 0')
        return inkdropInstance.getUser(userAdr)
      })
      .then(function(user) {
        assert.equal(
          web3.toUtf8(user[0]),
          'testuser3',
          'The user should have the defined username.'
        )
        assert.equal(user[1], 'testbio3', 'The user should have the defined bio.')
      })
  })

  it('...update username', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.updateUsername('newtestname', { from: accounts[1] })
      })
      .then(function() {
        return inkdropInstance.getUser(accounts[1])
      })
      .then(function(user) {
        assert.equal(web3.toUtf8(user[0]), 'newtestname', 'The user should have the new username.')
      })
  })

  it('...update username with invalid username', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance
        return inkdropInstance.updateUsername('', { from: accounts[1] })
      })
      .then(function() {
        assert.fail('Should throw error.')
      })
      .catch(function(error) {
        const revertFound = error.message.search('revert') >= 0
        assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
      })
  })

  it('...update ipfs hash', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.updateUserIpfsHash('newhash', { from: accounts[1] })
      })
      .then(function() {
        return inkdropInstance.getUser(accounts[1])
      })
      .then(function(user) {
        assert.equal(user[3], 'newhash', 'The user ipfsHash should be updated.')
      })
  })

  it('...update ipfs hash with empty string', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.updateUserIpfsHash('', { from: accounts[1] })
      })
      .then(function() {
        assert.fail('Should throw error.')
      })
      .catch(function(error) {
        const revertFound = error.message.search('revert') >= 0
        assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
      })
  })

  it('...update user bio', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.updateUserBio('newbio', { from: accounts[1] })
      })
      .then(function() {
        return inkdropInstance.getUser(accounts[1])
      })
      .then(function(user) {
        assert.equal(user[1], 'newbio', 'The user bio should be updated.')
      })
  })

  it('...update user bio with empty string', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.updateUserBio('', { from: accounts[1] })
      })
      .then(function() {
        assert.fail('Should throw error.')
      })
      .catch(function(error) {
        const revertFound = error.message.search('revert') >= 0
        assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
      })
  })

  it('...update user ', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.updateUser('newusername6', 'newbio6', 'newhash6', {
          from: accounts[1],
        })
      })
      .then(function() {
        return inkdropInstance.getUser(accounts[1])
      })
      .then(function(user) {
        assert.equal(
          web3.toUtf8(user[0]),
          'newusername6',
          'The user should have the defined username.'
        )
        assert.equal(user[1], 'newbio6', 'The user should have the defined bio.')
        assert.equal(user[3], 'newhash6', 'The user should have the defined ipfsHash.')
      })
  })

  it('...update user with empty params', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.updateUser('', '', '', { from: accounts[1] })
      })
      .then(function() {
        assert.fail('Should throw error.')
      })
      .catch(function(error) {
        const revertFound = error.message.search('revert') >= 0
        assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
      })
  })
})
