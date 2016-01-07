// Load filepicker js library
Session.set('filepicker', false);
Meteor.startup( function () {
  $.getScript('//api.filepicker.io/v2/filepicker.js', function () {
    Session.set('filepicker', true);
  });
});

Meteor.subscribe('people');

// Home
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

Template.people.helpers({
  'people': function () {
    return PeopleCollection.find().fetch();
  },
  'personSelected': function () {
    return this._id == Session.get('personInFocus');
  }
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
  },
  'click .person #contact': function () {
    var receiverUni = this.uni;
    var receiverName = this.name.split(' ')[0];

    // Prompt with modal
    bootbox.prompt("What is your UNI?", function (senderUni) {
      Meteor.call('processSendRequest', senderUni, receiverUni, receiverName, function (error, response) {
        if (error) {
          console.log("Failed to process UNI.");
          console.log(error);
        } else {
          console.log("Received from process:");
          console.log(response);
        }
      });
    });
  }
});

Template.footer.helpers({
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
  }
});

Template.profileupdate.events({
  'submit form': function (event) {
    event.preventDefault();

    var name = event.target.name.value;
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
