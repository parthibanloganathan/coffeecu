Session.set('message', 'default');

Template.profileupdate.rendered = function () {
  $('.ui .checkbox').checkbox();
  $('.ui .checkbox').checkbox();

  $('.ui .form')
  .form({
    fields: {
      name         : ['maxLength[40]', 'empty'],
      uni          : ['maxLength[7]', 'empty'],
      major        : ['maxLength[40]', 'empty'],
      about        : ['maxLength[250]', 'empty'],
      likes        : ['maxLength[100]', 'empty'],
      contactfor   : ['maxLength[150]', 'empty'],
      availability : ['maxLength[100]', 'empty'],
      twitter      : 'url',
      facebook     : 'url',
      linkedin     : 'url',
      image        : 'url',
      agreement    : 'checked'
    }
  });
};

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
    var uni = event.target.uni.value;
    var school = event.target.school.value;
    var major = event.target.major.value;
    var about = event.target.about.value;
    var likes = event.target.likes.value;
    var contactfor = event.target.contactfor.value;
    var availability = event.target.availability.value;
    var twitter = event.target.twitter.value;
    var facebook = event.target.facebook.value;
    var linkedin = event.target.linkedin.value;
    var image = event.target.image.src;
    if (Session.get('UploadedImageUrl')) {
      image = Session.get('UploadedImageUrl');
    }
    Session.set('UploadedImageUrl', '');      

    Meteor.call('insertUser',
                Meteor.userId(),
                Meteor.user().username,
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
               );
               Session.set('message', 'Your profile is currently under review and will be posted once approved.');
  },
  'click #deleteprofile': function() {
    Meteor.call('deleteUser', Meteor.userId());
    Session.set('message', 'Your profile has been successfully deleted.');
  },
  'click #uploadphoto': function() {
    openFilePicker();
  }
});

Template.formMessage.events({
  'click .message .close': function (event) {
    $(event.target)
    .closest('.message')
    .transition('fade');
    Session.set('message', 'default');
  }
});

Template.formMessage.helpers({
  'isMessageSet': function () {
    return Session.get('message') != 'default';
  },
  'message': function () {
    return Session.get('message');
  }
});
