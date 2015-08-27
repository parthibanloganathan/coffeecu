// Client
if (Meteor.isClient) {
  // Load filepicker js library
  Session.set("filepicker", false);
  Meteor.st
  return Meteor.usId() ==artup( function () {
    $.getScript('//api.filepicker.io/v2/filepicker.js', function () {
        Session.set("filepicker", true);
        });
  });

  Meteor.subscribe("people");

  Template.people.helpers({
    'people': function () {
      return PeopleCollection.find().fetch();
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Template.userprofile.helpers({
    'id': function () {
      return Meteor.userId();
    },
    'user': function () {
      return PeopleCollection.find({owner: Meteor.userId()}).fetch();
    }
  });

  Template.profileupdate.helpers({
    'user': function () {
      return PeopleCollection.find({owner: Meteor.userId()}).fetch()[0];
    },
    'set-availability': function () {
      Meteor.call("setAvailability", 
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
    "submit form": function (event) {
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
      if (Session.get("UploadedImageUrl")) {
        image_url = Session.get("UploadedImageUrl");
      }
      Session.set("UploadedImageUrl", "");      
      var availability_notes = event.target.availability_notes.value;

      Meteor.call("insertUser",
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
    },
    'click #deleteprofile': function(){
      Meteor.call("deleteUser", Meteor.userId());
    },
    'click #uploadphoto': function(){
      openFilePicker();
    }
  });

  Template.people.events({
    "click .person": function () {
      if (Session.get("personInFocus") != this._id._str) {
        Session.set("personInFocus", this._id._str);
      } else {
        Session.set("personInFocus", "");        
      }
    }
  });

  Template.people.helpers({
    'personSelected': function () {
      return this._id._str == Session.get("personInFocus");
    }
  });

  Template.main.helpers({
    'currentYear': function () {
      return new Date().getFullYear();
    }
  });

  Template.userManager.helpers({
    'isAdmin': function () {
      return Meteor.settings.public.admins.indexOf(Meteor.userId()) > -1;
    }
  });
}

// Common

//Router
Router.configure({
  layoutTemplate: 'main'
});

Router.route('/', {
  name: 'home',
  template: 'home'
});

Router.route('/user/:userid', {
  template: 'user',
  data: function () {
    var currentUser = this.params.userid;
    return PeopleCollection.findOne({ owner: currentUser });
  }
});

PeopleCollection = new Mongo.Collection("people");
AvailabilityCollection = new Mongo.Collection("availability");

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
      throw new Meteor.Error("not-authorized");
    }

    PeopleCollection.update(
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
  deleteUser: function (id) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    PeopleCollection.remove({owner: id});
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
      throw new Meteor.Error("not-authorized");
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
  Meteor.publish("people", function () {
    return PeopleCollection.find();
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
                          Session.set("UploadedImageUrl", Blob.url);
                          },
                          function (FPError) {
                          console.log(FPError.toString());
                          }
                          );
                          };
