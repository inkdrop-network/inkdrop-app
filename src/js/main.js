App = {
  web3Provider: null,
  contracts: {},
  watchEvents: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    console.log('Init Web3');
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      // App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      // web3 = new Web3(App.web3Provider);
      alert('You must have MetaMask installed');
    }
    return App.initContract();
  },

  initContract: function() {
    console.log('Init Contract');
    $.getJSON('Linked.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var LinkedArtifact = data;
      App.contracts.Linked = TruffleContract(LinkedArtifact);

      // Set the provider for our contract.
      App.contracts.Linked.setProvider(App.web3Provider);

      // Use our contract to init profile, messages, follows.
      App.initMyProfile();
      App.initMessages();
      App.watchMsgEvents();
    });

    return App.bindEvents();
  },

  initMyProfile: function () {
    console.log('Init MyProfile');

    var LinkedInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Linked.deployed().then(function(instance) {
        LinkedInstance = instance;

        return LinkedInstance.userInfo(account);
      }).then(function(result) {
        var profileContent = '';
        var myName = web3.toUtf8(result[0]);
        var myOccupation = web3.toUtf8(result[1]);
        var myBio = result[2];
        var myDrops = result[3];
        profileContent += `
            Name: <span id="my-name">${myName}</span> <br/>
            Occupation: <span id="my-occupation">${myOccupation}</span> <br/>
            Bio: <span id="my-bio">${myBio}</span> <br/>
            Drops: <span id="my-drops">${myDrops}</span> <br/>
            <button id="set-profile-button" class="align-center">Set Profile</button>`;
        $('#profile-content').html(profileContent);
      }).catch(function(err) {
        console.log(err.message);
      });
    });

  },

  bindEvents: function() {
    $(document).on('click', '#set-profile-button', App.setProfile);
    $(document).on('click', '#save-profile-button', App.saveSetProfile);
    $(document).on('click', '#cancel-profile-button', App.cancelSetProfile);
    $(document).on('click', '#write-message-button', App.sendMessage);
    $(document).on('click', '.like-message-button', App.likeMessage);
    $(document).on('click', '.drop-message-button', App.dropMessage);
  },

  setProfile: function() {
    console.log('Click setProfile');
    var profileContent = `Name: <input type="text" id="set-profile-name" placeholder="Type your name..."/> <br/><br/>
        Occupation: <input type="text" id="set-profile-occupation" placeholder="Type your occupation..."/> <br/><br/>
        Bio: <input type="text" id="set-profile-bio" placeholder="Type your bio..."/> <br/><br/>
        <button id="save-profile-button">Save Changes</button>
        <button id="cancel-profile-button">Cancel Changes</button>`;

    $('#profile-content').html(profileContent);
  },

  saveSetProfile: function() {
    console.log('Click saveSetProfile');
    var myName = $('#set-profile-name').val();
    var myOccupation = $('#set-profile-occupation').val();
    var myBio = $('#set-profile-bio').val();

    var LinkedInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Linked.deployed().then(function(instance) {
        var myName = $('#set-profile-name').val();
        var myOccupation = $('#set-profile-occupation').val();
        var myBio = $('#set-profile-bio').val();

        LinkedInstance = instance;

        return LinkedInstance.setProfile(myName, myOccupation, myBio);
      }).then(function(result) {
        App.initMyProfile();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  cancelSetProfile: function() {
    console.log('Click cancelSetProfile');

    App.initMyProfile();
  },

  initMessages: function() {
    console.log('Init Messages');
    var LinkedInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Linked.deployed().then(function(instance) {
        LinkedInstance = instance;
        return LinkedInstance.msgCount.call();
      }).then(function(result) {
        // var length = result.c[0];
        var length = parseInt(result.toNumber(), 10);
        // create promise array for looping through it
        var promiseChain = [];
        for(var i = 0; i < length; i++) {
          promiseChain.push(LinkedInstance.getMessage(i));
        }

        Promise.all(promiseChain).then(function(result) {
          // result as an array of all callbacks from the getMessage function calls in the promise chain
          // sort the result array descending
          var sortedRes = result.sort(function(a, b){ return a[2] - b[2] });
          var sectionContent = '';
          for(var i = 0; i < sortedRes.length; i++) {
            // get the styled html for message
            sectionContent += App.formatMessage(web3.toAscii(sortedRes[i][1]), sortedRes[i][0], sortedRes[i][2], i, sortedRes[i][3], sortedRes[i][4], 0);
          }
          $('#messages').html(sectionContent);
        }).catch(function(err) {
            console.log(err.message);
        });

      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  sendMessage: function() {
    console.log('Click sendMessage');
    var LinkedInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Linked.deployed().then(function(instance) {
        LinkedInstance = instance;
        var msg = $('#write-message').val();
        return LinkedInstance.writeMessage(msg);
      }).then(function(result) {
        $('#write-message').val('');
        App.watchEvents = true;
        // App.initMessages();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  watchMsgEvents: function() {
    var LinkedInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Linked.deployed().then(function(instance) {
        LinkedInstance = instance;
        var event = instance.MessageSend();

        event.watch(function(error, result) {
          // console.log('Event catched: ' + App.watchEvents);
          var msgId = result.args.msgCount;
          if (App.watchEvents && result.args.writtenBy == account) {

            App.contracts.Linked.deployed().then(function(instance) {
              LinkedInstance = instance;
              return LinkedInstance.getMessage(result.args.msgCount);
            }).then(function(result) {
              var sectionContent = `<div class="message-box">
              <div>${web3.toAscii(result[1])} says:</div>
              <div>${result[0]}</div>
              <div>${moment.unix(result[2]).fromNow()}</div>
              <div class="message-likes" data-value="${result[3]}"">Likes: ${result[3]}</div>
              <button class="like-message-button" data-value="${msgId}">Like</button>
              <div class="message-drops" data-value="${result[4]}"">Drops: ${result[4]}</div>
              <button class="drop-message-button" data-value="${msgId}">Drop</button>
              </div>`;
              $('#messages').prepend(sectionContent);
              
            }).catch(function(err) {
              console.log(err.message);
            });
          }
        });
        
      });
    });

  },

likeMessage: function() {
  var msgId = $(this).attr('data-value');
  var likeDiv = $(this).siblings('.message-likes');
  var likeCount = $(this).siblings('.message-likes').attr('data-value');
  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }

    var account = accounts[0];

    App.contracts.Linked.deployed().then(function(instance) {
      LinkedInstance = instance;
      return LinkedInstance.likeMessage(msgId);
    }).then(function(result) {
      // App.initMessages(); 
      likeCount++;
      likeDiv.text('Likes: ' + likeCount);
      likeDiv.attr('data-value', likeCount);
    }).catch(function(err) {
      console.log(err.message);
    });
  });
},

dropMessage: function() {
  var msgId = $(this).attr('data-value');
  var likeDiv = $(this).siblings('.message-drops');
  var likeCount = $(this).siblings('.message-drops').attr('data-value');
  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }

    var account = accounts[0];

    App.contracts.Linked.deployed().then(function(instance) {
      LinkedInstance = instance;
      return LinkedInstance.dropMessage(msgId, 1);
    }).then(function(result) {
      likeCount++;
      likeDiv.text('Drops: ' + likeCount);
      likeDiv.attr('data-value', likeCount);
      App.initMyProfile(); 
    }).catch(function(err) {
      console.log(err.message);
    });
  });
},

