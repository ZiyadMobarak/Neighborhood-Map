/**
 * Name: Ziyad M. AlGhamdi
 * Google API Key: AIzaSyCaKgSGppIUdnENhWDrA-cgpRgsRZLy7NE
 * Google API Key Server Side: AIzaSyBWn6blfUvNMRBcDccvI2MbRs4Wzit2dHI
 *
 * Type: ViewModel (Controller)
 *
 * This is the big elephent in the room. The controller contains all the logic behind the
 * application and it is the middle tier between the views and the models
 */

//TODO further testing
//TODO Documentations
//TODO redirect index.html to hello.html
//TODO all commented out code removed

var ViewModel = {
  //---------------------------------------------------------------------------------------------
  //Knockout binded variables. It is binded to the list view in the HTML and get updated automatically
  //---------------------------------------------------------------------------------------------
  'listView': null,
  //---------------------------------------------------------------------------------------------
  //End of binded variables
  //---------------------------------------------------------------------------------------------


  //---------------------------------------------------------------------------------------------
  //This method does all the required initialzations for the map
  //---------------------------------------------------------------------------------------------
  initGoogleMap: function() {
    //Jump to the location of our Udacity-Connect Class location
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

        //Center the map to the current user location
        nearByPlaces.infoWindow.setPosition(pos);
        nearByPlaces.infoWindow.setContent('Location found.');
        nearByPlaces.infoWindow.open(nearByPlaces.map);
        nearByPlaces.map.setCenter(pos);

        //Get all nearby places, create and place markers for them in the map
        ViewModel.initialNearbyFilterPlaces();
      }, function() {
        //The user didn't authorize the browser to access current location
        ViewModel.handleLocationError(true, nearByPlaces.infoWindow, nearByPlaces.map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      ViewModel.handleLocationError(false, nearByPlaces.infoWindow, nearByPlaces.map.getCenter());
    }

    //After setting the current location, get the bound of the current map
    var bounds = new google.maps.LatLngBounds();
  },
  //---------------------------------------------------------------------------------------------
  //End of initGoogleMap() method
  //---------------------------------------------------------------------------------------------


  //---------------------------------------------------------------------------------------------
  //This method finds the desired marker by its name (will be used when the user clicks on one of the list options)
  //---------------------------------------------------------------------------------------------
  findMarker: function(markerTitle) {
    for (var i = 0; i < nearByPlaces.markers.length; i++) {
      var theCheck = nearByPlaces.markers[i].getTitle() == markerTitle;
      if (nearByPlaces.markers[i].getTitle() == markerTitle) {
        nearByPlaces.bounceMarker(nearByPlaces.markers[i]);
        return nearByPlaces.markers[i];
      }
    }
  },
  //---------------------------------------------------------------------------------------------
  //End of findMarker() method
  //---------------------------------------------------------------------------------------------


  //---------------------------------------------------------------------------------------------
  //This method populates the infoWindow above the desired marker
  //---------------------------------------------------------------------------------------------
  populateInfoWindow: function(marker, infowindow) {
    if (nearByPlaces.infoWindow.marker != marker) {
      //Close the open window if any
      nearByPlaces.closeInfoWindow();

      //Set the new infoWindow to the chosen marker
      nearByPlaces.infoWindow.marker = marker;

      //Prepare the HTML to be the content of the infoWindow
      var tmpl = document.getElementById('infoWindow-template').content.cloneNode(true);
      tmpl.querySelector('.info-window-title').innerText = marker.title;
      tmpl.querySelector('.info-window-text').innerText = "";

      //Set the title in the infoWindow and open the infoWindow above the desired marker
      nearByPlaces.infoWindow.setContent(tmpl);
      nearByPlaces.infoWindow.open(nearByPlaces.map, marker);

      //Prepare the link to get the Wikipedia links
      var wikiURL = "https://en.wikipedia.org/w/api.php";

      //Initial message telling the user to wait for the results
      var $wikiElem = $(".info-window-text");
      $wikiElem.text("Getting Wikipedia Links .. Please Wait");

      //Wiki Timeout (8 seconds before failing the process)
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
      // End of Getting Wikipedia Articles

      //Clear the marker when the infoWindow is closed
      nearByPlaces.infoWindow.addListener('closeclick', function() {
        nearByPlaces.removeAllAnimations()
        nearByPlaces.closeInfoWindow();
      });
    }
  },
  //---------------------------------------------------------------------------------------------
  //End of populateInfoWindow() method
  //---------------------------------------------------------------------------------------------


  //---------------------------------------------------------------------------------------------
  //This method prepare all the markers for the results obtained from GOOGLE PLACES
  //---------------------------------------------------------------------------------------------
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
        nearByPlaces.removeAllAnimations();
        nearByPlaces.bounceMarker(this);
        ViewModel.populateInfoWindow(this, nearByPlaces.infoWindow);
      });

      //Store the marker in our markers list
      nearByPlaces.markers.push(marker);

      //Adjust the map to fit all place markers created
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.union(place.geometry.location);
      }
    }

  },
  //---------------------------------------------------------------------------------------------
  //End of createMarkersForPlaces() method
  //---------------------------------------------------------------------------------------------


  //---------------------------------------------------------------------------------------------
  //This method requests the nearby places from GOOGLE PLACES web services
  //---------------------------------------------------------------------------------------------
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

        //Activate the bindings
        listView = new leftListOptions(results);
        ko.applyBindings(listView);

        return results;
      }
    });
  },
  //---------------------------------------------------------------------------------------------
  //End of initialNearbyFilterPlaces() method
  //---------------------------------------------------------------------------------------------


  //---------------------------------------------------------------------------------------------
  //This method filters the options list
  //---------------------------------------------------------------------------------------------
  nearbyFilterPlaces: function() {
    //Close the infoWindow if opened
    nearByPlaces.closeInfoWindow();

    //Get what is in the input field
    var filterInput = document.getElementById("filter-input").value;

    //Loop through all the markers, store the filtered once (if the input is empty, then print all initial markers)
    if (filterInput == "") {
      ViewModel.showFilteredMarkers(nearByPlaces.markers);
      listView.replaceList(nearByPlaces.markers);
    } else {
      nearByPlaces.filteredMarkers = []; //Clear all the filtered markers list
      for (var i = 0; i < nearByPlaces.markers.length; i++) {
        //Check if the marker title contains the searched keyword
        if (nearByPlaces.markers[i].title.toLowerCase().search(filterInput.toLowerCase()) >= 0)
          nearByPlaces.filteredMarkers.push(nearByPlaces.markers[i]);
      }
      ViewModel.showFilteredMarkers(nearByPlaces.filteredMarkers);
      listView.replaceList(nearByPlaces.filteredMarkers);
    }
  },
  //---------------------------------------------------------------------------------------------
  //End of nearbyFilterPlaces() method
  //---------------------------------------------------------------------------------------------


  //---------------------------------------------------------------------------------------------
  //This method shows only the passed markers in the map (it will be used when filtering the markers)
  //---------------------------------------------------------------------------------------------
  showFilteredMarkers: function(markers) {
    nearByPlaces.hideMarkers(nearByPlaces.markers); //Hide all markers then start shown only the desired markers
    for (var i = 0; i < markers.length; i++) markers[i].setMap(nearByPlaces.map);
  },
  //---------------------------------------------------------------------------------------------
  //End of showFilteredMarkers() method
  //---------------------------------------------------------------------------------------------


  //---------------------------------------------------------------------------------------------
  //This method handles the errors from locating the users
  //---------------------------------------------------------------------------------------------
  handleLocationError: function(supportGeo, infoWindow, mapCenter) {
    if (supportGeo) {
      //User not authorized the browser to access his location \
      console.log("Need authorization to find nearby places");
      ViewModel.initialNearbyFilterPlaces();
    } else {
      //Browser doesn't support Geolocation
      console.log("Your browser doesn't support ");
      initialNearbyFilterPlaces();
    }
  }
  //---------------------------------------------------------------------------------------------
  //End of handleLocationError() method
  //---------------------------------------------------------------------------------------------
}