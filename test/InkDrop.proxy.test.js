// import { TestApp } from 'zos'
let TestApp = require('../node_modules/zos').TestApp

const InkDrop = artifacts.require('InkDrop')

contract('InkDrop proxy pattern', function([_, owner, recipient]) {
	beforeEach(async function() {
		console.log('Before each')
		this.app = await TestApp({ from: owner }, 'zos.development.json')
	})

	describe('via proxy', function() {
		it('should create a proxy', async function() {
			this.app = await TestApp({ from: owner }, 'zos.test.json')
			// Check description here: https://github.com/zeppelinos/zos/issues/60#issuecomment-419140273
			const proxy = await this.app.createProxy(InkDrop, 'InkDrop', 'initialize', [recipient])
		})
	})

	// describe('via proxy, total supply', function() {
	// 	it('should create a proxy for the stdlib', async function() {
	// 		const proxy = await this.app.createProxy(InkDrop, 'InkDrop', 'initialize') //, { owner: owner })
	// 		// const result = await proxy.totalSupply()
	// 		// assert.equal(result.toNumber(), 0, 'Should have 0 supply.')
	// 	})
	// })
})
