App = {
  web3Provider: null,
  contracts: {},
  watchEvents: false,
  user: {},

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
      // Only for profile page init
      App.profilePage();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#set-profile-button', App.setProfile);
    $(document).on('click', '#save-profile-button', App.saveSetProfile);
    $(document).on('click', '#cancel-profile-button', App.cancelSetProfile);
    $(document).on('click', '#write-message-button', App.sendMessage);
    $(document).on('click', '.like-message-button', App.likeMessage);
    $(document).on('click', '.drop-message-button', App.dropMessage);
    $(document).on('click', '#follow-user-button', App.followUser);
    $(document).on('click', '#unfollow-user-button', App.unfollowUser);
    $("#write-message").focus(function(event){
      $("#post-message").css('opacity', '1');
    }).blur(function(event){
      $("#post-message").css('opacity', '0.5');
    });
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
        var myDrops = parseInt(result[3].toNumber(), 10);
        var myImgUrl = result[4];

        App.user = {
          username: myName,
          occupation: myOccupation,
          bio: myBio,
          drops: myDrops,
          picture: myImgUrl
        };
        
        App.updateProfile();
      }).catch(function(err) {
        console.log(err.message);
      });
    });

  },

  setProfile: function(e) {
    // stop dropdown close on click
    e.stopPropagation();
    $('#profile-username').html('<input type="text" id="set-profile-name" placeholder="Type your name..."/>');
    $('#profile-occupation').html('<input type="text" id="set-profile-occupation" placeholder="Type your occupation..."/>');
    $('#profile-bio').html('<input type="text" id="set-profile-bio" placeholder="Type your bio..."/>');
    $('#profile-drop-number').html(App.user.drops);
    $('#profile-buttons').html(`<button id="save-profile-button" class="btn btn-green btn-sm mx-2">Save</button>
                          <button id="cancel-profile-button" class="btn btn-outline-danger btn-sm mx-2 float-right">Cancel</button>`);
  },

  updateProfile: function() {
    console.log('Update profile: ' + App.user.drops);
    var imgUrl = App.user.picture;
    if(imgUrl == "") {
      imgUrl = "http://via.placeholder.com/50/85bd3e/85bd3e"
    }
    $('#profile-picture').attr("src", imgUrl);
    $('#profile-username').html("c/" + App.user.username);
    $('#post-message-username').html("c/" + App.user.username);
    $('#post-message-profile-picture').attr("src", imgUrl);
    $('#profile-occupation').html(App.user.occupation);
    $('#profile-bio').html(App.user.bio);
    // TODO: fix update drop number issue
    $('#profile-drop-number').html(App.user.drops);
    $('#profile-buttons').html(`<button id="set-profile-button" class="btn btn-green btn-sm mx-2">Change</button>
      <button id="close-profile-button" class="btn btn-outline-secondary btn-sm mx-2 float-right">close</button>`);
  },

  saveSetProfile: function(e) {
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
        var randInt = Math.floor(Math.random()*90);
        var imgUrlM = "https://randomuser.me/api/portraits/men/" + randInt + ".jpg"
        var imgUrlW = "https://randomuser.me/api/portraits/women/" + randInt + ".jpg"
        var myImgUrl = imgUrlM;
        if(myName == "Red Cross") {
          myImgUrl = "https://upload.wikimedia.org/wikipedia/commons/0/07/Redcross.png";
        }

        LinkedInstance = instance;

        return LinkedInstance.setProfile(myName, myOccupation, myBio, myImgUrl);
      }).then(function(result) {
        App.updateProfile();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  cancelSetProfile: function(e) {
    console.log('Click cancelSetProfile');
    // stop dropdown close on click
    e.stopPropagation();
    App.updateProfile();
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
          var sortedRes = result.sort(function(a, b){ return parseInt(b[4]) - parseInt(a[4]) });
          var sectionContent = '';
          for(var i = 0; i < sortedRes.length; i++) {
            // get the styled html for message
            sectionContent += App.formatMessage(web3.toAscii(sortedRes[i][1]), sortedRes[i][0], sortedRes[i][2], i, sortedRes[i][3], sortedRes[i][4], 0, sortedRes[i][5], sortedRes[i][6]);
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
    // make card still og higher opacity
    $("#post-message").css('opacity', '1');
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
              var sectionContent = App.formatMessage(web3.toAscii(result[1]), result[0], result[2], msgId, result[3], result[4], 0, result[5], result[6]);
              $('#messages').append(sectionContent);
              $("#post-message").css('opacity', '0.5');
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
  var likeDiv = $(this).children('.like-number');
  var likeCount = $(this).children('.like-number').attr('data-value');
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
      likeDiv.text(likeCount);
      likeDiv.attr('data-value', likeCount);
    }).catch(function(err) {
      console.log(err.message);
    });
  });
},

