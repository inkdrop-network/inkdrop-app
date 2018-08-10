const InkDrop = artifacts.require('InkDrop')

contract('InkDrop (drop functions)', async accounts => {
  before('initial setup with user creation', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createUser('testuser7', 'testbio', 'testhash', { from: accounts[7] })
    await inkdropInstance.createUser('testuser8', 'testbio', 'testhash', { from: accounts[8] })
    await inkdropInstance.createUser('testuser9', 'testbio', 'testhash', { from: accounts[9] })
  })

  it('...drop message with minimum amount', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createMessage('Hello world', { from: accounts[9] })
    let count = await inkdropInstance.getMessageCount()
    assert.equal(count.toNumber(), 1, 'There should me now 1 message.')
    let user = await inkdropInstance.getUser(accounts[9])
    assert.equal(user[5].length, 1, 'The user should have as well 1 message.')
    assert.equal(
      web3.eth.getBalance(inkdropInstance.address).toNumber(),
      0,
      'The contract should have 0 balance.'
    )
    let authorBalance = web3.eth.getBalance(accounts[9]).toNumber()
    await inkdropInstance.dropMessage(0, { from: accounts[7], value: 1000000000000000 })
    // check contract balance (50%)
    assert.equal(
      web3.eth.getBalance(inkdropInstance.address).toNumber(),
      1000000000000000 / 2,
      'The contract should have a balance of 50% of the dropped tokens.'
    )
    // check payout to the author (50%)
    assert.equal(
      web3.eth.getBalance(accounts[9]).toNumber(),
      authorBalance + 1000000000000000 / 2,
      'The author should get 50% of the dropped tokens.'
    )
    // check the authors earned drop amounts
    user = await inkdropInstance.getUser(accounts[9])
    assert.equal(
      user[2].toNumber(),
      1000000000000000 / 2,
      'The author of the message should get 50% of the weis.'
    )
    // check the message's drops
    msg = await inkdropInstance.getMessage(0, { from: accounts[8] })
    assert.equal(
      msg[5].toNumber(),
      1000000000000000,
      'The message should have 1000000000000000 wei.'
    )
    // check the contracts balance
    assert.equal(
      web3.eth.getBalance(inkdropInstance.address).toNumber(),
      1000000000000000 / 2,
      'The contract should have the 50% of the remaining drops.'
    )
  })

  it('...drop message with uneven amount and check payout', async () => {
    let inkdropInstance = await InkDrop.deployed()
    await inkdropInstance.createMessage('Hello world2', { from: accounts[7] })
    let authorBalance = web3.eth.getBalance(accounts[7]).toNumber()
    await inkdropInstance.dropMessage(1, { from: accounts[9], value: 1000000000000001 })

    user = await inkdropInstance.getUser(accounts[7])
    // check payout to author
    assert.equal(
      web3.eth.getBalance(accounts[7]).toNumber(),
      authorBalance + Math.floor(1000000000000001 / 2),
      'The author should get 50% of the dropped tokens.'
    )
    // check the authors earned drops
    assert.equal(
      user[2].toNumber(),
      Math.floor(1000000000000001 / 2),
      'The author of the message should get 50% of the weis minus remainer.'
    )
    // check the contracts balance
    assert.equal(
      web3.eth.getBalance(inkdropInstance.address).toNumber(),
      1000000000000000 / 2 + Math.ceil(1000000000000001 / 2),
      'The contract should have the 50% of the remaining drops.'
    )
  })

  it('...drop message with too little amount', async () => {
    let inkdropInstance = await InkDrop.deployed()

    try {
      await inkdropInstance.dropMessage(0, { from: accounts[7], value: 100000000000000 })
      assert.fail('Should throw error.')
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0
      assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
    }
  })

  it('...drop message extended', async () => {
    let inkdropInstance = await InkDrop.deployed()
    user = await inkdropInstance.getUser(accounts[8])
    assert.equal(user[2].toNumber(), 0, 'The author should have 0 balance.')

    await inkdropInstance.createMessage('Hello world3', {
      from: accounts[8],
      value: 1000000000000000,
    })

    // check the contracts balance
    assert.equal(
      web3.eth.getBalance(inkdropInstance.address).toNumber(),
      1000000000000000 / 2 + Math.ceil(1000000000000001 / 2) + 1000000000000000,
      'The contract should have all of the drops from createMessage.'
    )

    let authorBalance = web3.eth.getBalance(accounts[8]).toNumber()

    let msg = await inkdropInstance.getMessage(2, { from: accounts[8] })
    assert.equal(
      msg[5].toNumber(),
      1000000000000000,
      'The message should have 1000000000000000 wei.'
    )

    await inkdropInstance.dropMessage(2, { from: accounts[7], value: 2000000000000000 })
    await inkdropInstance.dropMessage(2, { from: accounts[9], value: 1000000000000000 })
    // check payout to author
    assert.equal(
      web3.eth.getBalance(accounts[8]).toNumber(),
      authorBalance + 2000000000000000 / 2 + 1000000000000000 / 2,
      'The author should get 50% of the dropped tokens.'
    )

    user = await inkdropInstance.getUser(accounts[8])
    assert.equal(
      user[2].toNumber(),
      1500000000000000,
      'The author should have 150000000000000 balance.'
    )

    msg = await inkdropInstance.getMessage(2, { from: accounts[8] })
    assert.equal(
      msg[5].toNumber(),
      4000000000000000,
      'The message should have now 4000000000000000 wei.'
    )

    assert.equal(
      web3.eth.getBalance(inkdropInstance.address).toNumber(),
      1000000000000000 / 2 +
        Math.ceil(1000000000000001 / 2) +
        1000000000000000 +
        2000000000000000 / 2 +
        1000000000000000 / 2,
      'The contract should have the 50% of the remaining drops.'
    )
  })
})
