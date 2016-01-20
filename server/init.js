// For image uplods using meteor-uploads
Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/.uploads/tmp',
    uploadDir: process.env.PWD + '/.uploads/',
    checkCreateDirectories: true, //create the directories for you
    getFileName: function (fileInfo, formData) {
      return formData.id + '_dp.jpg';
    },
    finished: function (fileInfo, formFields) {
      fileInfo.finalUrl = fileInfo.baseUrl + 'profilePic' + fileInfo.path;
    },
    maxFileSize: 1000000, // 1 MB 
    imageVersions: {profilePic: {width: 250, height: 250}},
    mimeTypes: {
      "jpeg": "image/jpeg",
      "jpg": "image/jpeg",
      "png": "image/png"
    },
    overwrite: true
  })
});
