Tracker.autorun(function () {
  Meteor.subscribe('people-rejected');
});

Session.set('isAdmin', false);

Template.Admin.rendered = function () {
  Meteor.call('isAdmin', function (error, response) {
    Session.set('isAdmin', response);
  });
};

Template.Admin.helpers({
  'userIsAdmin': function () {
    return Session.get('isAdmin');
  }
});

Template.displayPendingPeople.helpers({
  'people': function () {
    return PendingPeopleCollection.find().fetch();
  }
});

Template.displayPendingPeople.events({
  'submit form': function (event) {
    event.preventDefault();

    var id = this.owner;
    var reason = event.target.reason.value;
   
    Meteor.call('rejectPendingUser', id, reason);
  },
  'click #accept': function () {
    event.preventDefault();

    var id = this.owner;
    Meteor.call('moveUserToMaster', id);
  }
});

Template.displayPeople.helpers({
  'people': function () {
    return PeopleCollection.find().fetch();
  }
});

Template.displayPeople.events({
  'click #delete': function () {
    Meteor.call('deleteUser', Meteor.userId());
  }
});

