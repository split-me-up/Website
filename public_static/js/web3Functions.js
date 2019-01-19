const web3 = new Web3(
    new Web3.providers.HttpProvider(
        "https://kovan.infura.io/ZWXhYfP2uIvdg1yKuQNY "
    )
);
const contractAbi = [{"constant":true,"inputs":[],"name":"getInitialPay","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newPay","type":"uint256"}],"name":"setInitialPay","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_username","type":"string"}],"name":"storageUsernameValidity","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getSecurity","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newReward","type":"uint256"}],"name":"setReward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_username","type":"string"}],"name":"addPrivateKeyHolder","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newAllowance","type":"uint256"}],"name":"setAllowance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_holder","type":"string"},{"name":"_sender1","type":"string"},{"name":"_sender2","type":"string"}],"name":"privateKeyRetreived","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getReward","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_username","type":"string"}],"name":"addNewStorageAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getNumberOfKeyStores","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newSecurity","type":"uint256"}],"name":"setSecurity","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAllowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_username","type":"string"},{"name":"_storageAddress","type":"address"}],"name":"addStorageAccountByAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getNumberOfKeyHolders","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_username","type":"string"}],"name":"privateKeyUsernameValidity","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
const contractAddress = "0xE65eC838360168057b780D85FFD4C2CD8B33B158";
const contract = new web3.eth.Contract(contractAbi, contractAddress);
const Erc20Abi = [
    {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [{ name: "", type: "bytes32" }],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: false,
        inputs: [],
        name: "stop",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            { name: "guy", type: "address" },
            { name: "wad", type: "uint256" }
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: false,
        inputs: [{ name: "owner_", type: "address" }],
        name: "setOwner",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            { name: "src", type: "address" },
            { name: "dst", type: "address" },
            { name: "wad", type: "uint256" }
        ],
        name: "transferFrom",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            { name: "guy", type: "address" },
            { name: "wad", type: "uint256" }
        ],
        name: "mint",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: false,
        inputs: [{ name: "wad", type: "uint256" }],
        name: "burn",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: false,
        inputs: [{ name: "name_", type: "bytes32" }],
        name: "setName",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: true,
        inputs: [{ name: "src", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "stopped",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: false,
        inputs: [{ name: "authority_", type: "address" }],
        name: "setAuthority",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "owner",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [{ name: "", type: "bytes32" }],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            { name: "guy", type: "address" },
            { name: "wad", type: "uint256" }
        ],
        name: "burn",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: false,
        inputs: [{ name: "wad", type: "uint256" }],
        name: "mint",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            { name: "dst", type: "address" },
            { name: "wad", type: "uint256" }
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            { name: "dst", type: "address" },
            { name: "wad", type: "uint256" }
        ],
        name: "push",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            { name: "src", type: "address" },
            { name: "dst", type: "address" },
            { name: "wad", type: "uint256" }
        ],
        name: "move",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: false,
        inputs: [],
        name: "start",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "authority",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: false,
        inputs: [{ name: "guy", type: "address" }],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: true,
        inputs: [
            { name: "src", type: "address" },
            { name: "guy", type: "address" }
        ],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            { name: "src", type: "address" },
            { name: "wad", type: "uint256" }
        ],
        name: "pull",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [{ name: "symbol_", type: "bytes32" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "guy", type: "address" },
            { indexed: false, name: "wad", type: "uint256" }
        ],
        name: "Mint",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "guy", type: "address" },
            { indexed: false, name: "wad", type: "uint256" }
        ],
        name: "Burn",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [{ indexed: true, name: "authority", type: "address" }],
        name: "LogSetAuthority",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [{ indexed: true, name: "owner", type: "address" }],
        name: "LogSetOwner",
        type: "event"
    },
    {
        anonymous: true,
        inputs: [
            { indexed: true, name: "sig", type: "bytes4" },
            { indexed: true, name: "guy", type: "address" },
            { indexed: true, name: "foo", type: "bytes32" },
            { indexed: true, name: "bar", type: "bytes32" },
            { indexed: false, name: "wad", type: "uint256" },
            { indexed: false, name: "fax", type: "bytes" }
        ],
        name: "LogNote",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "src", type: "address" },
            { indexed: true, name: "guy", type: "address" },
            { indexed: false, name: "wad", type: "uint256" }
        ],
        name: "Approval",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "src", type: "address" },
            { indexed: true, name: "dst", type: "address" },
            { indexed: false, name: "wad", type: "uint256" }
        ],
        name: "Transfer",
        type: "event"
    }
];
const TokenAddress = "0xC4375B7De8af5a38a93548eb8453a498222C4fF2";
const TokenContract = new web3.eth.Contract(Erc20Abi, TokenAddress);
const DaiToBeSent = 2;
const APPROVAL = '999999999999999999999999999999';
console.log(contract);

