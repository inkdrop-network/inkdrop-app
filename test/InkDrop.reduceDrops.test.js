let TestApp = require('../node_modules/zos').TestApp

const InkDrop = artifacts.require('InkDrop')

contract('InkDrop reduceDrops', ([_, owner, ...accounts]) => {
	before(async () => {
		this.app = await TestApp() //{ from: owner }, 'zos.development.json')
		this.inkdropInstance = await this.app.createProxy(InkDrop, 'InkDrop', 'initialize', [owner])

		// inital user and message creation
		await this.inkdropInstance.createUser('testuser7', 'testbio', 'testhash', { from: accounts[6] })
		await this.inkdropInstance.createUser('testuser8', 'testbio', 'testhash', { from: accounts[7] })
		await this.inkdropInstance.createMessage('#1', {
			from: accounts[6],
			value: 2000000000000000,
		})
		await this.inkdropInstance.createMessage('#2', {
			from: accounts[7],
			value: 1000000000000000,
		})
		await this.inkdropInstance.createMessage('#3', {
			from: accounts[7],
			value: 1500000000000000,
		})
	})

	it('...should reduce dropAmount by 10%', async () => {
		let count = await this.inkdropInstance.getMessageCount()
		assert.equal(count.toNumber(), 3, 'There should me now 3 message.')

		// get message by id
		let msg0 = await this.inkdropInstance.getMessage(0, { from: accounts[7] })
		assert.equal(msg0[0], '#1', 'The message`s content should be `#1`.')
		assert.equal(
			msg0[5].toNumber(),
			2000000000000000,
			'The message should have 2000000000000000 wei.'
		)

		await this.inkdropInstance.reduceDrops(0, { from: owner })

		// check reduction of drop amount
		msg0 = await this.inkdropInstance.getMessage(0, { from: accounts[7] })
		assert.equal(
			msg0[5].toNumber(),
			2000000000000000 * 0.9,
			'The message should have 90% of 2000000000000000 wei.'
		)
	})

	it('...should only be allowed by the owner', async () => {
		try {
			await this.inkdropInstance.reduceDrops(0, { from: accounts[7] })
			assert.fail('Should throw error.')
		} catch (error) {
			const revertFound = error.message.search('revert') >= 0
			assert.equal(revertFound, true, `Expected "revert", got ${error} instead`)
		}
	})
})
