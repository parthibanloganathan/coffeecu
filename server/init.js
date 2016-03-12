// For image uplods using meteor-uploads
Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/.uploads/tmp',
    uploadDir: process.env.PWD + '/.uploads/',
    checkCreateDirectories: true, // create the directories if not present
    getFileName: function (fileInfo, formData) { // rename files to <id>_dp.jpg 
      return formData.id + '_dp.jpg';
    },
    finished: function (fileInfo, formFields) { // construct final url baseUrl/uploads/profilePic/<id>_dp.jpg
      //fileInfo.finalUrl = fileInfo.baseUrl + 'profilePic' + fileInfo.path;
      fileInfo.finalUrl = fileInfo.baseUrl.substring(0,-1) + fileInfo.path;
    },
    maxFileSize: 10000000, // 10 MB 
    mimeTypes: {
      "jpeg": "image/jpeg",
      "jpg": "image/jpeg",
      "png": "image/png"
    },
    overwrite: true
  });
});
