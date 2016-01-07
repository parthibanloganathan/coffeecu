Meteor.startup(function(){
  var username = Meteor.settings.private.sendgrid.username;
  var password = Meteor.settings.private.sendgrid.password;

  Meteor.Mailgun.config({
    username: username,
    password: password
  });
});