/* Function to fetch Dai Balance for a certain Address
   @Param address {string}
   Returns {number} (Dai Balance) Wrapped in a Promise */
function getDaiBalance(address) {
    return new Promise(function(resolve, reject) {
        TokenContract.methods
            .balanceOf(address)
            .call()
            .then(function(result) {
                resolve(result / 10 ** 18);
            })
            .catch(function(err) {
                reject(err);
            });
    });
}

/*
    Function checks if a certain address has provided allowance to the
    SplitMeUp smart contract
    @Param address {string}
    Returns {boolean} (true if allowance provided
                       false if allowance not provided) wrapped in a Promise
 */
function checkApproval(address) {
    return new Promise(function(resolve, reject) {
        TokenContract.methods
            .allowance(address, contractAddress)
            .call()
            .then(function(result) {
                console.log(result);
                if (result.toString().length >= APPROVAL.length) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
    });
}

/*
    Function checks if a certain username is used or not
    @Param username {string}
    Returns {boolean} (true if username can be used and vice versa) wrapped in a Promise
 */
function checkUsernameAvailability(username){
    return new Promise(function (resolve, reject) {
       contract.methods
           .privateKeyUsernameValidity(username)
           .call()
           .then(function (boolean) {
               resolve(!boolean);
           })
    });
}

/*
    Function gets allowance for a certain address from the Dai Contract
    for the SplitMeUp smart contract by making a transaction
    @Param privateKey {string}
    @Param address {string}
    @Param callingFunctions {Object}
    Returns {boolean} (true if everything works fine) wrapped in a Promise
 */
function getApproved(privateKey, address, callingFunctions) {
    alert("Getting Approval from Dai");
    return new Promise(function(resolve, reject) {
        TokenContract.methods
            .approve(contractAddress, APPROVAL)
            .estimateGas({
                from: address
            })
            .then(function(gasPrice) {
                console.log(gasPrice);
                let transaction = {
                    from: web3.utils.toChecksumAddress(address),
                    to: web3.utils.toChecksumAddress(TokenAddress),
                    gas: gasPrice + 1000,
                    data: TokenContract.methods
                        .approve(contractAddress, APPROVAL)
                        .encodeABI()
                };

                callingFunctions.gettingApproval(transaction, function() {
                    let signPromise = web3.eth.accounts.signTransaction(
                        transaction,
                        privateKey
                    );
                    console.log(signPromise);
                    signPromise
                        .then(signedTx => {
                            console.log(signedTx);
                            const sentTx = web3.eth.sendSignedTransaction(
                                signedTx.raw || signedTx.rawTransaction
                            );
                            sentTx.on("receipt", receipt => {
                                console.log("Got Allowance \n", receipt);
                                resolve(true);
                            });
                            sentTx.on("transactionHash", function(hash) {
                                callingFunctions.approvalMining(hash);
                                console.log("Allowance hash =", hash);
                            });
                            sentTx.on("error", err => {
                                reject(err);
                            });
                        })
                        .catch(err => {
                            reject(err);
                        });
                });
            });
    });
}

/*
    Function to make a transaction to the SplitMeUp smart contract to store
    Dai Security and save username on it
    @Param username {string}
    @Param privateKey {string}
    @Param address {string}
    @Param callingFunctions {Object}
    Returns {boolean} (true if everything works fine) wrapped in a Promise
 */
function depositSecurity(username, privateKey, address, callingFunctions) {
    return new Promise(function(resolve, reject) {
        alert("Depositing Security = " + DaiToBeSent + "Dai");
        contract.methods
            .addPrivateKeyHolder(username)
            .estimateGas({ from: address })
            .then(function(gasPrice) {
                let transaction = {
                    from: web3.utils.toChecksumAddress(address),
                    to: web3.utils.toChecksumAddress(contractAddress),
                    gas: gasPrice + 1000,
                    data: contract.methods.addPrivateKeyHolder(username).encodeABI()
                };

                callingFunctions.sendingDai(transaction, function() {
                    let signPromise = web3.eth.accounts.signTransaction(
                        transaction,
                        privateKey
                    );
                    console.log(signPromise);
                    signPromise
                        .then(signedTx => {
                            console.log(signedTx);
                            const sentTx = web3.eth.sendSignedTransaction(
                                signedTx.raw || signedTx.rawTransaction
                            );
                            sentTx.on("receipt", receipt => {
                                console.log(receipt);
                                alert("Transaction Mined");
                                resolve(true);
                            });
                            sentTx.on("transactionHash", function(hash) {
                                // alert("Transaction Mining");
                                callingFunctions.sendingDaiMining(hash);
                                console.log("hash =", hash);
                            });
                            sentTx.on("error", err => {
                                reject(err);
                            });
                        })
                        .catch(err => {
                            reject(err);
                        });
                });
            });
    });
}

function privateKeyRegeneratedTransaction(
    privateKey,
    address,
    username,
    user1,
    user2,
    callingFunctions
) {
    return new Promise(function(resolve, reject) {
        alert("Using Private Key to gather security deposit");
        contract.methods
            .privateKeyRetreived(username, user1, user2)
            .estimateGas({ from: address })
            .then(function(gasPrice) {
                let transaction = {
                    from: web3.utils.toChecksumAddress(address),
                    to: web3.utils.toChecksumAddress(contractAddress),
                    gas: gasPrice + 1000,
                    data: contract.methods
                        .privateKeyRetreived(username, user1, user2)
                        .encodeABI()
                };
                let signPromise = web3.eth.accounts.signTransaction(
                    transaction,
                    privateKey
                );
                console.log(signPromise);
                signPromise
                    .then(signedTx => {
                        console.log(signedTx);
                        const sentTx = web3.eth.sendSignedTransaction(
                            signedTx.raw || signedTx.rawTransaction
                        );
                        sentTx.on("receipt", receipt => {
                            callingFunctions.blockMined(receipt.transactionHash);
                            console.log(receipt);
                            alert(
                                "Transaction Mined check At https://kovan.etherscan.io/tx/" +
                                receipt.transactionHash
                            );
                            resolve(true);
                        });
                        sentTx.on("transactionHash", function(hash) {
                            callingFunctions.transactionToRetrieveSecuritySent(hash);
                            alert(
                                "Transaction Mining check At https://kovan.etherscan.io/tx/" +
                                hash
                            );
                            console.log("hash =", hash);
                        });
                        sentTx.on("error", err => {
                            reject(err);
                        });
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
    });
}

function releaseFunds(username, user1, user2, privateKey, callingFunctions) {
    callingFunctions.keysReceived();
    let account = web3.eth.accounts.privateKeyToAccount(privateKey);
    let address = account.address;
    privateKeyRegeneratedTransaction(
        privateKey,
        address,
        username,
        user1,
        user2,
        callingFunctions
    );
}

function splitKey(privateKey, username, callingFunctions) {
    return new Promise(function(resolve, reject) {
        let account = web3.eth.accounts.privateKeyToAccount(privateKey);
        let address = account.address;
        getDaiBalance(address).then(function(balance) {
            if (balance >= DaiToBeSent) {
                checkApproval(address).then(function(approved) {
                    if (approved) {
                        depositSecurity(
                            username,
                            privateKey,
                            address,
                            callingFunctions
                        ).then(function() {
                            resolve(true);
                        });
                    } else {
                        getApproved(privateKey, address, callingFunctions).then(function() {
                            //SHOULD I PASS CALLINGFUNCTIONS HERE TO DEPOSIT SECURITNGAS WELL??
                            depositSecurity(
                                username,
                                privateKey,
                                address,
                                callingFunctions
                            ).then(function() {
                                resolve(true);
                            });
                        });
                    }
                });
            } else {
                alert("Insufficient Dai Balance in Your Account");
            }
        });
    });
}
