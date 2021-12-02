require("dotenv").config();
const { deployments, ethers, artifacts } = require("hardhat");

const func = async function ({ deployments, getNamedAccounts, getChainId }) {
  const { deploy, execute } = deployments;
  const { deployer } = await getNamedAccounts();
  const chnAddress = process.env.CHN_ADDRESS;

  console.log( {deployer} );
  
  const timelock = await deploy("CHNTimelock", {
    from: deployer,
    args: [deployer, '259200'],
    log: true,
  });

  const governance = await deploy("CHNGovernance", {
    from: deployer,
    args: [timelock.address, chnAddress, deployer, ['100000000000000000000', '100000000000000000000', 50, 1, 17280]],
    log: true,
  });

  await sleep(30000);

  // try {
    await hre.run('verify:verify', {
      address: timelock.address,
      constructorArguments: [deployer, '259200'],
    })
  // } catch {

  // }

  // try {
    await hre.run('verify:verify', {
      address: governance.address,
      constructorArguments: [timelock.address, chnAddress, deployer, ['100000000000000000000', '100000000000000000000', 50, 1, 17280]],
    })
  // } catch {

  // }
};

module.exports = func;

module.exports.tags = ['deploy-verify'];


async function sleep(timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}