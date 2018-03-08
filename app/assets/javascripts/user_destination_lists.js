// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

document.addEventListener('DOMContentLoaded', function() {

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

    // Google Map does work
    handler = Gmaps.build('Google');
    handler.buildMap({ provider: {
        zoom:      2,
        center:    new google.maps.LatLng(53.385873, -1.471471),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapStyle
    }, internal: {id: 'map'}}, function(){
       handler.fitMapToBounds();
    });

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
                    handler.addMarkers([
                      { lat: data.geobyteslatitude, lng: data.geobyteslongitude, infowindow: city }
                    ]);
                }
            );
        }
    }

});
