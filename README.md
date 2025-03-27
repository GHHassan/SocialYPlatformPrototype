# SocialY Application instructions

* This document provides necessary information and guidence about how to install and use the prototype locally on your personal computer.
## pre requisites
1. you need Node Package Manage (npm) installed on your device
2. you need access to terminal (Mac), powershell or command prompt (windows)
3. you need a browser to open the application

* The kf6003API directory in this folder is only for demonstrating the code base. 
* This API is already hosted to nuWebspace and linked the front end of the application.
* No hosting is required for experiencing this application.
* Should you wish to serve the API on your server you need to follow below steps 
* Otherwise continue to the local installation process

### steps to host the API on a server
1. Download and unzip the kf6003API subdirectory including the .htaccess file
2. upload the folder on root directory of your server i.e public_html
3. Open config.jsx file which can be found in KF6003/App/src/congig.jsx
4. replace the URI with the URI of your server 
```
export const API_ROOT = 'https://w20017074.nuwebspace.co.uk/kf6003API'; // replace with below
export const API_ROOT = "your server's URI/kf6003API";
``` 

## Locally installation process
1. unzip the folder KF6003 containing the projects application
2. open a terminal 
3. navigate to the folder
4. run the following commands

```
cd App
npm install
npm run dev
```
5. open the local host on port 5173/kf6003 (http://localhost:5173/kf6003/)
6. you can then use the application

for any further information contact the developer gh.hassan07@gmail.com

@Author
Hassan Hassani
