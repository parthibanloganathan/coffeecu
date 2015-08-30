// Client
if (Meteor.isClient) {
  // Load filepicker js library
  Session.set('filepicker', false);
  Meteor.startup( function () {
    $.getScript('//api.filepicker.io/v2/filepicker.js', function () {
      Session.set('filepicker', true);
    });
  });

  Meteor.subscribe('people');

  // Home

  Template.people.helpers({
    'people': function () {
      return PeopleCollection.find().fetch();
    },
    'personSelected': function () {
      return this._id == Session.get('personInFocus');
    }
  });

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  Template.userprofile.helpers({
    'id': function () {
      return Meteor.userId();
    }
  });

  Template.people.events({
    'click .person': function () {
      if (Session.get('personInFocus') != this._id) {
        Session.set('personInFocus', this._id);
      } else {
        Session.set('personInFocus', '');        
      }
    }
  });

  Template.main.helpers({
    'currentYear': function () {
      return new Date().getFullYear();
    }
  });

  // User
  Session.set('message', 'default');

  Template.profileupdate.helpers({
    'user': function () {
      var user = SearchPeopleCollection({owner: Meteor.userId()});      
      return user[0];
    },
    'set-availability': function () {
      Meteor.call('setAvailability', 
                  Meteor.userId(),
                  Meteor.user().username,        
                  monday_times,
                  tuesday_times,
                  wednesday_times,
                  thursday_times,
                  friday_times,
                  saturday_times,
                  sunday_times);
    }
  });

  Template.profileupdate.events({
    'submit form': function (event) {
      event.preventDefault();

      var name = event.target.name.value;
      var display_name = event.target.display_name.value;
      var school = event.target.school.value;
      var about = event.target.about.value;
      var uni = event.target.uni.value;
      var twitter = event.target.twitter.value;
      var facebook = event.target.facebook.value;
      var linkedin = event.target.linkedin.value;
      var image_url = event.target.image_url.src;
      console.log(image_url);
      if (Session.get('UploadedImageUrl')) {
        image_url = Session.get('UploadedImageUrl');
      }
      Session.set('UploadedImageUrl', '');      
      var availability_notes = event.target.availability_notes.value;

      Meteor.call('insertUser',
                  Meteor.userId(),
                  Meteor.user().username,
                  name,
                  display_name,
                  school,
                  about,
                  uni,
                  twitter,
                  facebook,
                  linkedin,
                  image_url,
                  availability_notes
                 );
      Session.set('message', 'Your profile is currently under review and will be posted once approved.');
    },
    'click #deleteprofile': function() {
      Meteor.call('deleteUser', Meteor.userId());
      Session.set('message', 'Your profile has successfully been deleted.');
    },
    'click #uploadphoto': function() {
      openFilePicker();
    }
  });

  Template.message.helpers({
    'message': function () {
      return Session.get('message');
    }
  });

  // Admin

  Template.Admin.helpers({
    'userIsAdmin': function () {
      return Meteor.settings.public.admins.indexOf(Meteor.userId()) > -1;
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
}

// Common

// Utility
var SearchPeopleCollection = function (query) {
  var people_master = PeopleCollection.find(query).fetch();

  if (people_master.length > 0) {
    return people_master;
  } else {
    return PendingPeopleCollection.find(query).fetch();
  }
};

//Router
Router.configure({
  layoutTemplate: 'main'
});

Router.route('/', function () {
  this.render('Home');
});

Router.route('/user/:userid', function () {
  this.render('User', {
    data: function () {
      return SearchPeopleCollection({ owner: this.params.userid })[0];
    }
  })
});

Router.route('/admin', function () {
  this.render('Admin');
});

PeopleCollection = new Mongo.Collection('people-master');
PendingPeopleCollection = new Mongo.Collection('people-pending');
AvailabilityCollection = new Mongo.Collection('availability');

Meteor.methods({
  insertUser: function (id,
                        username,
                        name,
                        display_name,
                        school,
                        about,
                        uni,
                        twitter,
                        facebook,
                        linkedin,
                        image_url,
                        availability_notes) {
                          if (!Meteor.userId()) {
                            throw new Meteor.Error('not-authorized');
                          }

                          PendingPeopleCollection.update(
                            {owner: id},
                            {$set: {
                              owner: id, 
                              username: username,        
                              name: name,
                              display_name: display_name,
                              school: school,
                              about: about,
                              uni: uni,
                              twitter: twitter,
                              facebook: facebook,
                              linkedin: linkedin,
                              image_url: image_url,
                              availability_notes: availability_notes
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
                          AvailabilityCollection.remove({owner: id});
                        },
                        setAvailability: function (id,
                                                   username,
                                                   monday_times,
                                                   tuesday_times,
                                                   wednesday_times,
                                                   thursday_times,
                                                   friday_times,
                                                   saturday_times,
                                                   sunday_times) {
                                                     if (!Meteor.userId()) {
                                                       throw new Meteor.Error('not-authorized');
                                                     }

                                                     AvailabilityCollection.update({
                                                       owner: id,
                                                       username: username,        
                                                       monday: monday_times,
                                                       tuesday: tuesday_times,
                                                       wednesday: wednesday_times,
                                                       thursday: thursday_times,
                                                       friday: friday_times,
                                                       saturday: saturday_times,
                                                       sunday: sunday_times,
                                                     });
                                                   }
});

// Server
if (Meteor.isServer) {
  Meteor.publish('people-master', function () {
    return PeopleCollection.find();
  });

  Meteor.publish('people-pending', function () {
    return PendingPeopleCollection.find();
  });
}

var openFilePicker = function () {
  filepicker.setKey(Meteor.settings.public.filepicker.key);
  filepicker.pick(
    {
      mimetype: 'image/*',
      services: ['BOX', 'CLOUDDRIVE', 'COMPUTER', 'DROPBOX', 'FACEBOOK', 'GOOGLE_DRIVE', 'FLICKR', 'GMAIL', 'INSTAGRAM', 'SKYDRIVE', 'IMAGE_SEARCH', 'URL'],
      imageMax: [1024, 1024],
      cropDim: [300, 300],
      cropForce: true
    },
    function (Blob) {
      Session.set('UploadedImageUrl', Blob.url);
    },
    function (FPError) {
      console.log(FPError.toString());
    }
  );
};
