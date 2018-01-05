/**
 * Type: View
 *
 * This is the view for the application that will be the focul point with the HTML Page.
 * It is so simple. It only captures the clicks from the binded DOM by Knockout (The options list)
 */
var view = {

  //---------------------------------------------------------------------------------------------
  //The method will be called by Knockout when the option in the list is clicked
  //---------------------------------------------------------------------------------------------
  optionClicked: function(item, event) {
    var theChosenPlace = $(event.currentTarget).text();
    var markerChosen = ViewModel.findMarker(theChosenPlace);
    ViewModel.populateInfoWindow(markerChosen, nearByPlaces.infoWindow);
  }
  //---------------------------------------------------------------------------------------------
  //End of optionClicked() method
  //---------------------------------------------------------------------------------------------

}