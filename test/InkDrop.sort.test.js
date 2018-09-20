const InkDrop = artifacts.require('InkDrop')

contract('InkDrop (newsfeed sort function)', async accounts => {
  before('initial setup with user creation', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createUser('testuser7', 'testbio', 'testhash', { from: accounts[7] })
    await inkdropInstance.createUser('testuser8', 'testbio', 'testhash', { from: accounts[8] })
    await inkdropInstance.createMessage('#1', {
      from: accounts[7],
      value: 2000000000000000,
    })
    await inkdropInstance.createMessage('#2', {
      from: accounts[8],
      value: 1000000000000000,
    })
    await inkdropInstance.createMessage('#3', {
      from: accounts[8],
      value: 1500000000000000,
    })
  })

  it('...check initial messages order', async () => {
    let inkdropInstance = await InkDrop.deployed()
    let count = await inkdropInstance.getMessageCount()
    assert.equal(count.toNumber(), 3, 'There should be now 3 message.')

    // get message id at index
    let msgId0 = await inkdropInstance.getMessageIdAtIndex(0, { from: accounts[8] })
    assert.equal(msgId0.toNumber(), 0, 'The message #1 should be on pos. 0.')
    let msgId1 = await inkdropInstance.getMessageIdAtIndex(1, { from: accounts[8] })
    assert.equal(msgId1.toNumber(), 1, 'The message #2 should be on pos. 1.')
    let msgId2 = await inkdropInstance.getMessageIdAtIndex(2, { from: accounts[8] })
    assert.equal(msgId2.toNumber(), 2, 'The message #3 should be on pos. 2.')

    // get message by id
    let msg0 = await inkdropInstance.getMessage(0, { from: accounts[8] })
    assert.equal(msg0[0], '#1', 'The message`s content should be `#1`.')
    assert.equal(
      msg0[5].toNumber(),
      2000000000000000,
      'The message should have 2000000000000000 wei.'
    )
    let msg1 = await inkdropInstance.getMessage(1, { from: accounts[8] })
    assert.equal(msg1[0], '#2', 'The message`s content should be `#2`.')
    assert.equal(
      msg1[5].toNumber(),
      1000000000000000,
      'The message should have 1000000000000000 wei.'
    )
    let msg2 = await inkdropInstance.getMessage(2, { from: accounts[8] })
    assert.equal(msg2[0], '#3', 'The message`s content should be `#3`.')
    assert.equal(
      msg2[5].toNumber(),
      1500000000000000,
      'The message should have 1500000000000000 wei.'
    )
  })

  // it("...check users' messages before sort", async () => {
  //   let inkdropInstance = await InkDrop.deployed()
  //   let user7 = await inkdropInstance.getUser(accounts[7])
  //   assert.equal(user7[5].length, 1, 'The user should have 1 message.')
  //   assert.equal(user7[5][0].toNumber(), 2, 'The message id should still be 2.')
  //   let msgId2 = await inkdropInstance.getMessageIdAtIndex(1, {
  //     from: accounts[7],
  //   })
  //   assert.equal(msgId2.toNumber(), 0, 'The message #2 should now be on pos. 2.')

  //   let user8 = await inkdropInstance.getUser(accounts[8])
  //   assert.equal(user8[5].length, 2, 'The user should have 2 messages.')
  //   assert.equal(user8[5][0].toNumber(), 0, 'The message id should still be 0.')
  //   assert.equal(user8[5][1].toNumber(), 1, 'The message id should still be 1.')
  //   let msgId0 = await inkdropInstance.getMessageIdAtIndex(0, { from: accounts[7] })
  //   assert.equal(msgId0.toNumber(), 1, 'The message #2 should now be on pos. 0.')
  //   let msgId1 = await inkdropInstance.getMessageIdAtIndex(1, { from: accounts[7] })
  //   assert.equal(msgId1.toNumber(), 2, 'The message #3 should now be on pos. 1.')
  // })

  it('...sort messages', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.sort({ from: accounts[9] })

    // the indices of the messages should change
    let msgId0 = await inkdropInstance.getMessageIdAtIndex(0, { from: accounts[8] })
    assert.equal(msgId0.toNumber(), 1, 'The message #1 should be on pos. 1.')
    let msgId1 = await inkdropInstance.getMessageIdAtIndex(1, { from: accounts[8] })
    assert.equal(msgId1.toNumber(), 2, 'The message #3 should be on pos. 2.')
    let msgId2 = await inkdropInstance.getMessageIdAtIndex(2, { from: accounts[8] })
    assert.equal(msgId2.toNumber(), 0, 'The message #2 should be on pos. 0.')

    // but the message ids should stay the same
    let msg0 = await inkdropInstance.getMessage(msgId0, { from: accounts[8] })
    assert.equal(msg0[0], '#2', 'The message`s content should be `#1`.')
    assert.equal(
      msg0[5].toNumber(),
      1000000000000000,
      'The message should have 1000000000000000 wei.'
    )
    let msg1 = await inkdropInstance.getMessage(msgId1, { from: accounts[8] })
    assert.equal(msg1[0], '#3', 'The message`s content should be `#3`.')
    assert.equal(
      msg1[5].toNumber(),
      1500000000000000,
      'The message should have 1500000000000000 wei.'
    )
    let msg2 = await inkdropInstance.getMessage(msgId2, { from: accounts[8] })
    assert.equal(msg2[0], '#1', 'The message`s content should be `#1`.')
    assert.equal(
      msg2[5].toNumber(),
      2000000000000000,
      'The message should have 2000000000000000 wei.'
    )
  })

  it("...check users' messages after sort", async () => {
    let inkdropInstance = await InkDrop.deployed()
    let user7 = await inkdropInstance.getUser(accounts[7])
    assert.equal(user7[5].length, 1, 'The user should have 1 message.')
    assert.equal(user7[5][0].toNumber(), 0, 'The message id should still be 0.')
    let msgId2 = await inkdropInstance.getMessageIdAtIndex(2, {
      from: accounts[7],
    })
    assert.equal(msgId2.toNumber(), 0, 'The message #1 (msgId=0) should now be on pos. 2.')

    let user8 = await inkdropInstance.getUser(accounts[8])
    assert.equal(user8[5].length, 2, 'The user should have 2 messages.')
    assert.equal(user8[5][0].toNumber(), 1, 'The message id should still be 1.')
    assert.equal(user8[5][1].toNumber(), 2, 'The message id should still be 2.')
    let msgId0 = await inkdropInstance.getMessageIdAtIndex(0, {
      from: accounts[7],
    })

    assert.equal(msgId0.toNumber(), 1, 'The message #2 (msgId=1) should now be on pos. 0.')
    let msgId1 = await inkdropInstance.getMessageIdAtIndex(1, {
      from: accounts[7],
    })
    assert.equal(msgId1.toNumber(), 2, 'The message #3 (msgId=2) should now be on pos. 1.')
  })
})
