

// Your web app's Firebase configuration
var firebaseConfig = {


    apiKey: "AIzaSyACk0p2PULuJXZOGgfThF5CrZvNP9uXwGo",
    authDomain: "train-schedule-1356c.firebaseapp.com",
    databaseURL: "https://train-schedule-1356c.firebaseio.com",
    projectId: "train-schedule-1356c",
    storageBucket: "",
    messagingSenderId: "967421651426",
    appId: "1:967421651426:web:a711d22d786ef6b22c71bb"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var dataRef = firebase.database();

// Initial Values
var trainName = "";
var destination = "";
var firstTrain = 0;
var frecuancy = "";
var nextArribal = "";
var minutesAway = 0;

// Capture Button Click
$("#submit-btn").on("click", function (event) {
    event.preventDefault();

    trainName = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTrain = $("#first-train-input").val().trim();
    frecuancy = $("#frecuancy-input").val().trim();
    // console.log(`train Name ${trainName} destination ${destination} firstTrain ${firstTrain} frecuancy ${frecuancy}`)

    // Code for the push
    dataRef.ref().push({

        train_name: trainName,
        destination: destination,
        first_train: firstTrain,
        frecuancy: frecuancy,

    });

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frecuancy-input").val("");


});
// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
dataRef.ref().on("child_added", function (childSnapshot) {

    // console.log(childSnapshot.val());
    // console.log(childSnapshot.val().train_name);
    // console.log(childSnapshot.val().destination);
    // console.log(childSnapshot.val().first_train);
    // console.log(childSnapshot.val().frecuancy);


    // Prettify the employee start
    // var minustesAway = moment().diff(moment(empStart, "X"), "months")


    var timeArray = childSnapshot.val().first_train.split(":")
    var trainTime = moment().hours(timeArray[0]).minutes(timeArray[1])

    var maxMoment = moment.max(moment(), trainTime)
    var tMin;
    var tArrival;
    if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMin = trainTime.diff(moment(), "minutes");

    } else {
        var differentTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differentTimes % childSnapshot.val().frecuancy;
        tMin = childSnapshot.val().frecuancy - tRemainder;
        tArrival = moment().add(tMin, "minutes").format("hh:mm A");


    }
    console.log(tMin);
    console.log(tArrival);


    var newRow = $("<tr>").append(
        $("<td>").text(childSnapshot.val().train_name),
        $("<td>").text(childSnapshot.val().destination),
        $("<td>").text(childSnapshot.val().first_train),
        $("<td>").text(childSnapshot.val().frecuancy),
        $("<td>").text(tMin),
        $("<td>").text(tArrival),
    );
    // Append the new row to the table
    $("#employee-table > tbody").append(newRow);

});

