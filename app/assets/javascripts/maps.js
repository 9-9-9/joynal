function initializeJournalMap(json_array) {

  var myLatLng = new google.maps.LatLng(43.397, -87.644);

  var mapOptions = {
    zoom: 2,
    center: myLatLng
  };

  var map = new google.maps.Map($("#map-canvas")[0],
      mapOptions);

  json_array.forEach(function(journalEntry, i) {

    var contentString = "<div><h3>"+journalEntry.date+"</h3><a class='user-entry' data-remote='true' href='/journal_entries/"+journalEntry.id+"'>"+journalEntry.content.substring(0,50)+"...</a></div>";

    var infoWindow = new google.maps.InfoWindow({
      content: contentString
    });

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(journalEntry.latitude, journalEntry.longitude),
      map: map,
      animation: google.maps.Animation.DROP,
      title: journalEntry.content
    });

    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open(map, this);
    });
  });

}

function getCoords() {
  $.ajax({
    url: '/journal_entries/get_coords',
    type: 'GET',
    dataType: 'json',
    complete: function(response) {
      initializeJournalMap($.parseJSON(response.responseText));
    }
  });
}

function initializeHeatMap(json_array) {
  console.log("FUCK!!")

  var heatMapData;
  var chicago;
  var map;
  var heatMap;

  heatMapData = []

  json_array.forEach(function(journalEntry, i) {
    coord = new google.maps.LatLng(journalEntry.latitude, journalEntry.longitude)
    heatMapData.push(coord)
  });

  chicago = new google.maps.LatLng(47.774546, -87.55);

  map = new google.maps.Map(document.getElementById('heat-map-canvas'), {
    center: chicago,
    zoom: 13
  });

  heatMap = new google.maps.visualization.HeatmapLayer({
    data: heatMapData
  });

  heatMap.setMap(map);

}

function getAllJournalEntries () {
  $.ajax({
    url: '/journal_entries/get_all_journal_entries',
    type: 'GET',
    dataType: 'json',
    complete: function(response) {
      initializeHeatMap($.parseJSON(response.responseText))
    }
  });
}

function showMap() {
  $('.show-map').on('click', function(e) {
    e.preventDefault();
    $.ajax({
      url: '/journal_entries/map',
      type: 'GET',
      complete: function(response) {
        $('div.partial').html(response.responseText);
        getCoords();
        getAllJournalEntries();
      }
    });
  });
}


$(document).ready(function() {
  showMap();
})

$(document).on('page:load', function() {
  showMap();
})