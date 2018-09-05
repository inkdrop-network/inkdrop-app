// import { TestApp } from 'zos'

// const InkDrop = artifacts.require('InkDrop')

// contract('InkDrop proxy pattern', function([_, owner]) {
//   beforeEach(async function() {
//     this.app = await TestApp({ from: owner })
//   })

//   it('should create a proxy', async function() {
//     const proxy = await this.app.createProxy(InkDrop)
//   })

//   it('should create a proxy for the stdlib', async function() {
//     const proxy = await this.app.createProxy(InkDrop)
//     const result = await proxy.totalSupply()
//     assert.equal(result.toNumber(), 0, 'Should have 0 supply.')
//   })
// })
