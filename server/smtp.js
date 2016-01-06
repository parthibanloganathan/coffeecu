Meteor.startup(function(){
  var username = Meteor.settings.private.sendgrid.username;
  var password = Meteor.settings.private.sendgrid.password;
  process.env.MAIL_URL = 'smtp://' + username + ':' + password + '@smtp.sendgrid.net:587';
});