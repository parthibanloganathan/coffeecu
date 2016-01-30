Meteor.subscribe('people');

Session.set('currentlySelected', null);

Template.people.rendered = function () {
  $(document).ready(function(){
    $('.ui.accordion').accordion({exclusive: true});
  });
};

Template.intro.helpers({
  'welcome': function () {
    return data.welcome;
  }
});

Template.meetingsMade.rendered = function () {
  // Update #meetings every second
  Meteor.setInterval(function () {
    Meteor.call('countMeetings', function (error, response) {
      Session.set('meetings', response);
    });
  }, 1000);
};

Template.meetingsMade.helpers({
  'meetings': function () {
    return Session.get('meetings');
  }
});

Template.people.helpers({
  'people': function () {
    return PeopleCollection.find().fetch();
  },
  'peopleIndex': function () {
    return PeopleIndex;
  },
  'inputAttributes': function () {
    return {
      placeholder: 'Search by name, school, major, etc...'
    };
  }
});

Template.people.events({
  'click #contact': function () {
    Session.set('currentlySelected', { uni: this.uni, name: this.name.split(' ')[0] });
    $('.ui.modal').modal({
      onApprove: function(event) {
        var receiverUni = Session.get('currentlySelected').uni;
        var receiverName = Session.get('currentlySelected').name;
        var senderUni = $("#senderUni").val();

        Meteor.call('processSendRequest', senderUni, receiverUni, receiverName, function (error, response) {
          if (error) {
            Materialize.toast('Failed to process your UNI', 4000);          
            console.log(error);
          } else {
            Materialize.toast('Request sent!', 4000);            
            console.log("Received from process:");
            console.log(response);
          }
        });
      }
    }).modal('show');
  }
});
