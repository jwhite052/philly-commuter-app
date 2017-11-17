function initMap() {

  // initalize map
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.0556365, lng: -75.1},
    zoom: 10,
    minZoom: 9,
    maxZoom: 16,
    mapTypeControl: false,
    streetViewControl: false,
    clickableIcons: false
  });

  $.ajax({
      url: 'https://www3.septa.org/api/TransitView/?route=48&callback=?',
      dataType: 'jsonp',
      success: function(response){
        var marker;
        for (var i = 0; i < response.bus.length; i++) {
          marker = new google.maps.Marker({
            position: {lat: parseFloat(response.bus[i].lat), lng: parseFloat(response.bus[i].lng)},
            map: map
          });
        }
      }
  });

  var geoSuccess = function(position) {
    startPos = position;
    console.log(startPos.coords.latitude);
    console.log(startPos.coords.longitude);
    var marker = new google.maps.Marker({
      position: {lat: startPos.coords.latitude, lng: startPos.coords.longitude},
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        strokeColor: '#569bca'
      }
    });
  };
  navigator.geolocation.getCurrentPosition(geoSuccess);
}
