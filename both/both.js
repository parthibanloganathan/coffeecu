// Utility
SearchPeopleCollections = function (query) {
  var people = PendingPeopleCollection.find(query).fetch();

  if (people.length > 0) {
    return people;
  } else {
    return PeopleCollection.find(query).fetch();
  }
};

PeopleCollection = new Mongo.Collection('people-master');
PendingPeopleCollection = new Mongo.Collection('people-pending');
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

Meteor.methods({
  insertUser: function (id,
                        username,
                        name,
                        uni,
                        school,
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
                       },
                       copyUserToMaster: function (id) {
                         var userToMove = PendingPeopleCollection.findOne({owner: id});
                         PeopleCollection.insert(userToMove);
                         PendingPeopleCollection.remove({owner: id});
                       },
                       deleteUser: function (id) {
                         if (!Meteor.userId()) {
                           throw new Meteor.Error('not-authorized');
                         }

                         PeopleCollection.remove({owner: id});
                         PendingPeopleCollection.remove({owner: id});
                       }
});
