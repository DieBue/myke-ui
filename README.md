# myke-ui
This react sample application provides a GUI for the (My Bike) myke-bike service (cf.: https://github.com/DieBue/myke-bike-service).

# Install
## Prereqs
* You need to have nodejs (https://nodejs.org) and yarn (https://yarnpkg.com/) installed on your system.
* You need to have a myke-bike-service running on port 3001

## Install steps
* Clone or download the repo. As a result you will have a `/myke-ui` folder containing all project files.
* Locate and and edit the file `/myke-ui/.env.local` 	  
	* The file already contains values for the `REACT_APP_USER` and `REACT_APP_BIKE_SERVICE_BASE_URL` properties. You can leave those unchanged (or adjust if your myke-bike-service is running somewhere else) 
	* Copy your Google Maps API key to the `apiKey` property in the file and save it.  
* Open command line in `/myke-ui` folder (I will assume a windows cmd shell for this documentation)
* run `yarn install` to download the dependencies and install the app. You should see a message similar to `success Saved lockfile.` at the end.
* run `yarn start` to start the local dev server and launch the Myke UI react app.

You should see a google maps view with several bike markers.


