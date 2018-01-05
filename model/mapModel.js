/**
 * Type: Model
 *
 * This is the model for the data related to the map and the markers.
 * It store the following:
 *      1- The Map
 *      2- The list of all markers
 *      3- The only available infoWindow
 *      4- The filtered maerkers (a list will hold the list of markers after you apply the filter)
 *      5- The radius used for searching for nearby places
 */
var nearByPlaces = {
  //---------------------------------------------------------------------------------------------
  //The variables stored in the nearByPlaces Model that will be used by the ViewModel
  //---------------------------------------------------------------------------------------------
  'map': null,
  'infoWindow': null,
  'markers': [], //All nearby markers
  'filteredMarkers': [], //Only the filtered markers
  'radius': 3000, //Search radius (3km)
  //---------------------------------------------------------------------------------------------
  //End of variables
  //---------------------------------------------------------------------------------------------


  //---------------------------------------------------------------------------------------------
  //This method hides the passed markers in arguments from the maps
  //---------------------------------------------------------------------------------------------
  hideMarkers: function(markers) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  },
  //---------------------------------------------------------------------------------------------
  //End of hideMarkers() method
  //---------------------------------------------------------------------------------------------


  //---------------------------------------------------------------------------------------------
  //This method closes the only opened up infoWindow - if it is opened -
  //---------------------------------------------------------------------------------------------
  closeInfoWindow: function() {
    //Close and clear the current info InfoWindow
    nearByPlaces.infoWindow.close();
    nearByPlaces.infoWindow.marker = null;
  },
  //---------------------------------------------------------------------------------------------
  //End of closeInfoWindow() method
  //---------------------------------------------------------------------------------------------


  //---------------------------------------------------------------------------------------------
  //This method bounces the passed marker in the map
  //---------------------------------------------------------------------------------------------
  bounceMarker: function(marker) {
    nearByPlaces.removeAllAnimations();
    marker.setAnimation(google.maps.Animation.BOUNCE);
  },
  //---------------------------------------------------------------------------------------------
  //End of bounceMarker() method
  //---------------------------------------------------------------------------------------------


  //---------------------------------------------------------------------------------------------
  //This method removes all animations from all markers (make all markers static)
  //---------------------------------------------------------------------------------------------
  removeAllAnimations: function() {
    for (var i = 0; i < nearByPlaces.markers.length; i++) nearByPlaces.markers[i].setAnimation(null);
  }
  //---------------------------------------------------------------------------------------------
  //End of removeAllAnimations() method
  //---------------------------------------------------------------------------------------------
}