let TestApp = require('../node_modules/zos').TestApp

const InkDrop = artifacts.require('InkDrop')

contract('InkDrop reduceDrops', ([_, owner, ...accounts]) => {
	before(async () => {
		this.app = await TestApp() //{ from: owner }, 'zos.development.json')
		this.inkdropInstance = await this.app.createProxy(InkDrop, 'InkDrop', 'initialize', [owner])
	})
})
