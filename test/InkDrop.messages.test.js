const InkDrop = artifacts.require('InkDrop')

contract('InkDrop (message functions)', async accounts => {
  before('initial setup with user creation', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createUser(accounts[8], 'testuser8', 'testbio', 'testhash', {
      from: accounts[8],
    })
    await inkdropInstance.createUser(accounts[9], 'testuser9', 'testbio', 'testhash', {
      from: accounts[9],
    })
  })

  it('...empty initialization', async () => {
    let inkdropInstance = await InkDrop.deployed()
    let count = await inkdropInstance.getMessageCount()
    assert.equal(count.toNumber(), 0, 'There should me 0 messages initially.')
  })

  it('...create message', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createMessage('Hello world', { from: accounts[9] })
    let count = await inkdropInstance.getMessageCount()
    assert.equal(count.toNumber(), 1, 'There should me now 1 message.')
    let user = await inkdropInstance.getUser(accounts[9])
    assert.equal(user[5].length, 1, 'The user should have as well 1 message.')
  })

  it('...get message', async () => {
    let inkdropInstance = await InkDrop.deployed()
    let msg = await inkdropInstance.getMessage(0, { from: accounts[9] })
    assert.equal(msg[0], 'Hello world', 'The message should have the defined content.')
    assert.equal(msg[1], accounts[9], 'The message should be written by the defined address.')
    assert.isTrue(new Date(msg[2] * 1000).getTime() > 0, 'Timestamp should be greater 0.')
    assert.isTrue(new Date(msg[3] * 1000).getTime() > 0, 'Timetolive should be greater 0.')
    // assert.equal(msg[4].toNumber(), 0, 'The message should have 0 likes.')
    assert.isTrue(Array.isArray(msg[4]), 'The likes should be an array.')
    assert.equal(msg[4].length, 0, 'The message should have 0 likes.')
    // assert.equal(msg[5].toNumber(), 0, 'The message should have 0 drop.')
    assert.isTrue(Array.isArray(msg[5]), 'The drops should be an array.')
    assert.equal(msg[5].length, 0, 'The message should have 0 drops.')
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
    assert.equal(msg[4].length, 1, 'The message should now have 1 like.')
    assert.equal(msg[4][0], accounts[9], 'The user address should be stored.')
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

  // it('...like message from a non user', async () => {
  //   let inkdropInstance = await InkDrop.deployed()
  //   try {
  //     await inkdropInstance.likeMessage(0, { from: accounts[10] })
  //     assert.fail('Should throw error.')
  //   } catch (error) {
  //     const revertFound = error.message.search('revert') >= 0
  //     assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
  //   }
  // })

  it('...like message extended', async () => {
    let inkdropInstance = await InkDrop.deployed()
    let count = await inkdropInstance.getMessageCount()
    assert.equal(count.toNumber(), 1, 'There should be now 1 message.')
    await inkdropInstance.likeMessage(0, { from: accounts[8] })
    let msg = await inkdropInstance.getMessage(0, { from: accounts[8] })
    assert.equal(msg[4].length, 2, 'The message should now have 2 like.')
    assert.equal(msg[4][1], accounts[8], 'The user address should be stored.')
  })

  it('...unlike message', async () => {
    let inkdropInstance = await InkDrop.deployed()
    let msg = await inkdropInstance.getMessage(0, { from: accounts[9] })
    assert.equal(msg[4].length, 2, 'The message should have 2 like.')
    await inkdropInstance.unlikeMessage(0, { from: accounts[9] })
    // msg = await inkdropInstance.getMessage(0, { from: accounts[9] })
    // assert.equal(msg[4].length, 1, 'The message should now have 1 likes.')
    // assert.equal(msg[4][0], accounts[8], 'The user address should be stored.')
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
})
