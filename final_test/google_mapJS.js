function initialize() {
        var mapProp= {
            center:new google.maps.LatLng(36,-78.93),
            zoom:14,
        };
        var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);  
        showSchools(map);
}

function showSchools(map) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(36,-78.93),
      label: schoolJSON.schools[1].name,
      map: map
    });
}