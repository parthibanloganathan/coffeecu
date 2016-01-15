Template.header.rendered = function () {
  $('.menu .item')
  .state();
};

Template.logout.events({
  'click .logout': function () {
    AccountsTemplates.logout();
    Router.go("/");
  }
});

Template.userprofile.helpers({
  'id': function () {
    return Meteor.userId();
  }
});

