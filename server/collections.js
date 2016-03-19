UniCollection = new Mongo.Collection('uni');
MeetingsCollection = new Mongo.Collection('meetings');
BlacklistCollection = new Mongo.Collection('blacklist');

Meteor.publish("people-master", function () {
  // Share username only if admin
  if (IsAdmin(this.userId)) {
    return PeopleCollection.find();
  } else {
    return PeopleCollection.find({}, {fields: {username: 'default'}});
  }
});

Meteor.publish("people-pending", function () {
  // Share pending people only if admin
  if (IsAdmin(this.userId)) {
    return PendingPeopleCollection.find();
  } else {
    throw new Meteor.Error("not-authorized");
  }
});

Meteor.publish("people-rejected", function () {
  // Share pending people only if admin
  if (IsAdmin(this.userId)) {
    return RejectedPeopleCollection.find();
  } else {
    throw new Meteor.Error("not-authorized");
  }
});
