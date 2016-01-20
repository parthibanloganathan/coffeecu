Meteor.subscribe('people');

Template.people.rendered = function () {
  $(document).ready(function(){
    $('.ui.accordion').accordion({exclusive: true});
  });
};

Template.Home.helpers({
  'welcome': function () {
    return data.welcome;
  }
});

Template.meetingsMade.helpers({
  'meetings': function() {
    return MeetingsCollection.find().fetch().length; 
  }
});

Template.people.helpers({
  'people': function () {
    return PeopleCollection.find().fetch();
  }
});

Template.people.events({
  'click .person #contact': function () {
    $('.ui.modal')
    .modal({
      onDeny: function () {
        return true;
      }
    }).modal('show');
  /*
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
  */
}
});

Template.uniPrompt.events({
  'submit form': function (event) {
    event.preventDefault();

    var receiverUni = this.uni;
    var receiverName = this.name.split(' ')[0];
    var senderUni = event.target.uni.value;

    Meteor.call('processSendRequest', senderUni, receiverUni, receiverName, function (error, response) {
      if (error) {
        console.log("Failed to process UNI.");
        console.log(error);
      } else {
        console.log("Received from process:");
        console.log(response);
      }
    });
  }
});
