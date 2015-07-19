// Client
if (Meteor.isClient) {
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
      return PeopleCollection.find({owner: Meteor.userId()}).fetch();
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
      console.log("Submit update called");
      console.log(event);
      event.preventDefault();

      var name = event.target.name.value;
      var display_name = event.target.display_name.value;
      var school = event.target.school.value;
      var about = event.target.about.value;
      var uni = event.target.uni.value;
      var twitter = event.target.twitter.value;
      var facebook = event.target.facebook.value;
      var linkedin = event.target.linkedin.value;

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
    'click #deleteprofile': function(){
      console.log('Deleting user');
      Meteor.call("deleteUser", Meteor.userId());
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
    console.log(currentUser);
    var p = PeopleCollection.findOne({ owner: currentUser });
    console.log(p);
    return p;
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
                  linkedin) {
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
                 linkedin: linkedin
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
