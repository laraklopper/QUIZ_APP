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
7. [ARIA](#aria)
8. [REFERENCES](#references)

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


### Common DNS Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| `querySrv ECONNREFUSED` | c-ares SRV lookup blocked | Switch to direct connection string |
| Connection timeout | Cluster paused or IP not whitelisted | Check Atlas cluster status and Network Access |
| Port `27017` blocked | Firewall | Test connectivity with `Test-NetConnection` |



## APPLICATION FEATURES

The application provides the following features:

- **User registration and login** — users register with a username, full name, email, date of birth, and password. Login returns a JWT token used to authenticate subsequent requests.
- **Admin accounts** — users can register as admins. Admin registration requires the user to be 18 or older, enforced by custom middleware. Admins can edit or delete any quiz, view all users, and remove non-admin users.
- **Quiz management** — authenticated users can create, view, edit, and delete quizzes. Each quiz requires a title, description, and exactly 5 questions. Only the quiz creator or an admin can edit or delete a quiz.
- **Score tracking** — users can submit a score after completing a quiz. Scores are stored per user per quiz. An existing score can be updated only if the new score is higher.

The application also includs Security features and Accessible Rich Internet Applications (`ARIA`).

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
| **checkJwtToken custom middleware**|`middleware.js`| Custom middleware function to check `JWT` tokens|
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

## Accessible Rich Internet Applications ARIA

ARIA (Accessible Rich Internet Applications) is a set of HTML attributes defined by the WAI-ARIA specification that improve accessibility for users of assistive technologies such as screen readers. The front end of this application uses ARIA attributes throughout its React components to communicate structure, state, and meaning to assistive technology.

### ARIA Attributes Used

| Attribute | Purpose | Where Used |
|---|---|---|
| `aria-label` | Provides an accessible name for an element that has no visible text label | Buttons, inputs, icons across most form components |
| `aria-labelledby` | Associates an element with a visible heading or label element by ID | Form sections, fieldsets, page regions |
| `aria-describedby` | Links an input to a helper or error message element | `LoginForm`, `RegistrationForm` |
| `aria-required` | Indicates a field must be filled before submission | Form inputs in `AddQuizForm`, `EditQuizForm`, `RegistrationForm` |
| `aria-invalid` | Indicates a field's current value is invalid | `LoginForm`, `RegistrationForm` |
| `aria-live` | Marks a region that updates dynamically so screen readers announce changes | Status messages, loading states, feedback regions |
| `aria-atomic` | Tells screen readers to announce the entire live region when it updates | Error/status regions in `EditQuizForm` |
| `aria-busy` | Signals that a region is loading or updating | `EditQuizForm`, `EditPasswordForm` |
| `aria-hidden` | Hides decorative elements from the accessibility tree | Decorative SVG icons and asterisks across form components |
| `aria-expanded` | Communicates whether a collapsible section or control is open or closed | Toggle controls in `AddQuiz`, `EditUserData`, `GamePage` |
| `aria-controls` | Associates a control with the element it expands or toggles | Toggle buttons in `AddQuiz`, `EditPasswordForm`, `LoginForm` |
| `aria-pressed` | Indicates the toggled state of a button (e.g. show/hide password) | Password visibility buttons in `EditPasswordForm`, `RegistrationForm` |
| `aria-disabled` | Marks an element as disabled without removing it from the accessibility tree | `Results` component |
| `aria-readonly` | Indicates a field is read-only | Result fields in `Results` component |

### ARIA Roles Used

| Role | Purpose | Where Used |
|---|---|---|
| `role="main"` | Identifies the primary content region of the page | Page-level components (`HomePage`, `AddQuiz`, `GamePage`, etc.) |
| `role="banner"` | Identifies the site header | `Header`, `Footer` |
| `role="alert"` | Announces error or status messages immediately to screen readers | Error messages in `LoginForm`, `RegistrationForm`, `EditPasswordForm`, `EditQuizForm` |
| `role="region"` | Marks a significant named section of the page | Sections in `EditUserData` |
| `role="group"` | Groups related form controls | Question groups in `EditQuizForm` |
| `role="toolbar"` | Identifies a group of action controls | Action bars in `EditQuizForm`, `EditUserForm` |
| `role="navigation"` | Identifies a navigation landmark | Navigation area in `EditQuizForm` |
| `role="button"` | Applied to non-button elements styled and used as buttons | Custom button elements in `EditPasswordForm`, `EditUserData` |
| `role="presentation"` | Removes semantic meaning from a purely decorative element | Decorative images and containers in page components |

## REFERENCES
- https://www.geeksforgeeks.org/mern/understand-mern-stack/
- https://developer.mozilla.org/en-US/docs/Web/HTTP
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PATCH
- https://mongoosejs.com/docs/connections.html
- https://mongoosejs.com/docs/api/query.html#Query.prototype.exec()
- https://mongoosejs.com/docs/api/query.html#Query.prototype.populate()
- https://mongoosejs.com/docs/api/query.html#Query.prototype.deleteMany()
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA
- https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
- https://webhint.io/docs/user-guide/hints/hint-apple-touch-icons/
- https://www.w3schools.com/tags/tag_title.asp


 ### FRAMEWORKS AND MIDDLEWARE
 _SERVER_
  - https://expressjs.com/
  - https://www.npmjs.com/package/dotenv 
  - https://www.npmjs.com/package/nodemon
  - https://www.npmjs.com/package/mongoose
  - https://www.npmjs.com/package/cors
  - https://www.npmjs.com/package/helmet
  - https://www.npmjs.com/package/bcrypt


 _CLIENT_

 - https://react-bootstrap.netlify.app/
 - https://react.dev/reference/react
 - https://www.npmjs.com/package/react-router-dom 
 - https://lucide.dev/guide/installation
