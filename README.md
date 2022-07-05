# Energy consumption monitor

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

From your command line, first clone Dev Portfolio:

```bash
# Clone the repository
https://github.com/Poojani93/tabmenu.git

# Move into the repository
cd tabmenu

# Remove the current origin repository
git remote remove origin
```

After that, you can install the dependencies using npm.

Using NPM: Simply run the below commands.

```bash
# Install dependencies
$ npm i
```

### Run node backend

Restart nodeServer in Services on local machine.
(This MUST be done whenever there is a change in the file 'database.js')

### Run react frontend

```bash
# Start the development server
$ npm start
```

#### Change backend running port

Go to 'database.js', scroll down and at the end of the file change 'PORT' variable to a desired port. Current port is 5005.
```bash
const port = process.env.PORT || 5005;
```

#### Change frontend running port
Go to '.env' file and change the port to a desired port.

### Notes
*Front end files are in src folder.
*Backend files are in BACKEND folder.
*API -> database.js
**Do not change project location in the local machine as the windows service(nodeServer) is addressing the current location.
*If the current location is changed. Do the following steps.
    Open project in Visual Studio Code
    Open BACKEND folder
    Delete deamon folder
    Write click on database.js file and Copy path
    Open nodeService.js file
    Paste it infront of 'script'
    Change 'name'
    Open terminal
    Go to BACKEND folder and run the following command
    ```bash
    node ./nodeService.js
    ```
    Open Windows services and start the new server



