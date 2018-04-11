// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

document.addEventListener('DOMContentLoaded', function() {

    // Lookup list for marker
    var lookup = [];

    // Helper function to see if a marker already exists at a spot
    function isLocationFree(search) {
      for (var i = 0, l = lookup.length; i < l; i++) {
        if (lookup[i] === search) {
          return false;
        }
      }
      return true;
    }

    function postRequest(route, dataSent) {
      $.ajax({
          url: "/" + route,
          type: "POST",
          data: dataSent,
          success: function(resp){ }
      });
    }

    // Snazzy Maps Styling
    var mapStyle = [
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "saturation": 36
                },
                {
                    "color": "#000000"
                },
                {
                    "lightness": 40
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#000000"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 17
                },
                {
                    "weight": 1.2
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 21
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 17
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 29
                },
                {
                    "weight": 0.2
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 18
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 19
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 17
                }
            ]
        }
    ]

    var mapOptions = {
      center: { lat: 45.3914, lng: -75.659 },
      streetViewControl: false,
      disableDefaultUI:true,
      zoom: 2,
    };

    const map = new google.maps.Map(document.getElementById('map'),mapOptions);
    map.setOptions({styles: mapStyle});

    // Destination Input AutoComplete
    $("#destinationInput").autocomplete({
        source: function(request, response) {
            // request contains the term we have typed
            $.getJSON(
                "http://gd.geobytes.com/AutoCompleteCity?callback=?&q=" + request.term,
                function(data) {
                    response(data);
                }
            );
        },
        // Minimum characters for destination suggestions
        minLength: 4,
        select: function(event, ui) {
            // We assign the item we click on
            var selectedObj = ui.item;
            $("#destinationInput").val(selectedObj.value);
            addPin(selectedObj.value);
            return false;
        },
        open: function () {
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close: function () {
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        }
    });

    // Delay occurs in ms when keystroke occurs when a search is performed
    $("#destinationInput").autocomplete("option", "delay", 100);

    // Add Pin to City on the Map
    function addPin(city) {
        if(typeof city == "undefined") {
            city = $("#destinationInput").val();
        }

        if(city) {

            $.getJSON(
                "http://gd.geobytes.com/GetCityDetails?callback=?&fqcn=" + city,
                function(data) {
                  // check session
                  if (typeof email === 'undefined') {
                      // the user is logged in
                      return;
                  }
                    // If marker already exists on map, don't place it
                    //const search = [data.geobyteslatitude, data.geobyteslongitude];
                    if(!isLocationFree(city)) {
                        return;
                    }

                    // Generate marker
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(data.geobyteslatitude, data.geobyteslongitude),
                        map: map,
                        animation: google.maps.Animation.DROP,
                        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        title: city
                    });

                    // Push it to the list
                    //lookup.push([data.geobyteslatitude, data.geobyteslongitude]);
                    lookup.push(city);

                    marker.color = true;

                    // String for infoWindow - includes formatting
                    const cityString = '<h3 style="color:black;">' + city + '</h3>';

                    // InfoWindow definition
                    var infowindow = new google.maps.InfoWindow({
                      content: cityString
                    });

                    // Attach hover event for window popup
                    marker.addListener('mouseover', function() {
                        infowindow.open(map, this);
                    });

                    // Hover off, close the infowindow
                    marker.addListener('mouseout', function() {
                        infowindow.close();
                    });

                    marker.addListener('dblclick', function() {
                        // Remove it physically from the map
                        this.setMap(null);
                        // Remove it from our internal list
                        for (var i = 0, l = lookup.length; i < l; i++) {
                          if (lookup[i] === this.title) {
                            lookup[i] = null;
                          }
                        }
                    });

                    // If we click the marker, we can switch from visited to will visit
                    marker.addListener('click', function() {
                      if(marker.color) {
                        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
                        marker.color = false;

                        if (typeof email !== 'undefined') {
                            dataSent = {
                                user: {
                                    id: id
                                },
                                destination: {
                                    city: city,
                                    status: "visited"
                                }
                            };
                            postRequest('user_destination_lists/status', dataSent);
                        }
                      } else {
                        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
                        marker.color = true;

                        if (typeof email !== 'undefined') {
                            dataSent = {
                                user: {
                                    id: id
                                },
                                destination: {
                                    city: city,
                                    status: "not visited"
                                }
                            };
                            postRequest('user_destination_lists/status', dataSent);
                        }
                      }
                    });

                    if (typeof email !== 'undefined') {
                        $.ajax({
                            url: "/user_destination_lists",
                            type: "POST",
                            data: {destination: {
                                     city : city,
                                     lat: data.geobyteslatitude,
                                     long: data.geobyteslongitude },
                                   user: {
                                     id: id,
                                     email: email
                                   }},
                            success: function(resp){ }
                        });
                    }
                }
            );
        }
    }

});
