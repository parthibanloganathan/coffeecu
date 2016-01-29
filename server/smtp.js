Meteor.startup(function(){
  var username = Meteor.settings.private.mailgun.username;
  var password = Meteor.settings.private.mailgun.password;

  Meteor.Mailgun.config({
    username: username,
    password: password
  });
});
