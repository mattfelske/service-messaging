# service-messaging
A simple REST API service that allows the user to perform CRUD operations on a messages database collection.


### REQUIREMENTS
_In order to test the application locally, you will need to have the following minimum requirements met._

1. Node.JS (8.9.4)
2. NPM (5.5.1)
3. MongoDB (3.4.9)
4. Redis (3.2.100)


### ARCHITECTURE
The stack is based primarily on NodeJS for the backend, and React for the frontend. I also identified that in order to push update the client side dynamically, I would need to include Websockets, via socket.io, in order to push down new messages to all connected users.  I also wanted to find a way to track unique users, and the initial thought was to not go down the path of username/password, login email, etc. Instead I decided that through the use of sessions we could identifier new users, allows themself to create a "user account" for that particular session. I've done session management through using Redis, so it seemed like the simplest approach.

![alt text](https://github.com/mattfelske/service-messaging/blob/master/public/img/high-level-arch.png "High Level Architecture")


In terms of tracking the messages, I decided that we were going to need two collection to start with.

![alt text](https://github.com/mattfelske/service-messaging/blob/master/public/img/uml.png "Database Collections")

By tracking the User in the messages collection, we allow ourselves to query messages per user, and identify (in the future) who is allowed to delete which message.

With regards to updating active users with message updates, we can acccomplish this by using the following examples.


![alt text](https://github.com/mattfelske/service-messaging/blob/master/public/img/seq-create.png "Creating Messages")

![alt text](https://github.com/mattfelske/service-messaging/blob/master/public/img/seq-del.png "Deleting Messages")


### API ENDPOINTS

> GET /v1/message?id
```
Parameters
+ id: optional. references the mongodb _id of the document.
Returns
200: [{Message}}]
400: {msg: String}
500: {msg: String}
```
> POST /v1/message
```
BODY
+ text: String A required field
RETURNS
201: {Message}
400: {msg: String}
500: {msg: String}
```

> PUT /v1/message
```
Parameters
+ id: required. references the mongodb _id of the document.
Body
+ text: String A required field
Returns
200: {Message}
400: {msg: String}
500: {msg: String}
```
> DELETE /v1/message?id
```
Parameters
+ id: required. references the mongodb _id of the document.
Returns
200: {Message}
400: {msg: String}
500: {msg: String}
```

### HOW TO
_If you have any issues building, deploying or accessing the application, please reach out and let me konw. At this time the application will be running in developement mode. ._

1. Download the repository
> git clone https://github.com/mattfelske/service-messaging.git

2. Install NPM dependencies
> npm install

3. Build the application
> npm run build

4. Launch the application
> npm start
  
The application can be reached on http://localhost;8001, or online at http://test-jeragroup.ca:8001.
_Please note that Chrome is netorious for redirecting to https, but Chrome still works in Incognito mode.


### TO DOs
- [x] Allows users to submit/post messages
- [x] Lists received messages (Locally)
- [x] Retreives a specific message on demand, and dtermines if it is a palindrome
- [x] Allows users to delete specific messages (Currently allows any user to delete any message
- [x] Shows the list of messages posted by the users
- [x] Allows to post new messages
- [x] Allows to select a given message to see extra details
- [ ] Add user support to messages (need to resolve sessionID cookie generation) 
- [ ] Add WebSocket support so that multiple users connected at the same time can updated the DB and the UI simultaneously
- [ ] Fix express session implementation to allow for user creation (requires modal for first time user/session)
- [ ] Mocha/Chair Test case suite for testing endpoints and functions. (Specifically palindrome utility function)
- [ ] Containerize the application using Docker
- [ ] Update configuration management to be dynamic based on environment.
- [ ] Improve loggin implementation 
- [ ] Front end implementation of user functionality



