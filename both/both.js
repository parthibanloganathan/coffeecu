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

Meteor.methods({
  insertPendingUser: function (id,
                               username,
                               name,
                               uni,
                               school,
                               year,
                               major,
                               about,
                               likes,
                               contactfor,
                               availability,
                               twitter,
                               facebook,
                               linkedin,
                               image
                              ) {
                                if (!Meteor.userId()) {
                                  throw new Meteor.Error('not-authorized');
                                }

                                PendingPeopleCollection.update(
                                  {owner: id},
                                  {$set: {
                                    owner: id, 
                                    username: username,        
                                    name: name,
                                    uni: uni,
                                    school: school,
                                    year: year,
                                    major: major,
                                    about: about,
                                    likes: likes,
                                    contactfor: contactfor,
                                    availability: availability,
                                    twitter: twitter,
                                    facebook: facebook,
                                    linkedin: linkedin,
                                    image: image,
                                  }},
                                  {upsert: true});
                                  RejectedPeopleCollection.remove({owner: id});
                              },
                              moveUserToMaster: function (id) {
                                var userToMove = PendingPeopleCollection.findOne({owner: id});
                                PeopleCollection.update({owner: id}, 
                                                        {$set: {
                                                          owner: id, 
                                                          username: userToMove.username,        
                                                          name: userToMove.name,
                                                          uni: userToMove.uni,
                                                          school: userToMove.school,
                                                          year: userToMove.year,
                                                          major: userToMove.major,
                                                          about: userToMove.about,
                                                          likes: userToMove.likes,
                                                          contactfor: userToMove.contactfor,
                                                          availability: userToMove.availability,
                                                          twitter: userToMove.twitter,
                                                          facebook: userToMove.facebook,
                                                          linkedin: userToMove.linkedin,
                                                          image: userToMove.image,
                                                        }},
                                                        {upsert: true});
                                                        PendingPeopleCollection.remove({owner: id});
                                                        RejectedPeopleCollection.remove({owner: id});
                              },
                              deleteUser: function (id) {
                                if (!Meteor.userId()) {
                                  throw new Meteor.Error('not-authorized');
                                }
                                PeopleCollection.remove({owner: id});
                                PendingPeopleCollection.remove({owner: id});
                                RejectedPeopleCollection.remove({owner: id});                         
                              }
});
