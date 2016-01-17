Template.Admin.helpers({
  'userIsAdmin': function () {
    return true;
    //return Meteor.settings.public.admins.indexOf(Meteor.userId()) > -1;
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
    var id = this.owner;
    Meteor.call('deleteUser', id);
  }
});

