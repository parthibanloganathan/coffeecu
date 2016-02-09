// User submits profile update -> inserted into PendingPeopleCollection
// If approved, -> moved from PendingPeopleCollection to PeopleCollection
// If rejected, -> moved from PendingPeopleCollection to RejectedPeopleCollection
// RejectedPeopleCollection is used to store last sent profile update request info
// so user doesn't have to fill from scratch again.
PeopleCollection = new Mongo.Collection('people-master');
PendingPeopleCollection = new Mongo.Collection('people-pending');
RejectedPeopleCollection = new Mongo.Collection('people-rejected');

Meteor.methods({
  searchCollectionsToPopulateProfile: function (id) {
    if (id != Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    // Check pending first
    var person = PendingPeopleCollection.findOne({owner: id});

    if (!person) {
      // then check rejected
      person = RejectedPeopleCollection.findOne({owner: id});
    }
    
    if (!person) {
      // finally check master
      person = PeopleCollection.findOne({owner: id});
    }
   
    return person;
  }
});

PeopleCollection.deny({
  update: function() {
    return true;
  },
  insert: function() {
    return true;
  },
  remove: function() {
    return true;
  }
});

PendingPeopleCollection.deny({
  update: function() {
    return true;
  },
  insert: function() {
    return true;
  },
  remove: function() {
    return true;
  }
});

RejectedPeopleCollection.deny({
  update: function() {
    return true;
  },
  insert: function() {
    return true;
  },
  remove: function() {
    return true;
  }
});

// Search box
PeopleIndex = new EasySearch.Index({
  collection: PeopleCollection,
  fields: ['name', 'school', 'major', 'contactfor', 'availability', 'likes'],
  engine: new EasySearch.MongoTextIndex(),
  name: 'peopleIndex'
});
