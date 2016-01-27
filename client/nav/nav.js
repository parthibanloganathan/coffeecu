Template.nav.rendered = function () {
  // For hamburger button when navbar is too narrow
  $(".button-collapse").sideNav();

  // To activate links
  $('.menu .item').state();
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

