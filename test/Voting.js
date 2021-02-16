// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// `describe` is a Mocha function that allows you to organize your test. It's
// not actually needed, but having your test organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the test of that section. This callback can't be
// an async function.

describe("Voting contract", function () {
    // Mocha has four functions that let you hook into the the test runner's
    // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

    // They're very useful to setup the environment for test, and to clean it
    // up after they run.

    // A common pattern is to declare some variables, and assign them in the
    // `before` and `beforeEach` callbacks.

    let Voting;
    let hardhatVoting;
    let owner;
    let addr1;
    let addr2;
    let addrs;


    // `beforeEach` will run before each test, re-deploying the contract every
    // time. It receives a callback, which can be async.
    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        Voting = await ethers.getContractFactory("Voting");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // To deploy our contract, we just have to call Voting.deploy() and await
        // for it to be deployed(), which happens onces its transaction has been
        // mined.
        hardhatVoting = await Voting.deploy([ethers.utils.formatBytes32String('Sean Connery'),
            ethers.utils.formatBytes32String('Roger Moore'), ethers.utils.formatBytes32String('Daniel Craig')]);
    });

    // You can nest describe calls to create subsections.
    describe("Deployment", function () {
        // `it` is another Mocha function. This is the one you use to define your
        // test. It receives the test name, and a callback function.

        // If the callback function is async, Mocha will `await` it.
        it("Should have no votes for candidate Sean Connery", async function () {
            // Expect receives a value, and wraps it in an Assertion object. These
            // objects have a lot of utility methods to assert values.

            // This test expects the vote count for a candidate to equal 0
            const numVotes = await hardhatVoting.totalVotesFor(ethers.utils.formatBytes32String('Sean Connery'));
            expect (numVotes).to.equal(0);
        });
    });

    describe("Voting Transactions", function () {
        it("Should allow a vote for a candidate from two different voters", async function () {
            // Vote for Sean Connery from address 1
            await hardhatVoting.voteForCandidate(ethers.utils.formatBytes32String('Sean Connery'));
            await hardhatVoting.connect(addr1).voteForCandidate(ethers.utils.formatBytes32String('Sean Connery'));
            numVotes = await hardhatVoting.totalVotesFor(ethers.utils.formatBytes32String('Sean Connery'));
            expect (numVotes).to.equal(2);
        });

        // add your code here to test for second vote from same voter.  The test shold fail.
        // you can use code similar to the one below.

        it("Should not allow a vote for a non-existant candidate", async function () {
            await expect(
                hardhatVoting.voteForCandidate(ethers.utils.formatBytes32String('Betty Boop'))
            )
                .to.be.reverted;

        });
    });

});