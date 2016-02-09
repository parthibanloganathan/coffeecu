Meteor.methods({
  isAdmin: function () {
    return IsAdmin(Meteor.userId());
  },
  countMeetings: function () {
    return MeetingsCollection.find().fetch().length;
  },
  processSendRequest: function (senderUni, receiver, receiverUni, receiverName) {
    if(MeetingsCollection.find({ sender_uni: senderUni, receiver_uni: receiverUni }).fetch().length > 0) {
      return "You've already sent a coffee request to " + receiverName;
    }

    var receiverEmail = PeopleCollection.findOne({ owner: receiver }).username;

    if (senderUni !== null) {
      // Check UNI cache first
      var uni_details = UniCollection.find({ uni: senderUni }).fetch();

      // If in cache, use that first
      if (uni_details.length > 0) {
        senderName = uni_details[0].name;

        this.unblock();
        SendEmailForCoffee(senderUni, senderName, receiverUni, receiverEmail, receiverName);
      } else { // else, call API to check validity of UNI
        if (VerifyUni(senderUni)) {
          this.unblock();

          var senderName = GetFirstName(senderUni);
          UniCollection.insert({uni: senderUni, name: senderName});   

          SendEmailForCoffee(senderUni, senderName, receiverUni, receiverEmail, receiverName);
        } else {
          return "Invalid UNI";
        }
      }
      return "Email sent to " + receiverName;
    }
  },
  rejectPendingUser: function (id, reason) {
    // Only admin can reject a user
    if (!IsAdmin(Meteor.userId())) {
      return;
    }

    // Move to rejected users
    var userToMove = PendingPeopleCollection.findOne({owner: id});
    RejectedPeopleCollection.update({owner: id}, 
                                    {$set: {
                                      owner: id, 
                                      username: userToMove.username,        
                                      name: userToMove.name,
                                      uni: userToMove.uni,
                                      school: userToMove.school,
                                      year: userToMove.year,
                                      major: userToMove.major,
                                      about: userToMove.about,
                                      likes: userToMove.likes,
                                      contactfor: userToMove.contactfor,
                                      availability: userToMove.availability,
                                      twitter: userToMove.twitter,
                                      facebook: userToMove.facebook,
                                      linkedin: userToMove.linkedin,
                                      image: userToMove.image,
                                    }},
                                    {upsert: true});
                                    PendingPeopleCollection.remove({ owner: id });

                                    // Send email
                                    var to = Meteor.users.findOne({ '_id': id }).emails[0].address;
                                    var from = 'do-not-reply@coffeecu.com';
                                    var subject = 'Coffee at Columbia: Profile update declined';
                                    var body = "Hi,\n\n" + 
                                      "Your recent profile update request to Coffee at Columbia was rejected.\n\nWhy was it declined: " + reason + "\n\nPlease make the above changes and request an update to your profile again. " + 
                                      "If you have any questions, please contact Parthi at parthiban.loganathan@columbia.edu.\n\nThank you!";
                                    SendEmail(to, "", from, subject, body); 
  },
  insertPendingUser: function (id,
                               username,
                               name,
                               uni,
                               school,
                               year,
                               major,
                               about,
                               likes,
                               contactfor,
                               availability,
                               twitter,
                               facebook,
                               linkedin,
                               image
                              ) {
                                if (!Meteor.userId()) {
                                  throw new Meteor.Error('not-authorized');
                                }

                                PendingPeopleCollection.update(
                                  {owner: id},
                                  {$set: {
                                    owner: id, 
                                    username: username,        
                                    name: name,
                                    uni: uni,
                                    school: school,
                                    year: year,
                                    major: major,
                                    about: about,
                                    likes: likes,
                                    contactfor: contactfor,
                                    availability: availability,
                                    twitter: twitter,
                                    facebook: facebook,
                                    linkedin: linkedin,
                                    image: image,
                                  }},
                                  {upsert: true});
                                  RejectedPeopleCollection.remove({ owner: id });
                              },
                              moveUserToMaster: function (id) {
                                // Only admin can move user to master
                                if (!IsAdmin(Meteor.userId())) {
                                  return;
                                }
                                var userToMove = PendingPeopleCollection.findOne({owner: id});
                                PeopleCollection.update({ owner: id }, 
                                                        {$set: {
                                                          owner: id, 
                                                          username: userToMove.username,        
                                                          name: userToMove.name,
                                                          uni: userToMove.uni,
                                                          school: userToMove.school,
                                                          year: userToMove.year,
                                                          major: userToMove.major,
                                                          about: userToMove.about,
                                                          likes: userToMove.likes,
                                                          contactfor: userToMove.contactfor,
                                                          availability: userToMove.availability,
                                                          twitter: userToMove.twitter,
                                                          facebook: userToMove.facebook,
                                                          linkedin: userToMove.linkedin,
                                                          image: userToMove.image,
                                                        }},
                                                        {upsert: true});
                                                        PendingPeopleCollection.remove({owner: id});
                                                        RejectedPeopleCollection.remove({owner: id});
                              },
                              deleteUser: function (id) {
                                if (!IsAdmin(Meteor.userId()) && id != Meteor.userId()) {
                                  throw new Meteor.Error('not-authorized');
                                }
                                PeopleCollection.remove({ owner: id });
                                PendingPeopleCollection.remove({ owner: id });
                                RejectedPeopleCollection.remove({ owner: id });                         
                              }
});

var SendEmailForCoffee = function (senderUni, senderName, receiverUni, receiverEmail, receiverName) {
  var to = receiverEmail;
  var cc = senderUni + '@columbia.edu';
  var from = 'do-not-reply@coffeecu.com';
  var subject = 'Coffee at Columbia: Request from ' + senderName;
  var body = "Hi " + receiverName + ",\n\n" + 
    senderName + " (cc'ed) would like to meet you. Please respond to them if you have the time to chat. May we suggest meeting at Joe's in NoCo, Brad's in the Journalism building, Brownie's Cafe in Avery, Carleton Lounge in Mudd or Cafe East in Lerner. Hope you have a great time talking!\n\n" + 
    "Note that if you would like to stop receiving these coffee requests, please delete your account at coffeecu.com or contact parthiban.loganathan@columbia.edu.";

  SendEmail(to, cc, from, subject, body);

  LogMeeting(senderUni, receiverUni);
};

var VerifyUni = function (uni) {
  var convertAsyncToSync  = Meteor.wrapAsync(HTTP.get),
    resultOfAsyncToSync = convertAsyncToSync('http://uniatcu.herokuapp.com/exists?uni=' + uni, {});
  console.log(resultOfAsyncToSync);
  if(resultOfAsyncToSync.data.exists == 'true') {
    return true;
  } else {
    return false;
  }
};

var SendEmail = function (to, cc, from, subject, body) {
  check([to, cc, from, subject, body], [String]);

  Meteor.Mailgun.send({
    to: to,
    cc: cc,
    from: from,
    subject: subject,
    text: body
  });
};

var GetFirstName = function (uni) {
  var convertAsyncToSync  = Meteor.wrapAsync(HTTP.get),
    resultOfAsyncToSync = convertAsyncToSync('http://uniatcu.herokuapp.com/info?uni=' + uni, {});
  var firstname = resultOfAsyncToSync.data.data.name.split(' ')[0];
  return firstname;
};

var LogMeeting = function(senderUni, receiverUni) {
  MeetingsCollection.insert({sender_uni: senderUni, receiver_uni: receiverUni});
};

IsAdmin = function(id) {
  return Meteor.settings.private.admins.indexOf(id) > -1;  
};
