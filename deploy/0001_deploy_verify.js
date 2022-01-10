require("dotenv").config();
const { deployments, ethers, artifacts } = require("hardhat");

const func = async function ({ deployments, getNamedAccounts, getChainId }) {
  const { deploy, execute } = deployments;
  const { deployer } = await getNamedAccounts();
  const chnAddress = process.env.CHN_ADDRESS;

  console.log( {deployer} );
  
  const timelock = await deploy("CHNTimelock", {
    from: deployer,
    args: [deployer, '180'],
    // args: [deployer, '259200'],
    log: true,
  });

  const governance = await deploy("CHNGovernance", {
    from: deployer,
    // args: [timelock.address, chnAddress, deployer, ['100000000000000000000', '100000000000000000000', 50, 1, 17280]],
    args: [timelock.address, chnAddress, 0, deployer, ['100000000000000000000', '100000000000000000000', 50, 1, 1800]],
    log: true,
  });

  console.log(timelock.address);
  console.log(governance.address);

  await sleep(30000);

  try {
    await hre.run('verify:verify', {
      address: timelock.address,
      constructorArguments: [deployer, '180'],
      // constructorArguments: [deployer, '259200'],
    })
  } catch {

  }

  // try {
    await hre.run('verify:verify', {
      address: governance.address,
      // constructorArguments: [timelock.address, chnAddress, deployer, ['100000000000000000000', '100000000000000000000', 50, 1, 17280]],
      constructorArguments: [timelock.address, chnAddress, 0, deployer, ['100000000000000000000', '100000000000000000000', 50, 1, 1800]],
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