Tracker.autorun(function () {
  Meteor.subscribe('people-pending');
  Meteor.subscribe('user-data');
});

Session.set('user', {});

Template.profileupdate.rendered = function () {
  $('.ui .form')
  .form({
    inline: true,
    on: 'blur',
    fields: {
      name: {
        identifier  : 'name',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your name.'
          },
          {
            type   : 'maxLength[40]',
            prompt : "Woah! That's a long name. Try using a shorter nickname that is under 41 characters."
          }
        ]
      },
      school: {
        identifier  : 'school',
        rules: [
          {
            type   : 'checked',
            prompt : 'Please select a school'
          }
        ]
      },
      year: {
        identifier  : 'year',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please select when you graduate'
          }
        ]
      },
      major: {
        identifier  : 'major',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your major.'
          },
          {
            type   : 'maxLength[40]',
            prompt : "Wow, you must be smart! That's a lot of words to describe what you study. Try summing it up in under 41 characters."
          }
        ]
      },
      about: {
        identifier  : 'about',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please tell us something about yourself.'
          },
          {
            type   : 'maxLength[400]',
            prompt : "We're excited that you want to share so much about yourself! Please keep it to 400 characters though."
          }
        ]
      },
      likes: {
        identifier  : 'likes',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please tell us what you like.'
          },
          {
            type   : 'maxLength[150]',
            prompt : "You like a lot of things! Any chance you can you bring it down to 150 characters?"
          }
        ]
      },
      contactfor: {
        identifier  : 'contactfor',
        rules: [
          {
            type   : 'empty',
            prompt : "Please tell us what people should definitely contact you about. You're clearly an expert in some areas or have words of wisdom to pass down. Share it!"
          },
          {
            type   : 'maxLength[250]',
            prompt : "You must be very wise to have so many things to be contacted for. Can you keep it to 250 characters?"
          }
        ]
      },
      availability: {
        identifier  : 'availability',
        rules: [
          {
            type   : 'empty',
            prompt : "Please tell us when you're generally free to chat with folks."
          },
          {
            type   : 'maxLength[150]',
            prompt : "List your availability in 150 characters or less please."
          }
        ]
      },
      twitter: {
        identifier  : 'twitter',
        optional: true,
        rules: [
          {
            type   : 'url',
            prompt : "Please enter a valid URL (with the 'https://' part). eg - https://twitter.com/columbia"
          }
        ]
      },
      facebook: {
        identifier  : 'facebook',
        optional: true,
        rules: [
          {
            type   : 'url',
            prompt : "Please enter a valid URL (with the 'https://' part). eg - https://facebook.com/columbia"
          }
        ]
      },
      linkedin: {
        identifier  : 'linkedin',
        optional: true,
        rules: [
          {
            type   : 'url',
            prompt : "Please enter a valid URL (with the 'https://' part). eg - https://www.linkedin.com/in/barackobama"
          }
        ]
      },
      website: {
        identifier  : 'website',
        optional: true,
        rules: [
          {
            type   : 'url',
            prompt : "Please enter a valid URL (with the 'https://' part). eg - https://www.columbia.edu"
          }
        ]
      },
      agreement: {
        identifier  : 'agreement',
        rules: [
          {
            type   : 'checked',
            prompt : 'Please acknowledge the above note by checking the box'
          }
        ]
      }
    }
  });

  Meteor.call('searchCollectionsToPopulateProfile', Meteor.userId(), function (error, response) {
    Session.set('user', response);

    var user = response;

    // Populate radio button
    if (user) {
      $('#' + user.school).prop('checked', true);
    }

    // Populate check
    if (user && user.make_public) {
      $('#make_public').prop('checked', true);
    }

    if (!user) {
      $('#make_public').prop('checked', true);
    }

    // Initialize and populate dropdown
    if (user) {
      $('.ui.dropdown').val(user.year);
    }

    // Callback for photo url in meteor-uploads
    Meteor.startup(function () {
      Uploader.finished = function(index, fileInfo, templateContext) {
        Session.set('UploadedImageUrl', fileInfo.finalUrl);
        $('#profile-image').attr('src', fileInfo.finalUrl + "?preventcache=" + Date.now());
      };
    });

  });
};

Template.profileupdate.helpers({
  'userIdData': function () {
    return {
      id: Meteor.userId()
    };
  },
  'user': function () {
    return Session.get('user');
  }
});

Template.profileupdate.events({
  'submit .profileupdate': function (event) {
    event.preventDefault();

    var name = event.target.name.value;

    var email;
    if (Meteor.user().services.google) {
      email = Meteor.user().services.google.email;
    } else {
      email = Meteor.user().emails[0].address.toLowerCase();
    }

    var uni = email.substr(0, email.indexOf('@'));
    var school = event.target.school.value;
    var year = event.target.year.value;
    var major = event.target.major.value;
    var about = event.target.about.value;
    var likes = event.target.likes.value;
    var contactfor = event.target.contactfor.value;
    var availability = event.target.availability.value;
    var twitter = event.target.twitter.value;
    var facebook = event.target.facebook.value;
    var linkedin = event.target.linkedin.value;
    var website = event.target.website.value;
    var make_public = event.target.make_public.checked;

    var image = event.target.image.src;
    if (Session.get('UploadedImageUrl')) {
      image = Session.get('UploadedImageUrl');
    }
    Session.set('UploadedImageUrl', '');

    Meteor.call('insertPendingUser',
                Meteor.userId(),
                email,
                name,
                uni,
                school,
                year,
                major,
                about,
                likes,
                contactfor,
                availability,
                twitter,
                facebook,
                linkedin,
                website,
                make_public,
                image
               );

               Materialize.toast('Your profile is currently under review and will be posted once approved.', 4000);
  },
  'click #deleteprofile': function() {
    event.preventDefault();    
    Meteor.call('deleteUser', Meteor.userId());
    Materialize.toast('Your profile has been successfully deleted.', 4000);
  }
});
