
# Neighborhood Map
---

## Get Started
All the code is available by [clicking here.](https://github.com/ZiyadMobarak/Neighborhood-Map)
You can access the running website through the following link:
https://ziyadmobarak.github.io/Neighborhood-Map/

##### How To Open The Website Locally
There are two ways to host the code locally on your machine:-
- Method#1: Download source code and open main page as follows:
  1. Go to https://github.com/ZiyadMobarak/Neighborhood-Map
  2. Click on **"Clone or download"**
  3. Click on **"Download ZIP"**
  4. Go the folder where you've downloaded the source code.
  5. Unzip the files
  6. Open **"index.html"**
  7. Start using the application :)

  
- Method#2: Download source code and host locally (for MAC users only):-
  1. Start a terminal session on your machine
  2. Type in the following command to start up your Local Apache Server:
     `sudo apachectl start`
  3. Do steps 1-5 from method#1
  4. Copy all the source code from the current path to the following path: _/Library/WebServer/Documents_
  5. Open any browser on your machine.
  6. Go to the following url "**localhost**". Simply type _localhost_ in the url section and click enter.
  7. Start using the application :)


## About The Website
Once you open the website, it will ask for a permission to access your current location. If you didn't accept, the map will be centered on the location of Udacity-Connect where I take my nanodegree classes.  

Beside **Google APIs**, a third-party (**Wikipedia**) has been used to retrieve more data about the place you are interested in. The **Wikipedia** links will be shown in the infoWindow above any selected marker. _If after 8 seconds, no results were fetched from **Wikipedia** an error message will be printed in the infoWindow above the marker_.

## The Project Rubric
The following requirements have been tested:-
- **Interface Design:** The website is responsive and usable in all platform (desktop, tablets, phones ..etc.)
- **App Functionality:** The map, filter and markers functionalities are all working properly without errors. Three errors are anticipated and all were handled well:
  1. User not authorizing browser to access current location **=>** A default location will be set and console.log() will print that you need to authorize the website.
  2. The browser doesn't support _GEOLOCATION_ **=>** A default location will be set and console.log() will print that your browser doesn't support _GEOLOCATION_.
  3. _Wikipedia_ doesn't return results **=>** After 8 seconds, a message will be displayed in the infoWindow that couldn't fetch results from _Wikipedia_.
- **App Architecture:** The code is properly separated following the **MVVM** methodology using **Knockout**. _DOM_ is not getting updated through jQuery or JS code at all. _All the list view updates are happening through binding data between DOM and the Observable object_.
- **Asynchronous Data Usage:** All data are retrieved asynchronously and all anticipated errors were caught from both **Google API** and **Wikipedia** as mentioned previously.
- **Location Details Functionality:** All the Functionality related to the locations details is working properly. The location details will be shown on an infoWindow above the selected marker. You can get location details using one of two ways:  
  1. Clicking on the option from the list view
  2. Clicking on the marker itself
- **Documentation:** I've followed the known conventions when writing my code. I've documented everything my not be clear to you in the code. Finally I've wrote this _README_ that hopefully will help you in evaluating the project.

## About The Code
I must acknowledge that code is written with the help of _udacity_ videos available in _advanced JavaScript Course._

The code is well documented, and hopefully, you won't face an issue going through the code.

---
**I hope you find some interesting places around you :)**
