# **QUIZ APP**

The web application is a quiz application. The intended users who will benefit from the application are individuals who enjoy quiz games for recreational purposes. The application is written using MERN stack which is a popular open source JavaScript-based developer friendly web stack. MERN stack uses MongoDB (a NoSQL database), to handle the database, React.js to create the front-end, Express.js to create the backend and uses Node.js as the runtime environment.

##### ORIGINAL

The current application is an updated version of the following Github Repo:

https://github.com/laraklopper/QUIZ-APPLICATION.git

## TABLE OF CONTENTS

1. [HOW TO USE THE APPLICATION](#how-to-use-the-application)
2. [HOW TO RUN THE APPLICATION](#how-to-run-the-application)
3. [CONNECTION](#connection)
4. [DNS CONNECTION](#dns-connection)
5. [APPLICATION FEATURES](#application-features)
6. [APPLICATION SECURITY](#application-security)
7. [REFERENCES](#references)

## HOW TO USE THE APPLICATION

To use the application users are required to register (sign up) and login. Users are also able to register as admin users subject to certain age restrictions controlled by custom middleware. After login users are able to add quizzes and play quizzes. Users are also able to edit their user account.

The application also allows users to edit and delete quizzes subject to certain requirements based on whether the user is a normal user or an admin user. Admin users are allowed certain privileges such as the ability to edit or delete any quiz and also view all users and remove users.

## HOW TO RUN THE APPLICATION

A proxy server is included in the front-end to allow the front and back-end to run together. The application uses `nodemon` third-party middleware in the backend to allow the application to run in the command line interface (CLI) or terminal using `npm start`. The folders must, however, be run separately. The server listens on the port specified in the `.env` file via `app.listen()` in `app.js`, or defaults to port `3001`.

The MongoDB connection URI is constructed using the username, password, cluster URL, and database name, which are stored as environment variables and configured using the `dotenv` middleware. The application does not include any third-party API — all API requests are REST API requests made from the front end to the backend.

| Layer | Port | Start Command |
|---|---|---|
| **React Client** | `3000` | `cd client && npm start` |
| **Express Server** | `3001` | `cd server && npm start` |
| **MongoDB Atlas** | Cloud | Direct connection string (see [DNS CONNECTION](#dns-connection)) |

## CONNECTION

The application is connected to the MongoDB database using mongoose third-party middleware in the `connect.js` file in the back end (server) folder. The code uses `mongoose.connect()` to establish a connection between the application and the MongoDB database.

```js
//==================MONGODB CONNECTION SETUP==================//
mongoose.Promise = global.Promise// Use native JavaScript promises for Mongoose

//Function to connect to MongoDB using Mongoose
const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            dbName: database,// Explicit database selection
            serverSelectionTimeoutMS: 5000,// How long to try finding a server
            connectTimeoutMS: 10000, // How long to wait before failing connection
        })
        console.log('[SUCCESS: connect.js]: Successfully connected to MongoDB');

    } catch (error) {
        console.error('[ERROR: connect.js] Error connecting to MongoDB', error);
        process.exit(1);  // Exit the process with a failure code
    }
}
// ================== MONGOOSE CONNECTION EVENT LISTENERS ==================

// Fired if an error occurs after initial connection
mongoose.connection.on('error', (error) => {
    console.error(`[ERROR: connect.js] Error connecting to MongoDb database. Exiting now...`, error);
})

// Fired when MongoDB disconnects (network issue, restart, etc.)
mongoose.connection.on('disconnected', () => {
    console.warn('[WARNING: connectDB.js] MongoDB disconnected! Attempting reconnection...');
});

// Fired when MongoDB successfully reconnects
mongoose.connection.on("reconnected", () => {
    console.log("[INFO: connectDB.js] MongoDB Reconnected!");
});

// Fired once when the connection is fully opened
mongoose.connection.once('open', async () => {
    console.log("[SUCCESS: connectDB.JS] Database connection established");
});
```

## DNS CONNECTION

DNS (`Domain Name System`) translates human-readable domain names into IP addresses that computers use to communicate. This project connects to **MongoDB Atlas** using a direct connection string rather than the standard `mongodb+srv://` protocol.

### Why a Direct Connection String?

`mongodb+srv://` triggers two DNS lookups inside Node.js via its internal **c-ares** resolver — an SRV lookup and a TXT lookup. On Windows, c-ares may fail with `querySrv ECONNREFUSED` even when `nslookup` succeeds, because c-ares attempts a TCP fallback for large DNS responses that Windows Firewall can block.

The fix is to bypass SRV entirely by using a direct connection string with the actual cluster hostnames. Mongoose connects directly to the three Atlas replica set nodes on port `27017`, with a server selection timeout of 5000ms and connection timeout of 10000ms.

### Common DNS Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| `querySrv ECONNREFUSED` | c-ares SRV lookup blocked | Switch to direct connection string |
| Connection timeout | Cluster paused or IP not whitelisted | Check Atlas cluster status and Network Access |
| Port `27017` blocked | Firewall | Test connectivity with `Test-NetConnection` |

> For full DNS background, SRV record details, and DNS commands see [Docs/DNS-connections.md](Docs/DNS-connections.md).

## APPLICATION FEATURES

The application provides the following features:

- **User registration and login** — users register with a username, full name, email, date of birth, and password. Login returns a JWT token used to authenticate subsequent requests.
- **Admin accounts** — users can register as admins. Admin registration requires the user to be 18 or older, enforced by custom middleware. Admins can edit or delete any quiz, view all users, and remove non-admin users.
- **Quiz management** — authenticated users can create, view, edit, and delete quizzes. Each quiz requires a title, description, and exactly 5 questions. Only the quiz creator or an admin can edit or delete a quiz.
- **Score tracking** — users can submit a score after completing a quiz. Scores are stored per user per quiz. An existing score can be updated only if the new score is higher.

### REQUESTS

| **HTTP verb** | **CRUD OPERATION** | **DESCRIPTION** |
|--------|-------|------|
| POST | CREATE | Used to submit data about a specific entity to the server |
| GET | READ | Used to fetch information from the database |
| PUT | UPDATE | Full replacement update of a resource on the database |
| PATCH | UPDATE | Partial update of a resource on the database |
| DELETE | DELETE | Deletes a specific resource |

The application uses both `PUT` and `PATCH` requests to update resources. A `PATCH` serves as a set of instructions for modifying a resource, whereas `PUT` represents a complete replacement of the resource.

### ROUTES

`userRoutes.js`

| **HTTP METHOD** | **OPERATION** | **ENDPOINT** | **DESCRIPTION** |
|--------|-------|------|------------|
| POST | CREATE | `POST /users/login` | User login; returns JWT token |
| POST | CREATE | `POST /users/register` | Register a new user *(requires valid password strength)* |
| GET | READ | `GET /users/me` | Get current user details *(requires JWT)* |
| GET | READ | `GET /users/findUsers` | Get all users or filter by username *(requires JWT)* |
| PATCH | UPDATE | `PATCH /users/editUser/:id` | Update user profile (username, fullName, email) |
| PATCH | UPDATE | `PATCH /users/editPassword` | Change user password *(requires JWT)* |
| DELETE | DELETE | `DELETE /users/deleteUser/:id` | Delete a user *(requires JWT, admin only)* |

_Base path: `/users`_

`quizRoutes.js`

| **HTTP METHOD** | **OPERATION** | **ENDPOINT** | **DESCRIPTION** |
|--------|-------|------|------------|
| POST | CREATE | `POST /quizzes/createQuiz` | Create a new quiz *(requires JWT)* |
| GET | READ | `GET /quizzes/findQuizzes` | Get all quizzes *(requires JWT)* |
| GET | READ | `GET /quizzes/findQuiz/:id` | Get a specific quiz by ID *(requires JWT)* |
| PUT | UPDATE | `PUT /quizzes/editQuiz/:id` | Full update of a quiz *(requires JWT, creator or admin only)* |
| PATCH | UPDATE | `PATCH /quizzes/updateQuiz/:id` | Partial update of a quiz *(requires JWT, creator or admin only)* |
| DELETE | DELETE | `DELETE /quizzes/deleteQuiz/:id` | Delete a quiz *(requires JWT, creator or admin only)* |

_Base path: `/quizzes`_

`scoreRoutes.js`

| **HTTP METHOD** | **OPERATION** | **ENDPOINT** | **DESCRIPTION** |
|--------|-------|------|------------|
| POST | CREATE | `POST /scores/submitScore` | Submit a new quiz score |
| GET | READ | `GET /scores/fetchScores` | Get all scores, optionally filtered by username *(requires JWT)* |
| GET | READ | `GET /scores/findScores/:username` | Get all scores for a specific user |
| GET | READ | `GET /scores/findScore/:username/:quizTitle` | Get a specific score for a user and quiz |
| PUT | UPDATE | `PUT /scores/updateScore/:id` | Update an existing score if new score is higher *(requires JWT)* |

_Base path: `/scores`_

## APPLICATION SECURITY

The application uses multiple layers of security:

| Mechanism | Package / Module | Purpose |
|---|---|---|
| **JWT authentication** | `jsonwebtoken` | Signs and verifies tokens on protected routes; tokens expire after 12 hours |
| **HTTP security headers** | `helmet` | Sets secure HTTP response headers to protect against common web vulnerabilities |
| **CORS** | `cors` | Controls which origins can make requests to the API |
| **Environment variables** | `dotenv` | Keeps sensitive configuration (JWT secret, DB credentials) out of source code |
| **JWT secret check** | `ensureJwtSecret.js` | Exits the process at startup if `JWT_SECRET_KEY` is not set |
| **Role-based access control** | Custom middleware (`checkAdmin`) | Restricts certain routes to admin users only |
| **Password strength validation** | Custom middleware (`checkPasswordStrength`) | Enforces a minimum of 8 characters and at least one special character |

### PASSWORD HASHING

Password hashing is handled using the `bcrypt` third-party package. The `hashPassword` middleware in `middleware.js` hashes passwords before they are stored, using a salt round value of `10` — an industry-standard balance between security and performance.

```js
const SALT_ROUNDS = 10;

const hashPassword = async (req, res, next) => {
    const { password, newPassword } = req.body || {};

    if (password && !newPassword) {
        req.body.password = await bcrypt.hash(password, SALT_ROUNDS);
    } else if (newPassword) {
        req.body.newPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    }
    next();
};
```

Password strength is validated before hashing via the `checkPasswordStrength` middleware, which rejects any password that does not meet the minimum requirements: at least 8 characters and at least one special character (`!@#$%^&*` etc.).

## REFERENCES

- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PATCH
- https://mongoosejs.com/docs/connections.html
- https://mongoosejs.com/docs/api/query.html#Query.prototype.exec()
- https://mongoosejs.com/docs/api/query.html#Query.prototype.populate()
- https://mongoosejs.com/docs/api/query.html#Query.prototype.deleteMany()