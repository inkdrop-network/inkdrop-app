const InkDrop = artifacts.require('InkDrop')
const MULTIPLIER = 100

contract('InkDrop (comment functions)', async accounts => {
  before('initial setup with user creation', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createUser('testuser7', 'testbio', 'testhash', { from: accounts[7] })
    await inkdropInstance.createUser('testuser8', 'testbio', 'testhash', { from: accounts[8] })
    await inkdropInstance.createUser('testuser9', 'testbio', 'testhash', { from: accounts[9] })
  })

  it('...create message with initially 0 comments', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createMessage('Hello world1', 0, { from: accounts[9] })
    await inkdropInstance.createMessage('Hello world2', 0, { from: accounts[9] })
    let count = await inkdropInstance.getMessageCount()
    assert.equal(count.toNumber(), 2, 'There should be now 2 messages.')
  })

  it('...comment message', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createComment(0, 'Hello comment world1', { from: accounts[7] })
    let msg = await inkdropInstance.getMessage(0, { from: accounts[7] })
    assert.equal(msg[6].length, 1, 'The message should now have 1 comment.')
    assert.equal(msg[6][0], 0, 'Set first commentId for comment.')
    let comment = await inkdropInstance.getComment(msg[6][0], { from: accounts[7] })
    assert.equal(comment[0], 0, 'The message should the defined parent id.')
    assert.equal(comment[1], 'Hello comment world1', 'The message should have the defined content.')
    assert.equal(comment[2], accounts[7], 'The message should be written by the defined address.')
    assert.isTrue(new Date(comment[3] * 1000).getTime() > 0, 'Timestamp should be greater 0.')
    // assert.isTrue(new Date(comment[4] * 1000).getTime() > 0, 'Timetolive should be greater 0.')
    assert.equal(comment[5].toNumber(), 0, 'The message should have 0 likes.')
    assert.equal(comment[6].toNumber(), 0, 'The message should have 0 drops.')
    // assert.equal(comment[7].length, 0, 'The message should have 0 comments.')
  })

  it('...create comment with parent id out of bounce', async () => {
    let inkdropInstance = await InkDrop.deployed()
    try {
      await inkdropInstance.createComment(5, 'Hello world', { from: accounts[7] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...create comment from a non user', async () => {
    let inkdropInstance = await InkDrop.deployed()
    try {
      await inkdropInstance.createComment(0, 'Hello world', { from: accounts[1] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...create empty comment', async () => {
    let inkdropInstance = await InkDrop.deployed()
    try {
      await inkdropInstance.createComment(0, '', { from: accounts[7] })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...comment message extended', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createComment(0, 'Hello comment world3', { from: accounts[8] })
    await inkdropInstance.createComment(1, 'Hello comment world4', { from: accounts[8] })
    await inkdropInstance.createComment(0, 'Hello comment world5', { from: accounts[9] })
    let msg1 = await inkdropInstance.getMessage(0, { from: accounts[7] })
    assert.equal(msg1[6].length, 3, 'The message should now have 3 comments.')
    let comment1 = await inkdropInstance.getComment(msg1[6][1], { from: accounts[7] })
    assert.equal(comment1[2], accounts[8], 'The message should be written by the defined address.')
    let comment2 = await inkdropInstance.getComment(msg1[6][2], { from: accounts[7] })
    assert.equal(comment2[2], accounts[9], 'The message should be written by the defined address.')

    let msg2 = await inkdropInstance.getMessage(1, { from: accounts[7] })
    assert.equal(msg2[6].length, 1, 'The message should now have 1 comment.')
    let comment3 = await inkdropInstance.getComment(msg2[6][0], { from: accounts[7] })
    assert.equal(comment3[2], accounts[8], 'The message should be written by the defined address.')
    // assert.equal(msg[6][0], 0, 'Set first commentId for comment.')
    // let comment = await inkdropInstance.getComment(msg[6][0], { from: accounts[7] })
    // assert.equal(comment[0], 0, 'The message should the defined parent id.')
    // assert.equal(comment[1], 'Hello world', 'The message should have the defined content.')
    // assert.equal(comment[2], accounts[7], 'The message should be written by the defined address.')
    // assert.isTrue(new Date(comment[3] * 1000).getTime() > 0, 'Timestamp should be greater 0.')
    // // assert.isTrue(new Date(comment[4] * 1000).getTime() > 0, 'Timetolive should be greater 0.')
    // assert.equal(comment[5].toNumber(), 0, 'The message should have 0 likes.')
    // assert.equal(comment[6].toNumber(), 0, 'The message should have 0 drops.')
    // assert.equal(comment[7].length, 0, 'The message should have 0 comments.')
  })
})
