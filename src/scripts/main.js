(function() {
  var apiString = 'https://www3.septa.org/hackathon/TransitView/48';
  /*
  apiJsonObj = {"bus": [
    {
      "lat":"39.953201",
      "lng":"-75.15286999999999",
      "label":"7396",
      "trip":"959387",
      "VehicleID":"7396",
      "BlockID":"5443",
      "Direction":"NorthBound",
      "destination":"27th-Allegheny",
      "late":3,
      "Offset":"1",
      "Offset_sec":"38"
    },
    {
      "lat":"40.003578",
      "lng":"-75.173851",
      "label":"7410",
      "trip":"959384",
      "VehicleID":"7410",
      "BlockID":"5441",
      "Direction":"NorthBound",
      "destination":"27th-Allegheny",
      "late":0,
      "Offset":"2",
      "Offset_sec":"118"
    },
    {
      "lat":"39.969727",
      "lng":"-75.174774",
      "label":"7401",
      "trip":"959343",
      "VehicleID":"7401",
      "BlockID":"5445",
      "Direction":"SouthBound",
      "destination":"Front-Market",
      "late":1,
      "Offset":"1",
      "Offset_sec":"29"
    }
  ]};
  */
  /*
  $.getJSON(apiString, function(json){
    var bussList = json.data.bus;
    var htmlOutput = '';

    for (var i = 0; i < bussList.length; i++) {
      htmlOutput += '<p>VehicleID: ' + bussList[i].VehicleID + '</p>';
    }
    $('#output').append(htmlOutput);
  })
  .done(function() {
    $('#output').append('<p>Success.</p>');
  })
  .fail(function() {
    $('#output').append('<p>Failed to get data.</p>');
  });
  */

  $.getJSON("https://www3.septa.org/hackathon/TransitView/48?callback=?", function(json){
    console.log(json);
  });

})();
