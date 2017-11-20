function initMap() {
  var DEV_MODE = true;
  var ROOT_PATH = 'https://jwhite052.github.io/philly-commuter-app';
  var KML_ROOT_PATH = 'https://jwhite052.github.io/philly-commuter-app';
  if (DEV_MODE === true) {
    ROOT_PATH = '';
  }

  function View(model) {
    console.log("View init");
    this._model = model;
    this.markersArr = [];

    var _self = this;

    this.appMap = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.0556365, lng: -75.1},
      zoom: 10,
      minZoom: 9,
      maxZoom: 16,
      mapTypeControl: false,
      streetViewControl: false,
      clickableIcons: false
    });
  }
  View.prototype.setBusMarkers = function() {
    var _self = this;

    var response = _self._model.busDataResponse;
    var map = _self.appMap;
    // var mapCenter = map.getCenter();
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
      // store markers in array
      _self.markersArr.push(marker);
    }
    // map.setCenter(mapCenter);
  };
  View.prototype.clearBusMarkers = function() {
    var _self = this;

    for (var i = 0; i < _self.markersArr.length; i++) {
      _self.markersArr[i].setMap(null);
    }
    _self.markersArr = [];
  };
  View.prototype.setMapRouteLines = function(busroute) {
    var _self = this;

    console.log("Adding KML layer");
    var map = _self.appMap;
    var routeLayer = new google.maps.KmlLayer({
      // url: KML_ROOT_PATH + '/src/kml/' + busroute + '.kml',
      url: 'http://www3.septa.org/transitview/kml/' + busroute + '.kml',
      map: map,
      preserveViewport: true
    });
  };

  // var responseHandler = function(response) {
  //   successAPIRequest(response);
  // };

  // var getBusData = function(responseHandler) {
  //   // Fetch bus data
  //   $.ajax({
  //       url: 'https://www3.septa.org/api/TransitView/?route=48&callback=?',
  //       dataType: 'jsonp',
  //       success: function(response){
  //         responseHandler(response);
  //         successAPIRequest(appMap, response);
  //       }
  //   });
  // };

  function Model(controller) {
    this._controller = controller;
    console.log("Model init");
    console.log("Model controller: ");
    console.log(this._controller);
    this._self = this;

    this.busDataResponse;
  }
  // Model.prototype.successAPIRequest = function(map, response) {
    // navigator.geolocation.getCurrentPosition(function(position) {
    //   console.log(position);
    //   startPos = position;
    //   console.log(startPos.coords.latitude);
    //   console.log(startPos.coords.longitude);
    //   var marker = new google.maps.Marker({
    //     position: {lat: startPos.coords.latitude, lng: startPos.coords.longitude},
    //     map: map,
    //     icon: {
    //       path: google.maps.SymbolPath.CIRCLE,
    //       scale: 5,
    //       strokeColor: '#569bca'
    //     }
    //   });
    // });
  //   setBusMarkers(map, response);
  //   setMapRouteLines(map);s
  // };
  Model.prototype.setBusData = function(busroute) {
    var _self = this;
    // Fetch bus data
    $.ajax({
        url: 'https://www3.septa.org/api/TransitView/?route=' + busroute + '&callback=?',
        dataType: 'jsonp',
        success: function(response){
          console.log("setBusData");
          _self.busDataResponse = response;
          // console.log(response);
          // this._controller.updateBus().bind(this);
          _self._controller.updateBus(busroute);
          // _self.
          //successAPIRequest(appMap, response);
        }
    });
  };

  function Controller(model, view) {
    console.log("Controller init");
    this._model = model;
    this._view = view;

    var _self = this;
  }
  Controller.prototype.updateBus = function(busroute) {
    var _self = this;
    // updates the bus based on time interval
    // this._view.setMapRouteLines();
    _self._view.setBusMarkers(busroute);

    console.log("Update bus");
  };

  var initApp = function() {
    var appModel;
    var appView;
    var appController;

    appModel = new Model(appController);
    appView = new View(appModel);
    appController = new Controller(appModel, appView);

    appModel._controller = appController;

    console.log("appModel._controller: ");
    console.log(appModel._controller);
    console.log("appController: ");
    console.log(appController);
    // Business logic
    // appModel.setBusData('48');
    appView.setMapRouteLines('48');
    setInterval(function(){
      appView.clearBusMarkers();
      appModel.setBusData('48');
    }, 5000);
    // appView.setBusMarkers();
  };

  // Start application
  initApp();
}
