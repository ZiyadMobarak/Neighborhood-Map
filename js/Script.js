/**
 * Name: Ziyad M. AlGhamdi
 * Google API Key: AIzaSyCaKgSGppIUdnENhWDrA-cgpRgsRZLy7NE
 * Google API Key Server Side: AIzaSyBWn6blfUvNMRBcDccvI2MbRs4Wzit2dHI
 */

//List of TODO :-
//TODO Testing
//TODO Upload online Github
//TODO Create View Model ViewModel
//TODO Relate options to Knockout

/**
 * Test a new model
 */
function leftListOptions(places) {
  this.places = places;
}
// ko.applyBindings(new leftListOptions());

/**
 * The Model (All data will be stored here)
 */
var nearByPlaces = {
  'map': null,
  'infoWindow': null,
  'markers': [], //All nearby markers
  'filteredMarkers': [], //Only the filtered markers
  'radius': 3000, //Search radius (3km)

  //This method hides the passed markers in the maps
  hideMarkers: function(markers) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  },

  //This method closes the opened InfoWindow
  closeInfoWindow: function() {
    //Close and clear the current info InfoWindow
    nearByPlaces.infoWindow.close();
    nearByPlaces.infoWindow.marker = null;
  },

  bounceMarker: function(marker) {
    nearByPlaces.removeAllAnimations();
    marker.setAnimation(google.maps.Animation.BOUNCE);
  },

  removeAllAnimations: function() {
    for (var i = 0; i < nearByPlaces.markers.length; i++) nearByPlaces.markers[i].setAnimation(null);
  }
}

/**
 * The View (Responsible for manipulating the HTML)
 */
var view = {
  printNearbyPlaces: function(markers) {
    //Remove all the children nodes (all the shown results to reprint them)
    // var optionsList = document.getElementById('nearby-results');
    // optionsList.innerHTML = '';
    //
    // //Print all the markers in the filter list using the taken template
    // for (var i = 0; i < markers.length; i++) {
    //   var tmpl = document.getElementById('filter-template').content.cloneNode(true);
    //   tmpl.querySelector('.one-result').innerText = markers[i].getTitle();
    //   optionsList.appendChild(tmpl);
    // }

    //Append a listener to all the options shown in the left of the map

    //TODO the following block if managed to append event listenere
    // $(".one-result").click(function() {
    //   var markerChosen = ViewModel.findMarker($(this).text());
    //   ViewModel.populateInfoWindow(markerChosen, nearByPlaces.infoWindow);
    // });
  },

  optionClicked: function(item, event) {
    var theChosenPlace = $(event.currentTarget).text();
    var markerChosen = ViewModel.findMarker(theChosenPlace);
    ViewModel.populateInfoWindow(markerChosen, nearByPlaces.infoWindow);
  }
}

/**
 * The ViewModel (All the logic will be written here)
 */
