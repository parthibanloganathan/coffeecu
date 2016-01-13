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

Template.displayPeople.helpers({
  'people': function () {
    return PeopleCollection.find().fetch();
  }
});

Template.displayPendingPeople.events({
  'click #reject': function () {
    var id = this.owner;
    Meteor.call('deleteUser', id);
  },
  'click #accept': function () {
    var id = this.owner;
    Meteor.call('copyUserToMaster', id);
  }
});
