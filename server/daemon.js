var interval = 86400000; // 1 day
Meteor.setInterval( function () {
  // Randomize order of candidates once a day
  var max = PeopleCollection.find().count();
  var min = 1; 
  PeopleCollection.update({}, {$set: {priority: Math.round(Math.random()*(max - min) + min)} });
  // hard code myself into top 3
  PeopleCollection.update({uni: "pl2487"}, {$set: {priority: Math.round(Math.random()*(3 - min) + min)} });
}, interval);
