// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

contract DonationForGood {
    address owner;
    uint256 ONE_ETHER = 1000000000000000000;

    //test functions starts
    function test() public pure returns (string memory) {
        return "Hello World";
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    //test functions ends

    //setting the owner of the contract
    constructor() {
        owner = msg.sender;
    }

    //setting the events
    event tokenRecieved(uint256 tokenAlloted, string name);
    event amountDonated(uint256 amount, address from, address to);
    event checkOutDone(uint256 amount, address to);


    //modifier for owner
    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }

    //making a struct for donor

    struct D_Account {
        address payable wallet;
        string name;
        uint256 totalDonationEther;
        uint256 tokens;
        bool activeStatus;
    }

    //mapping the address to the struct

    mapping(address => D_Account) d_acc;
    address[] public donor_acc_list;

    //function available to donor to create an account
    function createDonorAcc(string memory name) public {
        D_Account memory acc;
        acc.name = name;
        acc.activeStatus = true;
        acc.tokens = 0;
        acc.totalDonationEther = 0;
        acc.wallet = payable(msg.sender);
        donor_acc_list.push(payable(msg.sender));
        d_acc[(msg.sender)] = acc;
    }

    //function to get the details of the donor
    function getDetailsDonor(
        address checkfor
    ) public view returns (address, string memory, uint256, uint256, bool) {
        return (
            d_acc[checkfor].wallet,
            d_acc[checkfor].name,
            d_acc[checkfor].totalDonationEther,
            d_acc[checkfor].tokens,
            d_acc[checkfor].activeStatus
        );
    }

    //function for charity to create an account

    struct R_Account {
        address payable wallet;
        string name;
        uint256 moneyRequestedEther;
        uint256 currentAmount;
        string cause;
        bool activeStatus;
        string[] history;
        uint256 upVotes;
    }
    
    mapping(address => R_Account) r_acc;
    address[] public reciever_acc_list; 

    function createRecieverAcc( 
        string memory name,
        uint256 amount,
        string memory cause 
    ) public {
        R_Account memory acc;
        acc.name = name;
        acc.activeStatus = false;
        acc.moneyRequestedEther = amount * ONE_ETHER;
        acc.cause = cause;
        acc.currentAmount = 0;
        acc.upVotes = 0;
        acc.wallet = payable(msg.sender);
        reciever_acc_list.push(payable(msg.sender));
        r_acc[(msg.sender)] = acc;
    } 

    function getDetailsReciever(
        address checkfor
    )
        public
        view
        returns (
            address,
            string memory,
            string memory,
            uint256,
            uint256,
            bool,
            uint256
        )
    {
        return (
            r_acc[checkfor].wallet,
            r_acc[checkfor].name,
            r_acc[checkfor].cause,
            r_acc[checkfor].moneyRequestedEther, 
            r_acc[checkfor].currentAmount,
            r_acc[checkfor].activeStatus,
            r_acc[checkfor].upVotes 
        );
    }


    //function for owner to activate or deactivate the account
    function activateRecieverAcc(address add) public ownerOnly {
        r_acc[add].activeStatus = true;
    }

    function deactivateRecieverAcc(address add) public ownerOnly {
        r_acc[add].activeStatus = false;
    }

    function activateDonorAcc(address add) public ownerOnly {
        d_acc[add].activeStatus = true;
    }

    function deactivateDonorAcc(address add) public ownerOnly {
        d_acc[add].activeStatus = false;
    }

    //From here i write funtions for donor
    //Viewing available donating options
    //this will be done in front end
    //donating
    function donateTo(address To) public payable {
        require(
            d_acc[msg.sender].activeStatus,
            "You must have a valid donor account, Please create one"
        );
        require(
            r_acc[To].activeStatus,
            "This is not a valid reciever account."
        );
        require(
            msg.value > 0 &&
                msg.value <=
                (r_acc[To].moneyRequestedEther - r_acc[To].currentAmount),
            "The amount you are donating is not valid"   
        );
        r_acc[To].currentAmount += msg.value;
        d_acc[msg.sender].totalDonationEther += msg.value;
        if (d_acc[msg.sender].totalDonationEther > (5 * ONE_ETHER)) {
            d_acc[msg.sender].tokens += 10;
            emit tokenRecieved(10, d_acc[msg.sender].name);
        }
        if (
            (r_acc[To].moneyRequestedEther == r_acc[To].currentAmount)
        ) {
            r_acc[To].activeStatus = false;
            r_acc[To].cause = "Request Done No longer accepting donations";
        }
        emit amountDonated(msg.value, msg.sender, To);
    }

    //history management
    function pushHistory(address reciever, string memory reason) public {
        r_acc[reciever].history.push(reason);
    }
    function getHistory(address reciever) public view returns (string[] memory) {
        return r_acc[reciever].history;
    }

    //checking out
    function checkOut(string memory reason, uint amount) public payable {
        require(
            r_acc[msg.sender].activeStatus,
            "Not a valid account or you aare not the reciever owner"
        );
        pushHistory(msg.sender, reason);
        payable(msg.sender).transfer(amount);
        r_acc[msg.sender].moneyRequestedEther -= amount;  
        r_acc[msg.sender].currentAmount -= amount; //resetting the current amount
    }
 
    function getRecieverList() public view returns (address[] memory) {
        return reciever_acc_list;
    }
    function upVote(address reciever) public {
        r_acc[reciever].upVotes += 1;
    }
}
