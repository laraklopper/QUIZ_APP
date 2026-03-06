# BCRYPT

## Table-of-Contents
1. [BCRYPT MIDDLEWARE IN A MONGOOSE SCHEMA](#bcrypt-middleware-in-a-mongoose-schema)
2. [REGISTERING A USER (HASHING PASSWORDS)](#registering-a-user-hashing-passwords)
3. [USER AUTHENTICATION (COMPARING PASSWORDS)](#user-authentication-comparing-passwords)
4. [SUMMARY](#summary)

Run the following command in the command line interface/terminal to install `bcrypt`:

````
npm install bcrypt
````

## BCRYPT MIDDLEWARE IN A MONGOOSE SCHEMA

To hash passwords before saving a user to the database, 
you can use `pre` middleware in your Mongoose schema.

**Example: `userSchema.js`**
```js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

// Pre-save middleware to hash passwords before saving to the database
userSchema.pre('save', async function (next) {
  const user = this;
  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the salt
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
```
**Explanation:**
- `pre('save')` middleware hashes the password before saving it to the database.
- `comparePassword` is a custom method to verify passwords during login.

## REGISTERING A USER (HASHING PASSWORDS)

**Example: `userControllers.js`**
```js
const User = require('../models/userSchema');

const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newUser = new User({ username, password, email });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser };
```

**Explanation:**
- The password is automatically hashed before saving due to the `pre` middleware.

---

## USER AUTHENTICATION (COMPARING PASSWORDS)**

**Example: `userControllers.js`**
```js
const User = require('../models/userSchema');

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password using the custom comparePassword method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Password is correct, proceed with authentication (e.g., generate JWT)
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginUser };
```

**Explanation:**
- Uses the `comparePassword` method to verify the password.

## SUMMARY
- **Salt rounds:** Higher values are more secure but slower. `10` is a reasonable default.
- **Asynchronous methods:** Prefer `async/await` for hashing and comparing passwords to prevent blocking the event loop.

---