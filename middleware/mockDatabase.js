const database = {
  _users: {
    SampleUser: {
      password: "",
      fp: {},
      urls: {},
    },
    bryce: {
      password: "$2b$10$AIMSZnt8GI7NNnBXjWjE6e6/MAQzRXx6CKd1qMrnZvPWb8E3Lw7Le",
      fp: {},
      urls: {},
    },
  },
  _urls: {
    SampleShortUrl: {
      user: "bryce",
      longURL: "",
      views: {
        fp: [], //array of times
      },
    },
  },
  addUser(username, password) {
    this._users[username] = {
      password,
      fp: {},
      urls: {},
    };
  },
  validNewUsername(newUsername) {
    if (
      newUsername !== null &&
      typeof this._users[newUsername] === "undefined" &&
      newUsername.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  },
  validNewPassword(newPassword) {
    if (newPassword !== null && newPassword.length > 0) {
      return true;
    } else {
      return false;
    }
  },
  getPasswordHash(username) {
    return this._users[username].password;
  },
};
module.exports = { database };
