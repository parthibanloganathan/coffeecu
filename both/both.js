SearchCollectionsToPopulateProfile = function (id) {
  // Check rejected first
  var person = RejectedPeopleCollection.findOne({owner: id});

  if (person) {
    return person;
  } else {
    // then check pending
    person = PendingPeopleCollection.findOne({owner: id});
  }

  if (person) {
    return person;
  } else {
    // finally check master
    person = PeopleCollection.findOne({owner: id});
  }
  return person;
};

// User submits profile update -> inserted into PendingPeopleCollection
// If approved, -> moved from PendingPeopleCollection to PeopleCollection
// If rejected, -> moved from PendingPeopleCollection to RejectedPeopleCollection
// RejectedPeopleCollection is used to store last sent profile update request info
// so user doesn't have to fill from scratch again.
PeopleCollection = new Mongo.Collection('people-master');
PendingPeopleCollection = new Mongo.Collection('people-pending');
RejectedPeopleCollection = new Mongo.Collection('people-rejected');

UniCollection = new Mongo.Collection('uni');
MeetingsCollection = new Mongo.Collection('meetings');

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

MeetingsCollection.deny({
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
