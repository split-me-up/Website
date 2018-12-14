const web3 = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io/ZWXhYfP2uIvdg1yKuQNY '));
const contractAbi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "username",
                "type": "string"
            }
        ],
        "name": "splitKey",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "setContractAddress",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_user1",
                "type": "string"
            },
            {
                "name": "_user2",
                "type": "string"
            },
            {
                "name": "_selfUsername",
                "type": "string"
            }
        ],
        "name": "privateKeyRegenerated",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_username",
                "type": "string"
            }
        ],
        "name": "addAndroidUser",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "LogSomething",
        "type": "event"
    }
];
const contractAddress = '0xae27d33d7a797C8fD777f07c4B97292aE24De75E';
const contract = new web3.eth.Contract(contractAbi, contractAddress);
const Erc20Abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"stop","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner_","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"name_","type":"bytes32"}],"name":"setName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"stopped","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"authority_","type":"address"}],"name":"setAuthority","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"push","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"move","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"start","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"authority","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"},{"name":"guy","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"wad","type":"uint256"}],"name":"pull","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"symbol_","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"authority","type":"address"}],"name":"LogSetAuthority","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"LogSetOwner","type":"event"},{"anonymous":true,"inputs":[{"indexed":true,"name":"sig","type":"bytes4"},{"indexed":true,"name":"guy","type":"address"},{"indexed":true,"name":"foo","type":"bytes32"},{"indexed":true,"name":"bar","type":"bytes32"},{"indexed":false,"name":"wad","type":"uint256"},{"indexed":false,"name":"fax","type":"bytes"}],"name":"LogNote","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"}];
const TokenAddress = '0xC4375B7De8af5a38a93548eb8453a498222C4fF2';
const TokenContract = new web3.eth.Contract(Erc20Abi, TokenAddress);
const DaiToBeSent = 2;
console.log(contract);

function getDaiBalance(address) {
    return new Promise(function (resolve, reject) {
        TokenContract.methods.balanceOf(address).call()
            .then(function (result) {
                resolve(result / 1000000000000000000);
            }).catch(function (err) {
            reject(err);
        });
    });
}

function checkApproval(address) {
    return new Promise(function (resolve, reject) {
        TokenContract.methods.allowance(address, contractAddress).call()
            .then(function (result) {
                console.log(result);
                if(result > 2){
                    resolve(true);
                }else{
                    resolve(false);
                }
            });
    });
}

function getApproved(privateKey, address) {
    alert("Getting Approval from Dai");
    return new Promise(function (resolve, reject) {
        TokenContract.methods.approve(contractAddress, '9999995999999999999999999').estimateGas({
            from : address
        }).then(function (gasPrice) {
            console.log(gasPrice);
            let transaction = {
                from : web3.utils.toChecksumAddress(address),
                to :  web3.utils.toChecksumAddress(TokenAddress),
                gas : gasPrice + 1000,
                data : TokenContract.methods.approve(contractAddress, '9999995999999999999999999').encodeABI()
            };
            let signPromise = web3.eth.accounts.signTransaction(transaction, privateKey);
            console.log(signPromise);
            signPromise.then((signedTx) => {
                console.log(signedTx);
                const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
                sentTx.on("receipt", receipt => {
                    console.log(receipt);
                    resolve(true);
                });
                sentTx.on('transactionHash', function (hash) {
                    console.log("hash =", hash);
                });
                sentTx.on("error", err => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    });
}

function depositSecurity(username, privateKey, address) {
    return new Promise(function (resolve, reject) {
        alert("Depositing Security = "+ DaiToBeSent + "Dai");
        contract.methods.splitKey(username).estimateGas({from : address}).then(function (gasPrice) {
            let transaction = {
                from : web3.utils.toChecksumAddress(address),
                to :  web3.utils.toChecksumAddress(contractAddress),
                gas : gasPrice + 1000,
                data : contract.methods.splitKey(username).encodeABI()
            };
            let signPromise = web3.eth.accounts.signTransaction(transaction, privateKey);
            console.log(signPromise);
            signPromise.then((signedTx) => {
                console.log(signedTx);
                const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
                sentTx.on("receipt", receipt => {
                    console.log(receipt);
                    alert("Transaction Mined");
                    resolve(true);
                });
                sentTx.on('transactionHash', function (hash) {
                    alert("Transaction Mining");
                    console.log("hash =", hash);
                });
                sentTx.on("error", err => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });

    });
}

function privateKeyRegeneratedTransaction(privateKey, address, username, user1, user2){
    return new Promise(function (resolve, reject) {
        alert("Using Private Key to gather security deposit");
        contract.methods.privateKeyRegenerated(user1, user2, username).estimateGas({from : address}).then(function (gasPrice) {
            let transaction = {
                from : web3.utils.toChecksumAddress(address),
                to :  web3.utils.toChecksumAddress(contractAddress),
                gas : gasPrice + 1000,
                data : contract.methods.privateKeyRegenerated(user1, user2, username).encodeABI()
            };
            let signPromise = web3.eth.accounts.signTransaction(transaction, privateKey);
            console.log(signPromise);
            signPromise.then((signedTx) => {
                console.log(signedTx);
                const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
                sentTx.on("receipt", receipt => {
                    console.log(receipt);
                    alert("Transaction Mined check At https://kovan.etherscan.io/tx/" + receipt.transactionHash);
                    resolve(true);
                });
                sentTx.on('transactionHash', function (hash) {
                    alert("Transaction Mining check At https://kovan.etherscan.io/tx/" + hash);
                    console.log("hash =", hash);
                });
                sentTx.on("error", err => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });

    });
}

function releaseFunds(username, user1, user2, privateKey) {
    let account = web3.eth.accounts.privateKeyToAccount(privateKey);
    let address = account.address;
    privateKeyRegeneratedTransaction(privateKey, address, username, user1, user2);
}

function splitKey(privateKey, username) {
    return new Promise(function (resolve, reject) {
        let account = web3.eth.accounts.privateKeyToAccount(privateKey);
        let address = account.address;
        getDaiBalance(address)
            .then(function (balance) {
                if(balance >= DaiToBeSent){
                    checkApproval(address)
                        .then(function (approved) {
                            if(approved){
                                depositSecurity(username, privateKey, address).then(function () {
                                    resolve(true);
                                });
                            }else{
                                getApproved(privateKey, address).then(function () {
                                    depositSecurity(username, privateKey, address).then(function () {
                                        resolve(true);
                                    });
                                });
                            }
                        })
                }else{
                    alert("Insufficient Dai Balance in Your Account");
                }
            });
    });

}