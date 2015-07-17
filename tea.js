// Client
if (Meteor.isClient) {
  Meteor.subscribe("people");

  Template.people.helpers({
    'people': function() {
      return PeopleCollection.find().fetch();
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Template.profile.helpers({
    'insert': function(name,
        display_name,
        school,
        about,
        uni,
        twitter,
        facebook,
        linkedin) {
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
          linkedin);
    },
        'set-availability': function() {
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
    'personSelected': function() {
      return this._id._str == Session.get("personInFocus");
    }
  });
}

// Common

//Router
Router.route('/', {
    template: 'home'
});

Router.route('/', {
    template: 'home'
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
                  linkedin) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    PeopleCollection.insert({
      owner: id, 
      username: username,        
      name: name,
      display_name: display_name,
      school: school,
      about: about,
      uni: uni,
      twitter: twitter,
      facebook: facebook,
      linkedin: linkedin
    });
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
