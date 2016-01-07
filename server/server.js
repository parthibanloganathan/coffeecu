Meteor.publish('people-master', function () {
  return PeopleCollection.find();
});

Meteor.publish('people-pending', function () {
  return PendingPeopleCollection.find();
});

Meteor.methods({
  processSendRequest: function (senderUni, receiverUni, receiverName) {
    console.log("Got this far");

    if (senderUni !== null) {
      // Check UNI cache first
      var uni_details = UniCollection.find( {uni: senderUni} ).fetch();

      if (uni_details.length > 0) {
        senderName = uni_details[0].name;
        
        this.unblock();
        SendEmailToUni(senderUni, senderName, receiverUni, receiverName);        
      } else {
        if (VerifyUni(senderUni)) {
          this.unblock();

          var senderName = GetFirstName(senderUni);
          UniCollection.insert({uni: senderUni, name: senderName});   

          SendEmailToUni(senderUni, senderName, receiverUni, receiverName);
        } else {
          console.log("Failed to send email");
        }
      }
    }
  }
});

var SendEmailToUni = function (senderUni, senderName, receiverUni, receiverName) {
  var to = receiverUni + '@columbia.edu';
  var cc = senderUni + '@columbia.edu';
  var from = 'do-not-reply@teaatcolumbia.com';
  var subject = 'Tea at Columbia: Meeting Request';
  var body = "Hi " + receiverName + ",\n\n" + 
    senderName + "(cc'ed) would like to grab coffee or tea with you. Please respond to them if you have the time to chat. Hope both of you have fun!\n\n" + 
    "Note that if you would like to stop receiving these coffee requests, please delete your account at teaatcolumbia.info or contact Parthi at pl2487@columbia.edu.";

  SendEmail(to, cc, from, subject, body);
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
