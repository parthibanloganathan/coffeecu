Accounts.emailTemplates.siteName = "Tea@Columbia";

Accounts.emailTemplates.from = "Tea@Columbia <do-not-reply@teaatcolumbia.info>";

Accounts.emailTemplates.resetPassword.subject = function (user) {
    return "Tea@Columbia - Reset password for " + user.profile.displayName;
};

Accounts.emailTemplates.resetPassword.text = function (user, url) {
    var signature = "Tea@Columbia bot";

    return "Dear " + user.profile.displayName + ",\n\n" +
        "Click the following link to reset your password:\n" +
        url + "\n\n" +
        "Cheers,\n" +
        "Your friends at Tea@Columbia";
};
