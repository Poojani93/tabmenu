# Energy consumption monitor

## Getting started

### Run node backend

Restart nodeServer in Services on local machine.
(This MUST be done whenever there is a change in the file 'database.js' inside BACKEND folder)

### Run react frontend

```bash
# Start the development server
$ npm start
```

#### Change backend running port

Go to 'database.js' inside BACKEND folder, scroll down to the bottom of the file and change 'port' variable to a desired port. Current port is 5005.

```bash
const port = process.env.PORT || 5005;
```

#### Change frontend running port
Go to '.env' file and change the port to a desired port. Current port is 3005.

```bash
PORT=3005;
```

### Notes

*All front end files are in src folder.

*All backend files are in BACKEND folder.

*API -> database.js

**Do not change project location in the local machine as the windows service(nodeServer) is addressing the current location.

*If the current location is changed. Do the following steps.

#### Adding new windows server

Open project in Visual Studio Code

Open BACKEND folder

Delete deamon folder

Write click on database.js file and Copy path

Open nodeService.js file

Paste it infront of 'script'. Change '\' to '\\' in path.

Change 'name'

Open terminal

Go to BACKEND folder and run the following command

```bash
node ./nodeService.js
```
Make sure a deamon folder is generated inside BACKEND folder

Open Windows services and start the new server





