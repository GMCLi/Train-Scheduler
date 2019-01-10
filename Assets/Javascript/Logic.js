var config = {
    apiKey: "AIzaSyBaHcu6sUcnsJS-WhOmL5ed9lS80JcTOM8",
    authDomain: "train-scheduler-39eb0.firebaseapp.com",
    databaseURL: "https://train-scheduler-39eb0.firebaseio.com",
    projectId: "train-scheduler-39eb0",
    storageBucket: "train-scheduler-39eb0.appspot.com",
    messagingSenderId: "548428925221"
  };
  firebase.initializeApp(config);
//ALERT - ISSUES WITH RUNNING FIREBASE ON LOAD
  var database = firebase.database();

//When clicking the Submit button
$("#add-train-btn").on("click", function(event) {
    //Prevent page refresh due to the form
    event.preventDefault();
    //Takes the values of the inputs
    var trainName=$("#train-name-input").val().trim();
    var trainDestination=$("#destination-input").val().trim();
    var trainStart=moment($("#start-input").val().trim(), "HH:mm").format("X");
    var trainFrequency=$("#frequency-input").val().trim();
    //Creates objects for each groups of inputs
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        traintime: trainStart,
        frequency: trainFrequency
    };

    //Pushes the train data to database
    database.ref().push(newTrain);

    //console.log train info
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.traintime);
    console.log(newTrain.frequency);

    //Alert that train has successfully added
    alert("Train successfully added");

    //Clear out the text boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
});

// Creating Firebase event for adding trains to the database and the row in html post data entry
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    //storing everything into a variable
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().traintime;//this is 1546754400
    var trainFrequency = childSnapshot.val().frequency;

    console.log("Train Name: ",trainName);
    console.log("Destination: ",trainDestination);
    console.log("Next Arrival: ",trainTime);
    console.log("Frequency: ",trainFrequency);

    //Prettify...
    var trainStartPretty = moment.unix(trainTime).format("HH:mm");

    //Calculate the time until the train
    var trainETA = moment().diff(moment(trainTime, "X"), "minutes");//this changes 1546754400 to the time
    console.log("ETA: ",trainETA);


    if (trainETA *-1 < 0) {
        console.log("train missed");//CONFIRMED FUNCTIONAL
        console.log("frequency from the snapshot object: ",childSnapshot.val().frequency);
        console.log(trainETA - childSnapshot.val().frequency);//ETA - frequency of train
        var nextArrival = trainStartPretty + childSnapshot.val().frequency;
        console.log(nextArrival);
    }
    






    //Creating the new rows
    var newRow = $("<tr>").append(
        $("<td scope='col'>").text(trainName),
        $("<td scope='col'>").text(trainDestination),
        $("<td scope='col'>").text(trainFrequency),
        $("<td scope='col'>").text(trainStartPretty),
        $("<td scope='col'>").text(trainETA *-1)
    );

    //Appending the newly created row to the table
    $("#train-body").append(newRow);
})