formatMessage: function(username, content, time, msgId, likes, drops, comments) {
  var sectionContent = `<div class="card message-card mb-4">
                        <div class="card-body d-flex flex-row pb-2">
                            <img class="mr-2 profile-img" src="http://via.placeholder.com/50/85bd3e/85bd3e">
                            <div>
                                <strong class="align-top d-block card-username">c/${username}</strong>
                                <span class="card-message-time">${moment.unix(time).fromNow()}</span>
                            </div>
                        </div>
                        <div class="card-body py-2">
                            ${content}
                        </div>
                        <div class="card-body pt-2">
                            <div class="row">
                                <div class="col">
                                    <div class="drop-message-button float-left" data-value="${msgId}">
                                        <img src="icons/inkdrop_logo.svg" width="20" height="20" class="" alt="">
                                        <span class="icon-number">${drops}</span>
                                    </div>
                                </div>
                                <div class="col text-center">
                                    <div class="like-message-button" data-value="${msgId}">
                                        <img src="icons/like.svg" width="20" height="20" class="" alt="">
                                        <span class="icon-number">${likes}</span>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="comment-message-button float-right" data-value="${msgId}">
                                        <img src="icons/comment.svg" width="20" height="20" class="" alt="">
                                        <span class="icon-number">${comments}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;

  return sectionContent;
}

};

$(document).ready(function() {
  App.init();
});