# **QUIZ APP**

## OVERVIEW

The web application is a quiz application. The intended users who will benefit from the application are individuals who enjoy quiz games for recreational purposes. The application is written using MERN stack which is a popular open source JavaScript-based developer friendly web stack. MERN stack uses MongoDB (a NoSQL database), to handle the database, React.js to create the front-end, Express.js to create the backend and uses Node.js as the runtime environment.


## TABLE OF CONTENTS
1. [OVERVIEW](#overview)
2. [HOW TO USE THE APPLICATION](#how-to-use-the-application)
3. [HOW TO RUN THE APPLICTION](#how-to-run-the-application)
4. [REQUESTS](#requests)
5. [REFERENCES](#references)

## HOW TO USE THE APPLICATION

To use the application users are required to register(sign up) and login. Users are also able to register as admin users subject to certain age restrictions controlled by custom middleware. After login users are able to add quizzes and play quizzes. Users are also able to edit their user account.

The application also allows users to edit and delete quizzes subject to certain requirements based on whether the user is a normal endpoint or an admin user. Admin users are allowed certain privileges such as the ability to edit or delete any quiz and also view all users and remove users.

## HOW TO RUN THE APPLICATION

A proxy server is included in the front-end to allow the front and back-end to run together. The application uses ‘nodemon’ third-party middleware in the backend to allow the application to run the backend and front-end in the command line interface(CLI) or terminal using npm start. The folders must, however, be run separately. The server is started (listens) on the port specified in the .env file using app.listen() in the app.js file or defaults to Port 3001.

The application is connected to the MongoDB database using mongoose third-party middleware in the app.js file in the back end (server) folder. The code uses mongoose.connect() to establish a connection between the application and the MongoDB database.

The MongoDB connection URI is constructed using the username, password, cluster URL and the database name. These are stored as environmental variables in the .env file. The .env file is configured using dotenv middleware.

The application is connected to the MongoDB database using mongoose third party middleware in the backend. The code uses mongoose.connect() to connect to establish a connection with the MongoDB database.

The MongoDB connection URI is constructed using the username, password, cluster URL and the database name. these are stored in the .env file which stores sensitive information. The application does not include any third-party API. All API requests in the application are REST API requests made from the front end to the backend.
## CONNECTION

## DNS CONNECTION 

## APPLICATION FEATURES

## APPLICATION SECURITY

### PASSWORD HASHING
## REQUESTS

| **HTTP verb** | **CRUD OPERATION** | **DESCRIPTION**|
|--------|-------|------|
| POST| CREATE| Used to submit data about a specific entity to the server |
| GET |READ |Used to fetch `GET` information from the database|
|PUT | UPDATE| Updates data on the database |
|DELETE | DELETE | Deletes a specific resource |

The application also uses  `PATCH` requests to update a resource. In comparison with `PUT`, a `PATCH` serves as a set of instructions for modifying a resource, whereas PUT represents a complete replacement of the resource. 

### USER
Base path: `/users`

#### GET
- `GET /users/me` - Get current user details *(requires JWT)*
- `GET /users/findUsers` - Get all users or filter by username *(requires JWT)*

#### POST
- `POST /users/login` - User login; returns JWT token
- `POST /users/register` - Register a new user *(requires valid password strength)*

#### PATCH
- `PATCH /users/editUser/:id` - Update user profile (username, fullName, email)
- `PATCH /users/editPassword` - Change user password *(requires JWT)*

#### DELETE
- `DELETE /users/deleteUser/:id` - Delete a user *(requires JWT, admin only)*

---

### QUIZ
Base path: `/quizzes`

#### GET
- `GET /quizzes/findQuizzes` - Get all quizzes *(requires JWT)*
- `GET /quizzes/findQuiz/:id` - Get a specific quiz by ID *(requires JWT)*

#### POST
- `POST /quizzes/createQuiz` - Create a new quiz *(requires JWT)*

#### PUT
- `PUT /quizzes/editQuiz/:id` - Full update of a quiz *(requires JWT, creator or admin only)*

#### PATCH
- `PATCH /quizzes/updateQuiz/:id` - Partial update of a quiz *(requires JWT, creator or admin only)*

#### DELETE
- `DELETE /quizzes/deleteQuiz/:id` - Delete a quiz *(requires JWT, creator or admin only)*

---

### SCORES
Base path: `/scores`

#### GET
- `GET /scores/fetchScores` - Get all scores, optionally filtered by username *(requires JWT)*
- `GET /scores/findScores/:username` - Get all scores for a specific user
- `GET /scores/findScore/:username/:quizTitle` - Get a specific score for a user and quiz

#### POST
- `POST /scores/submitScore` - Submit a new quiz score

#### PUT
- `PUT /scores/updateScore/:id` - Update an existing score if new score is higher *(requires JWT)*



## REFERENCES

- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PATCH
- https://mongoosejs.com/docs/api/query.html#Query.prototype.exec()
- https://mongoosejs.com/docs/api/query.html#Query.prototype.populate()
