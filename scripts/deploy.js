async function main() {

    const [deployer] = await ethers.getSigners();

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Token = await ethers.getContractFactory("Voting");
    const token = await Token.deploy([ethers.utils.formatBytes32String('Sean Connery'),
        ethers.utils.formatBytes32String('Roger Moore'), ethers.utils.formatBytes32String('Daniel Craig')]);

    console.log("Voting contract address:", token.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });