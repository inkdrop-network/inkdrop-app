const InkDrop = artifacts.require('InkDrop')

contract('InkDrop (reduce drops function)', async accounts => {
  let inkdropInstance
  const owner = accounts[0]

  beforeEach(async () => {
    inkdropInstance = await InkDrop.deployed()
  })

  before('initial setup with user and message creation', async () => {
    inkdropInstance = await InkDrop.deployed()
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

  it('...should reduce dropAmount by 20%', async () => {
    // let inkdropInstance = await InkDrop.deployed()
    let count = await inkdropInstance.getMessageCount()
    assert.equal(count.toNumber(), 3, 'There should me now 3 message.')

    // get message by id
    let msg0 = await inkdropInstance.getMessage(0, { from: accounts[8] })
    assert.equal(msg0[0], '#1', 'The message`s content should be `#1`.')
    assert.equal(
      msg0[5].toNumber(),
      2000000000000000,
      'The message should have 2000000000000000 wei.'
    )

    // TODO: onlyOwner modifier is currently not working without the initializer function

    await inkdropInstance.reduceDrops(0, { from: owner })

    // check reduction of drop amount
    msg0 = await inkdropInstance.getMessage(0, { from: accounts[8] })
    assert.equal(
      msg0[5].toNumber(),
      2000000000000000 * 0.8,
      'The message should have 80% of 2000000000000000 wei.'
    )
  })
})
