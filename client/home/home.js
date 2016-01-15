// Load filepicker js library
Session.set('filepicker', false);
Meteor.startup( function () {
  $.getScript('//api.filepicker.io/v2/filepicker.js', function () {
    Session.set('filepicker', true);
  });
});

Meteor.subscribe('people');

Template.people.rendered = function () {
  $(document).ready(function(){
    $('.ui.accordion').accordion({exclusive: true});
  });
};

Template.welcomeMessage.helpers({
  'welcome': function() {
    var message = data.welcome;
    return message;
  }
});

Template.meetingsMade.helpers({
  'meetings': function() {
    return MeetingsCollection.find().fetch().length; 
  }
})

Template.people.helpers({
  'people': function () {
    return PeopleCollection.find().fetch();
  },
  'personSelected': function () {
    return this._id == Session.get('personInFocus');
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

openFilePicker = function () {
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
