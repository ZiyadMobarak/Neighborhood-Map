/**
 * Type: Model
 *
 * This is the model for the list view.
 * It is so simple. It takes all the nearby places passed by the ViewModel and store it in an observable object this.places
 * that will be binded in the HTML using Knockout library.
 */
function leftListOptions(places) {
  var self = this;
  self.places = ko.observableArray(places);

  self.replaceList = function(markers) {
    var places = [];

    //Prepare the new list to replace the old one
    for (var i = 0; i < markers.length; i++) {
      places.push({
        'name': markers[i].title,
      });
    }

    //Replace the view list with the new list
    self.places(places);
  }
}