const InkDrop = artifacts.require('InkDrop')
const MULTIPLIER = 100

contract('InkDrop (message functions)', async accounts => {
  before('initial setup with user creation', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createUser('testuser7', 'testbio', 'testhash', { from: accounts[7] })
    await inkdropInstance.createUser('testuser8', 'testbio', 'testhash', { from: accounts[8] })
    await inkdropInstance.createUser('testuser9', 'testbio', 'testhash', { from: accounts[9] })
  })

  it('...empty initialization', async () => {
    let inkdropInstance = await InkDrop.deployed()
    let count = await inkdropInstance.getMessageCount()
    assert.equal(count.toNumber(), 0, 'There should me 0 messages initially.')
    let user = await inkdropInstance.getUser(accounts[9])
    assert.equal(user[2].toNumber() / MULTIPLIER, 10, 'The user should have the initial 10 drops.')
  })

  it('...create message', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createMessage('Hello world', { from: accounts[9] })
    let count = await inkdropInstance.getMessageCount()
    assert.equal(count.toNumber(), 1, 'There should me now 1 message.')
    let user = await inkdropInstance.getUser(accounts[9])
    assert.equal(user[5].length, 1, 'The user should have as well 1 message.')
    assert.equal(user[2].toNumber() / MULTIPLIER, 10, 'The user should have the initial 10 drops.')
  })

  it('...create message with negative drops', async () => {
    let inkdropInstance = await InkDrop.deployed()
    try {
      await inkdropInstance.createMessage('Hello world2', { from: accounts[9], value: -1 })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...create message with emtpy content', async () => {
    let inkdropInstance = await InkDrop.deployed()
    try {
      await inkdropInstance.createMessage('', { from: accounts[9] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...create message from a non user', async () => {
    let inkdropInstance = await InkDrop.deployed()
    try {
      await inkdropInstance.createMessage('Hello', { from: accounts[2] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...get message', async () => {
    let inkdropInstance = await InkDrop.deployed()
    let msg = await inkdropInstance.getMessage(0, { from: accounts[9] })
    assert.equal(msg[0], 'Hello world', 'The message should have the defined content.')
    assert.equal(msg[1], accounts[9], 'The message should be written by the defined address.')
    assert.isTrue(new Date(msg[2] * 1000).getTime() > 0, 'Timestamp should be greater 0.')
    assert.isTrue(new Date(msg[3] * 1000).getTime() > 0, 'Timetolive should be greater 0.')
    // assert.isTrue(Array.isArray(msg[4]), 'The likes should be an array.')
    assert.equal(msg[4].toNumber(), 0, 'The message should have 0 likes.')
    // assert.isTrue(Array.isArray(msg[5]), 'The drops should be an array.')
    assert.equal(msg[5].toNumber(), 0, 'The message should have 0 drops.')
    assert.isTrue(Array.isArray(msg[6]), 'The comments should be an array.')
    assert.equal(msg[6].length, 0, 'The message should have 0 comments.')
  })

  it('...get message out of bounce', async () => {
    let inkdropInstance = await InkDrop.deployed()
    try {
      await inkdropInstance.getMessage(10, { from: accounts[9] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...like message', async () => {
    let inkdropInstance = await InkDrop.deployed()
    let count = await inkdropInstance.getMessageCount()
    assert.equal(count.toNumber(), 1, 'There should be now 1 message.')
    await inkdropInstance.likeMessage(0, { from: accounts[9] })
    let msg = await inkdropInstance.getMessage(0, { from: accounts[9] })
    assert.equal(msg[4].toNumber(), 1, 'The message should now have 1 like.')
  })

  it('...like message twice', async () => {
    let inkdropInstance = await InkDrop.deployed()
    let count = await inkdropInstance.getMessageCount()
    assert.equal(count.toNumber(), 1, 'There should me now 1 message.')
    try {
      await inkdropInstance.likeMessage(0, { from: accounts[9] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...like message out of bounce', async () => {
    let inkdropInstance = await InkDrop.deployed()
    try {
      await inkdropInstance.likeMessage(10, { from: accounts[9] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...like message from a non user', async () => {
    let inkdropInstance = await InkDrop.deployed()
    try {
      await inkdropInstance.likeMessage(0, { from: accounts[2] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...like message extended', async () => {
    let inkdropInstance = await InkDrop.deployed()
    let count = await inkdropInstance.getMessageCount()
    assert.equal(count.toNumber(), 1, 'There should be now 1 message.')
    await inkdropInstance.likeMessage(0, { from: accounts[8] })
    let msg = await inkdropInstance.getMessage(0, { from: accounts[8] })
    assert.equal(msg[4].toNumber(), 2, 'The message should now have 2 like.')
  })

  it('...unlike message', async () => {
    let inkdropInstance = await InkDrop.deployed()
    let msg = await inkdropInstance.getMessage(0, { from: accounts[9] })
    assert.equal(msg[4].toNumber(), 2, 'The message should have 2 like.')
    await inkdropInstance.unlikeMessage(0, { from: accounts[9] })
    msg = await inkdropInstance.getMessage(0, { from: accounts[9] })
    assert.equal(msg[4].toNumber(), 1, 'The message should now have 1 likes.')
  })

  it('...unlike message twice', async () => {
    let inkdropInstance = await InkDrop.deployed()
    try {
      await inkdropInstance.unlikeMessage(0, { from: accounts[9] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...unlike message out of bounce', async () => {
    let inkdropInstance = await InkDrop.deployed()
    try {
      await inkdropInstance.unlikeMessage(10, { from: accounts[9] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...unlike message from a non user', async () => {
    let inkdropInstance = await InkDrop.deployed()
    try {
      await inkdropInstance.unlikeMessage(0, { from: accounts[2] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...unlike message extended', async () => {
    let inkdropInstance = await InkDrop.deployed()
    let msg = await inkdropInstance.getMessage(0, { from: accounts[9] })
    assert.equal(msg[4].toNumber(), 1, 'The message should have 1 like.')
    await inkdropInstance.likeMessage(0, { from: accounts[9] })
    await inkdropInstance.likeMessage(0, { from: accounts[7] })

    msg = await inkdropInstance.getMessage(0, { from: accounts[9] })
    assert.equal(msg[4].toNumber(), 3, 'The message should have 3 like.')

    await inkdropInstance.unlikeMessage(0, { from: accounts[9] })
    msg = await inkdropInstance.getMessage(0, { from: accounts[9] })
    assert.equal(msg[4].toNumber(), 2, 'The message should now have 2 likes.')

    await inkdropInstance.unlikeMessage(0, { from: accounts[8] })
    msg = await inkdropInstance.getMessage(0, { from: accounts[8] })
    assert.equal(msg[4].toNumber(), 1, 'The message should now have 1 likes.')

    await inkdropInstance.unlikeMessage(0, { from: accounts[7] })
    msg = await inkdropInstance.getMessage(0, { from: accounts[7] })
    assert.equal(msg[4], 0, 'The message should now have 0 likes.')
  })

  it('...like and unlike message', async () => {
    let inkdropInstance = await InkDrop.deployed()
    let msg = await inkdropInstance.getMessage(0, { from: accounts[9] })
    assert.equal(msg[4].toNumber(), 0, 'The message should have 0 likes.')
    await inkdropInstance.likeMessage(0, { from: accounts[9] })

    msg = await inkdropInstance.getMessage(0, { from: accounts[9] })
    assert.equal(msg[4], 1, 'The message should have 1 like.')

    await inkdropInstance.unlikeMessage(0, { from: accounts[9] })
    msg = await inkdropInstance.getMessage(0, { from: accounts[9] })
    assert.equal(msg[4], 0, 'The message should now have 0 likes.')

    await inkdropInstance.likeMessage(0, { from: accounts[9] })
    msg = await inkdropInstance.getMessage(0, { from: accounts[9] })
    assert.equal(msg[4], 1, 'The message should now have 1 likes.')
  })

  it('...drop message', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createMessage('Hello world2', { from: accounts[9], value: 10 })
    let count = await inkdropInstance.getMessageCount()
    assert.equal(count.toNumber(), 2, 'There should me now 2 message.')
    let user = await inkdropInstance.getUser(accounts[9])
    assert.equal(user[5].length, 2, 'The user should have as well 2 messages.')

    let msg = await inkdropInstance.getMessage(1, { from: accounts[9] })
    assert.equal(msg[5].toNumber() / MULTIPLIER, 10, 'The message should have 10 drops.')

    await inkdropInstance.dropMessage(1, 5, { from: accounts[8] })
    msg = await inkdropInstance.getMessage(1, { from: accounts[8] })
    assert.equal(msg[5].toNumber() / MULTIPLIER, 15, 'The message should have 15 drops.')
  })

  it('...drop message and check payout to user', async () => {
    let inkdropInstance = await InkDrop.deployed()
    let user = await inkdropInstance.getUser(accounts[8])
    assert.equal(user[2].toNumber() / MULTIPLIER, 5, 'The user should have now only 5 drops left.')
    await inkdropInstance.createMessage('Hello world3', { from: accounts[8], value: 4 })

    let count = await inkdropInstance.getMessageCount()
    assert.equal(count.toNumber(), 3, 'There should me now 3 message.')

    let msg = await inkdropInstance.getMessage(2, { from: accounts[8] })
    assert.equal(msg[5].toNumber() / MULTIPLIER, 4, 'The message should have 4 drops.')
    user = await inkdropInstance.getUser(accounts[8])
    assert.equal(user[2].toNumber() / MULTIPLIER, 1, 'The user should have now only 1 drop left.')

    await inkdropInstance.dropMessage(2, 4, { from: accounts[7] })
    msg = await inkdropInstance.getMessage(2, { from: accounts[8] })
    assert.equal(msg[5].toNumber() / MULTIPLIER, 8, 'The message should have 8 drops.')
    user = await inkdropInstance.getUser(accounts[8])
    assert.equal(
      user[2].toNumber() / MULTIPLIER,
      3,
      'The author of the message should get 50% of the drops.'
    )
  })

  it('...drop message and check payout to user (decimal share)', async () => {
    let inkdropInstance = await InkDrop.deployed()
    let user = await inkdropInstance.getUser(accounts[8])
    assert.equal(user[2].toNumber() / MULTIPLIER, 3, 'The user should have 3 drops.')

    await inkdropInstance.dropMessage(2, 5, { from: accounts[7] })
    msg = await inkdropInstance.getMessage(2, { from: accounts[8] })
    assert.equal(msg[5].toNumber() / MULTIPLIER, 13, 'The message should have 13 drops.')
    user = await inkdropInstance.getUser(accounts[8])
    assert.equal(
      user[2].toNumber() / MULTIPLIER,
      5.5,
      'The author of the message should get 50% of the drops.'
    )
  })

  it('...drop message wit zero or negative number', async () => {
    let inkdropInstance = await InkDrop.deployed()
    try {
      await inkdropInstance.dropMessage(1, 0, { from: accounts[8] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
    try {
      await inkdropInstance.dropMessage(1, -1, { from: accounts[8] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...drop message out of bounce', async () => {
    let inkdropInstance = await InkDrop.deployed()
    try {
      await inkdropInstance.dropMessage(10, 1, { from: accounts[8] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...drop message from a non user', async () => {
    let inkdropInstance = await InkDrop.deployed()
    try {
      await inkdropInstance.dropMessage(1, 1, { from: accounts[3] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...drop message from a user with insufficient funds', async () => {
    let inkdropInstance = await InkDrop.deployed()
    user = await inkdropInstance.getUser(accounts[8])
    assert.equal(user[2].toNumber() / MULTIPLIER, 5.5, 'The user should have 5.5 drops left.')
    try {
      await inkdropInstance.dropMessage(1, 10, { from: accounts[8] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...create message from a user with insufficient funds', async () => {
    let inkdropInstance = await InkDrop.deployed()
    user = await inkdropInstance.getUser(accounts[8])
    assert.equal(user[2].toNumber() / MULTIPLIER, 5.5, 'The user should have 5.5 drops left.')
    try {
      await inkdropInstance.createMessage('Hello world', { from: accounts[8], value: 6 })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...create message with drop amount', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createMessage('Hello world2', { from: accounts[8], value: 4 })
    user = await inkdropInstance.getUser(accounts[8])
    assert.equal(user[2].toNumber() / MULTIPLIER, 1.5, 'The user should have 1.5 drops left.')
  })

  // it('...create message with decimal drop amount', async () => {
  //   let inkdropInstance = await InkDrop.deployed()
  //   await inkdropInstance.createMessage('Hello world2', { from: accounts[8] })
  //   user = await inkdropInstance.getUser(accounts[8])
  //   assert.equal(user[2].toNumber() / MULTIPLIER, 1, 'The user should have 1 drops left.')
  // })
})
