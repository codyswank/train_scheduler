var config = {
	apiKey: "AIzaSyDdrb9KCOQX3zpSgOlgl2e9yITnW6-wym8",
	authDomain: "train-76b34.firebaseapp.com",
	databaseURL: "https://train-76b34.firebaseio.com",
	projectId: "train-76b34",
	storageBucket: "",
	messagingSenderId: "621023934288"
};

firebase.initializeApp( config );
var database = firebase.database();
var name = "";
var destination = "";
var firstTrain = "";
var frequency = 0;


$( "#submit" ).on( "click", function() {
	event.preventDefault();
	name = $( "#train-name" ).val().trim();
	destination = $( "#destination" ).val().trim();
	firstTrain = $( "#first-train" ).val().trim();
	frequency = $( "#frequency" ).val().trim();
	database.ref().push( {
		name: name,
		destination: destination,
		firstTrain: firstTrain,
		frequency: frequency,
		dateAdded: firebase.database.ServerValue.TIMESTAMP
	} );
	$( "form" )[ 0 ].reset();
} );


database.ref().on( "child_added", function( snapshot ) {
	var minAway;
	var firstTrainNew = moment( snapshot.val().firstTrain, "hh:mm" ).subtract( 1, "years" );
	var diffTime = moment().diff( moment( firstTrainNew ), "minutes" );
	var remainder = diffTime % snapshot.val().frequency;
	var minAway = snapshot.val().frequency - remainder;
	var nextTrain = moment().add( minAway, "minutes" );
	nextTrain = moment( nextTrain ).format( "hh:mm" );
	$( "#add-row" ).append( "<tr><td>" + snapshot.val().name + "</td><td>" + snapshot.val().destination + "</td><td>" + snapshot.val().frequency + "</td><td>" + nextTrain + "</td><td>" + minAway + "</td></tr>" );
}, function( errorObject ) {
	console.log( "Errors handled: " + errorObject.code );
} );


database.ref().orderByChild( "dateAdded" ).on( "child_added", function( snapshot ) {
	$( "#name-display" ).html( snapshot.val().name );
	$( "#email-display" ).html( snapshot.val().email );
	$( "#age-display" ).html( snapshot.val().age );
	$( "#comment-display" ).html( snapshot.val().comment );
} );