var ViewModel = {

  //Initialize Google Map
  initGoogleMap: function() {
    //Jump to the location of our Udacity-Connect Class
    nearByPlaces.map = new google.maps.Map(document.getElementById("map"), {
      center: {
        lat: 26.309226,
        lng: 50.175451
      },
      zoom: 16
    });

    //Initiate the only InfoWindow
    nearByPlaces.infoWindow = new google.maps.InfoWindow;

    //Jump to current location (requires user approval to share location)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        nearByPlaces.infoWindow.setPosition(pos);
        nearByPlaces.infoWindow.setContent('Location found.');
        nearByPlaces.infoWindow.open(nearByPlaces.map);
        nearByPlaces.map.setCenter(pos);

        ViewModel.initialNearbyFilterPlaces();
        view.printNearbyPlaces(nearByPlaces.markers);
      }, function() {
        ViewModel.handleLocationError(true, nearByPlaces.infoWindow, nearByPlaces.map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      ViewModel.handleLocationError(false, nearByPlaces.infoWindow, nearByPlaces.map.getCenter());
    }

    //After setting the current location, get the bound of the current map
    var bounds = new google.maps.LatLngBounds();

    //Create an event listener to the filter button
    document.getElementById("filter-button").addEventListener("click", function() {
      ViewModel.nearbyFilterPlaces();
    });
  },

  //This method will find a marker by its name
  findMarker: function(markerTitle) {
    for (var i = 0; i < nearByPlaces.markers.length; i++) {
      var theCheck = nearByPlaces.markers[i].getTitle() == markerTitle;
      if (nearByPlaces.markers[i].getTitle() == markerTitle) {
        nearByPlaces.bounceMarker(nearByPlaces.markers[i]);
        return nearByPlaces.markers[i];
      }
    }
  },

  //This method will be used to populate the infoWindow of a marker
  populateInfoWindow: function(marker, infowindow) {
    if (nearByPlaces.infoWindow.marker != marker) {
      //Close the open window if any
      nearByPlaces.closeInfoWindow();

      //Set the new infoWindow to the chosen marker
      nearByPlaces.infoWindow.marker = marker;

      //Prepare the HTML to be the content of the infoWindow TODO get content for the place
      var tmpl = document.getElementById('infoWindow-template').content.cloneNode(true);
      tmpl.querySelector('.info-window-title').innerText = marker.title;
      tmpl.querySelector('.info-window-text').innerText = "";

      nearByPlaces.infoWindow.setContent(tmpl);
      nearByPlaces.infoWindow.open(nearByPlaces.map, marker);

      //----------------------------------------------------------
      // Getting Wikipedia Articles
      //----------------------------------------------------------
      var wikiURL = "https://en.wikipedia.org/w/api.php";

      //Wikipedia links title in the InfoWindow
      var $wikiElem = $(".info-window-text");
      $wikiElem.text("Getting Wikipedia Links .. Please Wait");

      //Wiki Timeout
      var wikiRequestTimeout = setTimeout(function() {
        var errorWikiHeader = "Failed to Get Wikipedia Resources";
        var $wikiElem = $(".info-window-text");
        $wikiElem.text(errorWikiHeader);
      }, 8000);

      //Preparing the parameter for the URL request
      wikiURL += '?' + $.param({
        'action': 'opensearch',
        'search': marker.title,
        'format': 'json',
        'callback': 'wikiCallback'
      });

      //Issue a JSONP request to Wikipedia
      $.ajax({
        url: wikiURL,
        dataType: "jsonp",
        success: function(response) {
          var articlesList = response[1];
          var $wikiElem = $(".info-window-text");
          if (articlesList.length > 0) $wikiElem.text("Wikipedia Links :-");
          for (var i = 0; i < articlesList.length; i++) {
            //Prepare the list item
            var $articleListItem = $("<li></li>");

            //Get the article title and url and create a <a> and prepare to be appended to the item list
            var articleStr = articlesList[i];
            var articleURL = "https://en.wikipedia.org/wiki/" + articleStr;
            var $articleTitle = $("<a></a>");
            $articleTitle.attr("href", articleURL);
            $articleTitle.text(articleStr);

            //Append the link to the list item, then append the item to the Wiki List
            $articleListItem.append($articleTitle);
            $wikiElem.append($articleListItem);

            //Stop Error timeout upon success
            clearTimeout(wikiRequestTimeout);
          }
        }
      });
      //----------------------------------------------------------
      // End of Getting Wikipedia Articles
      //----------------------------------------------------------

      //Clear the marker when the infoWindow is closed
      nearByPlaces.infoWindow.addListener('closeclick', function() {
        nearByPlaces.removeAllAnimations()
        nearByPlaces.closeInfoWindow();
      });
    }
  },

  //This method create markers for the given places TODO place in the right place
  createMarkersForPlaces: function(places) {
    //Remove all old markers
    nearByPlaces.markers = [];

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < places.length; i++) {
      var place = places[i];
      //Create a marker for each place
      var marker = new google.maps.Marker({
        map: nearByPlaces.map,
        title: place.name,
        position: place.geometry.location,
        id: place.id
      });

      //Add listener to the marker
      marker.addListener('click', function() {
        nearByPlaces.removeAllAnimations(); //TODO new code
        nearByPlaces.bounceMarker(this); //TODO new code
        ViewModel.populateInfoWindow(this, nearByPlaces.infoWindow);
      });

      nearByPlaces.markers.push(marker);


      //Adjust the map to fit all place markers created
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.union(place.geometry.location);
      }
      // map.fitBounds(bounds);
    }

    //Once the markers are created, append to the options list in the left (print the names of all nearby places)
    view.printNearbyPlaces(nearByPlaces.markers);
  },

  //This function will look in certain reange for nearby places TODO in the right place
  initialNearbyFilterPlaces: function() {
    var bounds = nearByPlaces.map.getBounds();
    var mapCenter = nearByPlaces.map.getCenter();
    nearByPlaces.hideMarkers(nearByPlaces.markers); //Hide all the markers shown in the map
    var placesService = new google.maps.places.PlacesService(nearByPlaces.map);
    placesService.nearbySearch({
      location: mapCenter,
      radius: nearByPlaces.radius
    }, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        ViewModel.createMarkersForPlaces(results); //Create markers for all the found places
        ko.applyBindings(new leftListOptions(results)); //TODO KO Bindings
        return results;
      }
    });
  },

  //This method should filter only from the given initial list, not sending a new request
  nearbyFilterPlaces: function() {
    //Close the infoWindow if opened
    nearByPlaces.closeInfoWindow();

    //Get what is in the input field
    var filterInput = document.getElementById("filter-input").value;

    //Loop through all the markers, store the filtered once (if the input is empty, then print all initial markers)
    if (filterInput == "") {
      ViewModel.showFilteredMarkers(nearByPlaces.markers);
      view.printNearbyPlaces(nearByPlaces.markers);
    } else {
      nearByPlaces.filteredMarkers = []; //Clear all the filtered markers list
      for (var i = 0; i < nearByPlaces.markers.length; i++) {
        //Check if the marker title contains the searched keyword
        if (nearByPlaces.markers[i].title.toLowerCase().search(filterInput.toLowerCase()) >= 0) nearByPlaces.filteredMarkers.push(nearByPlaces.markers[
          i]);
      }
      ViewModel.showFilteredMarkers(nearByPlaces.filteredMarkers);
      view.printNearbyPlaces(nearByPlaces.filteredMarkers);
    }
  },

  //Show the filtered markers
  showFilteredMarkers: function(markers) {
    nearByPlaces.hideMarkers(nearByPlaces.markers); //Hide all markers then start shown only the desired markers
    for (var i = 0; i < markers.length; i++) markers[i].setMap(nearByPlaces.map);
  },

  //Handle errors for the location authorization
  handleLocationError: function(supportGeo, infoWindow, mapCenter) {
    if (supportGeo) {
      //User not authorized the browser to access his location \
      console.log("Need authorization to find nearby places");
      ViewModel.initialNearbyFilterPlaces();
      view.printNearbyPlaces(nearByPlaces.markers);
    } else {
      //Browser doesn't support Geolocation
      console.log("Your browser doesn't support ");
      initialNearbyFilterPlaces();
      view.printNearbyPlaces(nearByPlaces.markers);
    }
  }

}