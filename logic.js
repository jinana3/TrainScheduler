/* global moment firebase */
// Initialize Firebase
var config = {
  apiKey: "AIzaSyC8y0QgAlOfluwX9aG_XyXXlErgMQ1A1F4",
  authDomain: "jina-test.firebaseapp.com",
  databaseURL: "https://jina-test.firebaseio.com",
  projectId: "jina-test",
  storageBucket: "jina-test.appspot.com",
  messagingSenderId: "1092332888017"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// ----------------------------------------------------------//
//Code from Employee Time Sheet in class activity
//Stephanie, Joe, Ivo and myself
//Later worked with Chetan and Ivo to discuss methodology

// Whenever a user clicks the click button
$("#add-train").on("click", function(event) {
  event.preventDefault();

  // Get the input values
  var trainName = $("#train-name").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrain = $("#first-train").val();
  var frequency = $("#frequency").val().trim();

  console.log(trainName);
  console.log(destination);
  console.log(firstTrain);
  console.log(frequency);

  database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});

//use format only to change  into string and make things readible for users, otherwise moment() is  enough to "grab" the date
/*console.log(moment(new Date()).format("YYYYMMDD"));
console.log(moment().format("YYYYMMDD HH:MM"));*/

database.ref().on("child_added", function(childSnapshot) {

    //obtain  info from database
    var firstTrain = childSnapshot.val().firstTrain;
    var frequency = childSnapshot.val().frequency;
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;


    //calculations
    var firstTrainMoment = moment(firstTrain, "HH:mm"); 
    var diff = firstTrainMoment.diff(moment(), "minutes");
    //diff gives 1 min off if first train is after current time...don't know how to deal with it
    var remainder  = 0;
    var minutesAway = 0;
    var nextTrain = moment();
    if (diff < 0){
      remainder = diff % frequency;
      minutesAway = frequency - Math.abs(remainder);
      nextTrain = moment().add(minutesAway, "minutes");
    }
    else if (diff > 0){
      remainder = (diff+1) % frequency;
      minutesAway = remainder;
      nextTrain = moment().add(minutesAway, "minutes");
    }
    else{
      nextTrain = moment().add(frequency, "minutes");
    }
    //there are two special case problems, a) when diff > 0, then  the time does not update to next when there's 0 mins remaining
    //b) when the diff = 0, it remains 0 for actual time difference of 1 and difference of 0
    //have no idea why this is...leave for later to solve

    //console log the story
    console.log("first train is " + firstTrainMoment.format("HH:mm"));
    console.log("train  comes every " + frequency);
    console.log("time difference is " + diff + " minutes");
    console.log("remainder is " + remainder); 
    console.log("train is " + minutesAway + " minutes away");
    console.log("next train is at " + nextTrain.format("HH:mm"));
    console.log("-----------------------");


     //full list of items to the well
      $("#train-list").append(
      "<div class='row'><div class='col-lg-2'>" 
      + trainName
      + "</div><div class='col-lg-2'>" 
      + destination
      + "</div><div class = 'col-lg-2'>" 
      + frequency
      + "</div><div class='col-lg-2'>" 
      + nextTrain.format("HH:mm")
      +" </div><div class='col-lg-2'>" 
      + minutesAway
      + "</div></div>");

  // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

