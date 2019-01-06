const mongodb = require("mongodb").MongoClient;
const pkHolderCollection = "webusers";
const androidCollection = "androidusers";
const pendingMessagesCollection = "pending";
const url =
  "mongodb://arvind123:arvind123@ds145574.mlab.com:45574/splitmeup-v2";
const DbName = "splitmeup-v2";

module.exports = {
  connect: function() {
    let self = this;
    return new Promise(function(resolve, reject) {
      mongodb.connect(
        url,
        function(err, database) {
          if (err) reject(err);
          else {
            self.obj = database.db(DbName);
            self.obj.collection(androidCollection).count(function(err, count) {
              if (err) throw err;
              if (count >= 1) {
                console.log("inside if *mongo.js*");
                self.currentIndex = count - 1;
                resolve(true);
              } else {
                console.log("inside else *mongo.js*");
                self.currentIndex = -1;
                resolve(true);
              }
            });
          }
        }
      );
    });
  },

  addAndroidUser: function(username, password, publicKey) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let objtoadd = {
        username: username,
        password: password,
        publicKey: publicKey,
        index: self.currentIndex + 1
      };
      self.obj
        .collection(androidCollection)
        .insertOne(objtoadd, function(err, result) {
          if (err) reject(err);
          else {
            self.currentIndex = self.currentIndex + 1;
            resolve(true);
          }
        });
    });
  },

  checkAndroidUser: function(username) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.obj.collection(androidCollection).findOne(
        {
          username: username
        },
        function(err, result) {
          if (err) reject(err);
          else {
            if (result == null) {
              resolve(false);
            } else {
              resolve(true);
            }
          }
        }
      );
    });
  },
  //adding async here to wrap the return value into a promise
  getNumberOfAndroidUsers: async function() {
    return this.currentIndex + 1;
  },

  getAndroidUserDetailsForEncryption: function(index) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.obj.collection(androidCollection).findOne(
        {
          index: index
        },
        function(err, result) {
          if (err) reject(err);
          else {
            let retVal = {
              username: result.username,
              publicKey: result.publicKey
            };
            resolve(retVal);
          }
        }
      );
    });
  },

  addPrivateKeyUser: function(username, noOfUsers) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.obj.collection(pkHolderCollection).insertOne(
        {
          username: username,
          number: noOfUsers
        },
        function(err, result) {
          if (err) throw err;
          resolve(result);
        }
      );
    });
  },

  getPrivateKeyUserDetail: function(username) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.obj.collection(pkHolderCollection).findOne(
        {
          username: username
        },
        function(err, result) {
          if (err) throw err;
          resolve(result.value);
        }
      );
    });
  },

  addToPendingMessages: function(username, message) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.obj.collection(pendingMessagesCollection).findOne(
        {
          username: username
        },
        function(err, result) {
          if (result) {
            self.obj
              .collection(pendingMessagesCollection)
              .updateOne(
                { username: username },
                { $push: { message: message } }
              );
          } else {
            let objectToBeAdded = {
              username: username,
              message: [message]
            };
            self.obj
              .collection(pendingMessagesCollection)
              .insertOne(objectToBeAdded, function(err, result) {
                resolve();
              });
          }
        }
      );
    });
  },

  getPendingMessages: function(username) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.obj.collection(pendingMessagesCollection).findOneAndDelete(
        {
          username: username
        },
        function(err, result) {
          if (result) {
            if (result.value === null) {
              resolve([]);
            } else {
              resolve(result.value.message);
            }
          } else {
            resolve([]);
          }
        }
      );
    });
  }
};

// module.exports.connect().then(function () {
//    module.exports.getPendingMessages("arvind").then(function (arr) {
//        console.log(arr);
//    });
//  module.exports.addToPendingMessages("arvind", "hey3");
//  module.exports.getAndroidUserDetailsForEncryption(0).then(function (rs) {
//      console.log(rs);
//  })
// });
