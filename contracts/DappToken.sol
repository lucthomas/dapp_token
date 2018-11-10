pragma solidity ^0.4.2;

contract DappToken {
    // Declare variables

    //name
    string public name = "DApp Token";
    //symbol
    string public symbol = "DAPP";
    //standard
    string public standard = "DApp Token v1.0";

    uint256 public totalSupply;
    // We define a mapping which is a key-value store
    // The mapping is called balanceOf and publicly available
    // balanceOf take the address of the owner and returns the balance of that address
    mapping(address => uint256) public balanceOf;

    // To emit a transfer event we must declare one
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

     // Constructors

    constructor(uint256 _initialSupply) public {
        // Allocate the initial supply 
        // We pass into the key msg.sender of the balanceOf mapping the value _initialSupply
        // msg is a global variable in solidity with several different values that can be read from it
        // sender corresponds with the first account in the ganache client 
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
        // We define the initial supply in 2_deploy_contracts as 1000000
    }

    // Transfer
    function transfer(address _to, uint256 _value) public returns (bool success) {
        // Exception if account doesn't have enough
        require(balanceOf[msg.sender] >= _value);
        // Transfer the balance
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        // Trigger Transfer Event
        emit Transfer(msg.sender, _to, _value);
        // Return a boolean
        return true;
    }
}
