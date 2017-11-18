function initMap() {
  var DEV_MODE = true;
  var ROOT_PATH = 'https://jwhite052.github.io/philly-commuter-app';
  var KML_ROOT_PATH = 'https://jwhite052.github.io/philly-commuter-app';
  if (DEV_MODE === true) {
    ROOT_PATH = '';
  }

  // initalize map
  var GLOBAL_MAP = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.0556365, lng: -75.1},
    zoom: 10,
    minZoom: 9,
    maxZoom: 16,
    mapTypeControl: false,
    streetViewControl: false,
    clickableIcons: false
  });

  var setBusMarkers = function(map, response) {
    var marker;
    var markerIconsList = {
      'northbound': {
        url: ROOT_PATH + 'src/images/marker-bus-northbound.png',
        size: new google.maps.Size(24, 24),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 12)
      },
      'southbound': {
        url: ROOT_PATH + 'src/images/marker-bus-southbound.png',
        size: new google.maps.Size(24, 24),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 12)
      },
      'default': {
        url: ROOT_PATH + 'src/images/marker-bus-default.png',
        size: new google.maps.Size(24, 24),
        origin: new google.maps.Point(0, 0)
      }
    };
    var infowindow = new google.maps.InfoWindow({});
    for (var i = 0; i < response.bus.length; i++) {
      var direction = response.bus[i].Direction;
      var markerIcon = "";
      var content = 'Destination: ' + response.bus[i].destination + '<br>' +
                    'Direction: ' + response.bus[i].Direction + '<br>' +
                    'Late: ' + response.bus[i].late;
      switch (direction.toUpperCase()) {
        case 'NORTHBOUND':
          markerIcon = markerIconsList.northbound;
          break;
        case 'SOUTHBOUND':
          markerIcon = markerIconsList.southbound;
          break;
        default:
          markerIcon = markerIconsList.default;
          break;
      }
      marker = new google.maps.Marker({
        position: {lat: parseFloat(response.bus[i].lat), lng: parseFloat(response.bus[i].lng)},
        icon: markerIcon,
        map: map,
        title: response.bus[i].destination,
        content: content
      });
      marker.addListener('click', function() {
        infowindow.close();
        infowindow.setContent(this.content);
        infowindow.open(map, this);
      });
    }
  };

  var setBusRoute = function(map) {
    var routeLayer = new google.maps.KmlLayer({
      url: KML_ROOT_PATH + '/src/kml/48.kml',
      map: map
    });
  };

  var successAPIRequest = function(map, response) {
    setBusMarkers(map, response);
    setBusRoute(map);
  };

  $.ajax({
      url: 'https://www3.septa.org/api/TransitView/?route=48&callback=?',
      dataType: 'jsonp',
      success: function(response){
        successAPIRequest(GLOBAL_MAP, response);
      }
  });

  // GPS location
  var geoSuccess = function(position) {
    startPos = position;
    console.log(startPos.coords.latitude);
    console.log(startPos.coords.longitude);
    var marker = new google.maps.Marker({
      position: {lat: startPos.coords.latitude, lng: startPos.coords.longitude},
      map: GLOBAL_MAP,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        strokeColor: '#569bca'
      }
    });
  };
  navigator.geolocation.getCurrentPosition(geoSuccess);
}