dropMessage: function() {
  var msgId = $(this).attr('data-value');
  var likeDiv = $(this).children('.drop-number');
  var likeCount = $(this).children('.drop-number').attr('data-value');
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
      likeDiv.text(likeCount);
      likeDiv.attr('data-value', likeCount);
      // update drops also on profile page
      var newDrops = parseInt($('#profile-page-drops').text()) + 1;
      $('#profile-page-drops').html(newDrops);
      App.updateProfile(); 
    }).catch(function(err) {
      console.log(err.message);
    });
  });
},

formatMessage: function(username, content, time, msgId, likes, drops, comments, imgUrl, address) {
  var sectionContent = `<div class="card message-card mb-4">
                        <div class="card-body d-flex flex-row pb-2">
                            <img class="mr-2 profile-img" src="${imgUrl}">
                            <div>
                                <a href="/profile.html?address=${address}"><strong class="align-top d-block card-username">c/${username}</strong></a>
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
                                        <img src="icons/icon-inkdrop-dark.svg" width="20" height="20" class="" alt="">
                                        <span class="drop-number icon-number" data-value="${drops}">${drops}</span>
                                    </div>
                                </div>
                                <div class="col text-center">
                                    <div class="like-message-button mx-auto" data-value="${msgId}">
                                        <img src="icons/icon-like.svg" width="20" height="20" class="" alt="">
                                        <span class="like-number icon-number" data-value="${likes}">${likes}</span>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="comment-message-button float-right" data-value="${msgId}">
                                        <img src="icons/icon-comments.svg" width="20" height="20" class="" alt="">
                                        <span class="comment-number icon-number" data-value="${comments}">${comments}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;

  return sectionContent;
},

urlParam: function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
},

profilePage: function(address) {
  if(window.location.pathname != "/profile.html") {
    return;
  }
  var address = App.urlParam('address');
  console.log('Profile page address: ' + address);


  var LinkedInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Linked.deployed().then(function(instance) {
        LinkedInstance = instance;

        return LinkedInstance.userInfo(address);
      }).then(function(result) {
        var profileContent = '';
        var myName = web3.toUtf8(result[0]);
        var myOccupation = web3.toUtf8(result[1]);
        var myBio = result[2];
        var myDrops = parseInt(result[3].toNumber(), 10);
        var myImgUrl = result[4];
        var myFollowers = parseInt(result[5], 10);

        $('#profile-page-picture').attr("src", myImgUrl);
        $('#profile-page-username').html("c/" + myName);
        $('#profile-page-occupation').html(myOccupation);
        $('#profile-page-drops').html(myDrops);
        $('#profile-page-subs').html(myFollowers);

        LinkedInstance.getUserMessages(address).then(function(result) {
          var length = result.length;
          // create promise array for looping through it
          var promiseChain = [];
          for(var i = 0; i < length; i++) {
            promiseChain.push(LinkedInstance.getMessage(parseInt(result[i].toNumber(), 10)));
          }

          Promise.all(promiseChain).then(function(result) {
            // result as an array of all callbacks from the getMessage function calls in the promise chain
            // sort the result array descending
            var sortedRes = result.sort(function(a, b){ return parseInt(b[4]) - parseInt(a[4]) });
            var sectionContent = '';
            for(var i = 0; i < sortedRes.length; i++) {
              // get the styled html for message
              sectionContent += App.formatMessage(web3.toAscii(sortedRes[i][1]), sortedRes[i][0], sortedRes[i][2], i, sortedRes[i][3], sortedRes[i][4], 0, sortedRes[i][5], sortedRes[i][6]);
            }
            $('#profile-page-messages').html(sectionContent);
          });
        }).catch(function(err) {
          console.log(err.message);
        });
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  followUser: function() {
    console.log('Click follow User');
    if(window.location.pathname != "/profile.html") {
      return;
    }
    var address = App.urlParam('address');
    // make card still og higher opacity
    var LinkedInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Linked.deployed().then(function(instance) {
        LinkedInstance = instance;
        return LinkedInstance.followUser(address);
      }).then(function(result) {
        var newFollowers = parseInt($('#profile-page-subs').text()) + 1;
        $('#profile-page-subs').html(newFollowers)
        $('#follow-buttons').html(`<button id="unfollow-user-button" class="btn btn-green my-4 px-4 d-block">Unfollow</button>`);
        // App.initMessages();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  unfollowUser: function() {
    console.log('Click unfollow User');
    if(window.location.pathname != "/profile.html") {
      return;
    }
    var address = App.urlParam('address');
    // make card still og higher opacity
    var LinkedInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Linked.deployed().then(function(instance) {
        LinkedInstance = instance;
        return LinkedInstance.unfollowUser(address);
      }).then(function(result) {
        var newFollowers = parseInt($('#profile-page-subs').text()) + 1;
        $('#profile-page-subs').html(newFollowers)
        $('#follow-buttons').html(`<button id="follow-user-button" class="btn btn-green my-4 px-4 d-block">Follow</button>`);
        // App.initMessages();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(document).ready(function() {
  App.init();
});