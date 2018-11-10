var DappToken = artifacts.require("./DappToken.sol");

contract('DappToken', function(accounts) {

  var tokenInstance;

  it('initializes the contract with the correct values', function() {
    //name
    return DappToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.name();
    }).then(function(name){
      assert.equal(name, 'DApp Token', 'has the correct name');
      //symbol
      return tokenInstance.symbol();
    }).then(function(symbol){
      assert.equal(symbol, 'DAPP', 'has the correct symbol');
      //standard
      return tokenInstance.standard();
    }).then(function(standard){
      assert.equal(standard, 'DApp Token v1.0', 'has the correct standard');
    });
  });

  it('allocates the initial supply upon deployment', function() {
    // We do a callback upon DappToken after deployment
    // This is done for asynchronous JS promises
    return DappToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    // We test if the totalSupply is indeed 1000000
    }).then(function(totalSupply) {
      assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
      // Return the balance of account #0
      return tokenInstance.balanceOf(accounts[0]);
      // Account #0 is now the admin account
      // We test if the admin account has been allocated the initial supply
    }).then(function(adminBalance){
      assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin account');
    });
  });

  it('transfers token ownership', function() {
    return DappToken.deployed().then(function(instance) {
      tokenInstance = instance;
      // Test 'require' statement first by transferring something larger than the sender's balance
      return tokenInstance.transfer.call(accounts[1], 999999999999999999999);
      // transfer.call does not trigger a transaction, but transfer does trigger a transaction
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
      // Test the transfer event
      // Test the return boolean of success
      return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
    }).then(function(success){
      assert.equal(success, true, 'it returns true');
      return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
    }).then(function(receipt){
      // Test the transfer trigger
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
      assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
      assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
      assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
      return tokenInstance.balanceOf(accounts[1]);
      // Test balance transfer
    }).then(function(balance){
      assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving account');
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 750000, 'deducts the amount from the sending account');
    });
  });
});
