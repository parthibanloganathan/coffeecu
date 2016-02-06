Accounts.validateNewUser( function (user) {
  if (/[a-z]{2,3}\d{4}@(barnard|columbia)\.edu$/.test(user.emails[0].address.toLowerCase())) {
    return true;
  } else {
    throw new Meteor.Error(403, "Use a <UNI>@columbia.edu or <UNI>@barnard.edu email address.");
  }
});

Accounts.emailTemplates.siteName = "Coffee at Columbia";

Accounts.emailTemplates.from = "Coffee at Columbia <do-not-reply@teaatcolumbia.info>";

Accounts.emailTemplates.resetPassword.subject = function (user) {
    return "Tea@Columbia - Reset password for " + user.profile.displayName;
};

Accounts.emailTemplates.resetPassword.text = function (user, url) {
    var signature = "Coffee at Columbia bot";

    return "Dear " + user.profile.displayName + ",\n\n" +
        "Click the following link to reset your password:\n" +
        url + "\n\n" +
        "Cheers,\n" +
        "Your friends at Coffee at Columbia";
};
