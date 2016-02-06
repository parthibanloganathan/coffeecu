Meteor.publish('people-master', function () {
  return PeopleCollection.find();
});

Meteor.publish('people-pending', function () {
  return PendingPeopleCollection.find();
});

Meteor.methods({
  isAdmin: function () {
    return Meteor.settings.private.admins.indexOf(Meteor.userId()) > -1;    
  },
  countMeetings: function () {
    return MeetingsCollection.find().fetch().length;
  },
  processSendRequest: function (senderUni, receiverEmail, receiverUni, receiverName) {
    if (MeetingsCollection.find({sender_uni: senderUni, receiver_uni: receiverUni}).fetch().length > 0) {
      return "You've already sent a coffee request to " + receiverName;
    }

    if (senderUni !== null) {
      // Check UNI cache first
      var uni_details = UniCollection.find( {uni: senderUni} ).fetch();

      if (uni_details.length > 0) {
        senderName = uni_details[0].name;

        this.unblock();
        SendEmailForCoffee(senderUni, senderName, receiverUni, receiverEmail, receiverName);
      } else {
        if (VerifyUni(senderUni)) {
          this.unblock();

          var senderName = GetFirstName(senderUni);
          UniCollection.insert({uni: senderUni, name: senderName});   

          SendEmailForCoffee(senderUni, senderName, receiverUni, receiverEmail, receiverName);
        } else {
          return "Invalid UNI";
        }
      }
    }
  },
  rejectPendingUser: function (id, reason) {
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
                                    PendingPeopleCollection.remove({owner: id});

                                    // Send email
                                    var to = Meteor.users.findOne({'_id': id}).emails[0].address;
                                    var from = 'do-not-reply@coffeecu.com';
                                    var subject = 'Coffee at Columbia: Profile update declined';
                                    var body = "Hi,\n\n" + 
                                      "Your recent profile update request to Coffee at Columbia was rejected.\n\nWhy was it declined: " + reason + "\n\nPlease make the above changes and request an update to your profile again. " + 
                                      "If you have any questions, please contact Parthi at parthiban.loganathan@columbia.edu.\n\nThank you!";
                                    SendEmail(to, "", from, subject, body); 
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
  return resultOfAsyncToSync.data.exists;
};

var SendEmail = function (to, cc, from, subject, body) {
  check([to, cc, from, subject, body], [String]);

  console.log("Sending email");

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
