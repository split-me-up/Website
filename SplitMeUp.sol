pragma solidity >=0.4.22 <0.6.0;
contract ERC20Interface {
    function totalSupply() public view returns (uint);
    function balanceOf(address tokenOwner) public view returns (uint balance);
    function allowance(address tokenOwner, address spender) public view returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

contract SplitMeUp {
    struct PKHolder{
        string username;
        bool paid;
        uint reward;
        uint security;
    }
    // stores all those who are storing the keys and have paid or not
    mapping(address => PKHolder) public privateKeyHolders;
    // stores the acount number of all those who are storing the keys
    mapping(bytes32 => address) public keyStorageAccounts;
    address owner;
    address ERC20Address = 0xC4375B7De8af5a38a93548eb8453a498222C4fF2;

    // constant variables
    uint INITIALPAY = 2 * 10 ** 18;
    uint REWARD = 0.5 * 10 ** 18;
    uint SECURITY = 1 * 10 ** 18;
    uint ALLOWANCE = 9 * 10 ** 25;

    // getter setter for these variables
    function getInitialPay() view public returns(uint){
        require(msg.sender == owner);
        return INITIALPAY;
    }

    function setInitialPay(uint _newPay) public{
        require(msg.sender == owner);
        INITIALPAY = _newPay;
    }

    function getReward() view public returns(uint){
        require(msg.sender == owner);
        return REWARD;
    }

    function setReward(uint _newReward) public{
        require(msg.sender == owner);
        REWARD = _newReward;
    }

    function getSecurity() view public returns(uint){
        require(msg.sender == owner);
        return SECURITY;
    }

    function setSecurity(uint _newSecurity) public{
        require(msg.sender == owner);
        SECURITY = _newSecurity;
    }

    function getAllowance() view public returns(uint){
        require(msg.sender == owner);
        return ALLOWANCE;
    }

    function setAllowance(uint _newAllowance) public{
        require(msg.sender == owner);
        ALLOWANCE = _newAllowance;
    }

    ERC20Interface ERC20Contract = ERC20Interface(ERC20Address);

    constructor() public{
        owner = msg.sender;
    }

    function addNewStorageAccount(bytes32 _username) public{
        address holder = msg.sender;
        keyStorageAccounts[_username] = holder;
    }

    function addPrivateKeyHolder(string _username) public{
        address currAddress = msg.sender;
        require(ERC20Contract.balanceOf(currAddress) >= INITIALPAY);
        require(ERC20Contract.allowance(currAddress, this) >= ALLOWANCE);
        PKHolder memory current = PKHolder({username : _username, paid : true, reward : REWARD, security : SECURITY});
        ERC20Contract.transferFrom(currAddress, this, INITIALPAY);
        privateKeyHolders[currAddress] = current;


    }

}
