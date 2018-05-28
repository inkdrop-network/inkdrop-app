var Authentication = artifacts.require('Authentication')
var InkDrop = artifacts.require('InkDrop')

module.exports = function(deployer) {
	deployer.deploy(Authentication)
	deployer.deploy(InkDrop)
}
