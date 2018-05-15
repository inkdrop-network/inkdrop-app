var InkDrop = artifacts.require('./InkDrop.sol')

contract('InkDrop', function(accounts) {
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

        return inkdropInstance.createUser(accounts[0], 'testuser', 'testbio', 'testhash', {
          from: accounts[0],
        })
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
        assert.equal(user[1], 'testbio', 'The should have the defined bio.')
        assert.equal(user[2].toNumber(), 0, 'The user should have 0 drops.')
        assert.equal(user[3], 'testhash', 'The should have the defined ipfsHash.')
        assert.equal(user[4].toNumber(), 0, 'The should have 0 followers.')
      })
  })

  it('...create user with address already in use', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.createUser(accounts[0], 'testuser', 'testbio', 'testhash', {
          from: accounts[0],
        })
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

        return inkdropInstance.createUser(accounts[0], '', 'testbio', 'testhash', {
          from: accounts[0],
        })
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

        return inkdropInstance.deleteUser(accounts[0])
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

        return inkdropInstance.deleteUser(accounts[0])
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

        return inkdropInstance.createUser(accounts[0], 'testuser1', 'testbio1', 'testhash1', {
          from: accounts[0],
        })
      })
      .then(function() {
        return inkdropInstance.createUser(accounts[1], 'testuser2', 'testbio2', 'testhash2', {
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

        return inkdropInstance.createUser(accounts[2], 'testuser3', 'testbio3', 'testhash3', {
          from: accounts[2],
        })
      })
      .then(function() {
        return inkdropInstance.getUserCount.call()
      })
      .then(function(userCount) {
        assert.equal(userCount.toNumber(), 3, '3 user should have been created.')
        return inkdropInstance.deleteUser(accounts[0])
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
        assert.equal(user[1], 'testbio3', 'The should have the defined bio.')
      })
  })

  it('...update username', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.updateUsername(accounts[1], 'newtestname')
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
        return inkdropInstance.updateUsername(accounts[1], '')
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

        return inkdropInstance.updateUserIpfsHash(accounts[1], 'newhash')
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

        return inkdropInstance.updateUserIpfsHash(accounts[1], '')
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

        return inkdropInstance.updateUserBio(accounts[1], 'newbio')
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

        return inkdropInstance.updateUserBio(accounts[1], '')
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

        return inkdropInstance.updateUser(accounts[1], 'newusername6', 'newbio6', 'newhash6')
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
        assert.equal(user[1], 'newbio6', 'The should have the defined bio.')
        assert.equal(user[3], 'newhash6', 'The should have the defined ipfsHash.')
      })
  })

  it('...update user with empty params', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.updateUser(accounts[1], '', '', '')
      })
      .then(function() {
        assert.fail('Should throw error.')
      })
      .catch(function(error) {
        const revertFound = error.message.search('revert') >= 0
        assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
      })
  })

  it('...follow user', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.followUser(accounts[2], { from: accounts[1] })
      })
      .then(function() {
        return inkdropInstance.getUser(accounts[1])
      })
      .then(function(user) {
        assert.equal(user[4].toNumber(), 1, 'The should have 1 followers.')
      })
  })

  // it('...follow user twice', function() {
  //   return InkDrop.deployed()
  //     .then(function(instance) {
  //       inkdropInstance = instance

  //       return inkdropInstance.followUser(accounts[2], { from: accounts[1] })
  //     })
  //     .then(function() {
  //       assert.fail('Should throw error.')
  //     })
  //     .catch(function(error) {
  //       const revertFound = error.message.search('revert') >= 0
  //       assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
  //     })
  // })

  it('...follow user from not a valid user', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.followUser(accounts[2], { from: accounts[0] })
      })
      .then(function() {
        assert.fail('Should throw error.')
      })
      .catch(function(error) {
        const revertFound = error.message.search('revert') >= 0
        assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
      })
  })

  it('...follow user that does not exist', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.followUser(accounts[0], { from: accounts[1] })
      })
      .then(function() {
        assert.fail('Should throw error.')
      })
      .catch(function(error) {
        const revertFound = error.message.search('revert') >= 0
        assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
      })
  })

  it('...unfollow user', function() {
    return InkDrop.deployed()
      .then(function(instance) {
        inkdropInstance = instance

        return inkdropInstance.getUser(accounts[1])
      })
      .then(function(user) {
        assert.equal(user[4].toNumber(), 1, 'The should have 1 followers.')
        return inkdropInstance.unfollowUser(accounts[2], { from: accounts[1] })
      })
      .then(function() {
        return inkdropInstance.getUser(accounts[1])
      })
      .then(function(user) {
        assert.equal(user[4].toNumber(), 0, 'The should have 0 followers.')
      })
  })
})
