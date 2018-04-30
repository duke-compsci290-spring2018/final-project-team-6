/*
//schoolsVisit = ["duke","harvard"];
//lat = [36, 42.37];
//long = [-78.93,-71.11];
var markers = [];
var schoolsVisit = [];
var lat = [];
var long = [];

//var config = {
//    apiKey: "AIzaSyBCSYxVO59SGArvQt97mFdVN_dJElpl0jE",
//    authDomain: "final-college-connectour.firebaseapp.com",
//    databaseURL: "https://final-college-connectour.firebaseio.com",
//    projectId: "final-college-connectour",
//    storageBucket: "",
//    messagingSenderId: "640733598580"
//  };
//var db = firebase.initializeApp(config).database();

function initialize() {
        var mapProp= {
            center:new google.maps.LatLng(36,-78.93),
            zoom:14,
        };
        var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);  
        showSchools(map);
}

function showSchools(map) {
//        for(var i = 0; i < snapshot.val().schoolDat.schools.length; i++){
//            var dex = schoolsVisit.indexOf(snapshot.val().schoolDat.schools[i].name);
//            if(dex != -1){
//                lat[dex] = snapshot.val().schoolDat.schools[i].location[0];
//                long[dex] = snapshot.val().schoolDat.schools[i].location[1];
//                markers.push({
//                    position: new google.maps.LatLng(lat[dex],long[dex]),
//                    label: schoolsVisit[dex],
//                    map: map
//                });
//            }
//        }

//    db.ref().once('value').then(this.readData(snapshot));
    
    for(var j=0; j<schoolsVisit.length;j++){
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat[j],long[j]),
          label: schoolsVisit[j],
          map: map
        });
    }
}


function readData(snapshot){
//db.ref().once('value').then(function(snapshot){
    if(snapshot.val().schedSchools){
        for(var k=0; k<snapshot.val().schedSchools.length;k++){
            schoolsVisit.push(snapshot.val().schedSchools[k].name);
        }
        for(var q=0; q<schoolsVisit.length;q++){
            lat.push(snapshot.val().schedSchools[q].location[0]);
            long.push(snapshot.val().schedSchools[q].location[1]);
        }
    }
//});
} */