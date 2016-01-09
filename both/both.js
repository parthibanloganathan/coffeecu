// Utility
SearchPeopleCollection = function (query) {
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
  });
});

Router.route('/admin', function () {
  this.render('Admin');
});

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
                        }
});

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
