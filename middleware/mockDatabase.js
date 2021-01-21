const { uniqueURL } = require("./uniqueURL");
const database = {
  _usernames: {
    bryce: {
      password: "$2b$10$CIN027TljJ2QfM.zDmywFe/ss1tdU2QeHcHV1reSzbxMW0FuuEWbK",
      fp: {},
      urls: { },
    },
  },
  _urls: { },
  addUsername(username, password) {
    this._usernames[username] = {
      password,
      fp: {},
      urls: {},
    };
  },
  validNewUsername(newUsername) {
    if (
      newUsername !== null &&
      typeof this._usernames[newUsername] === "undefined" &&
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
    return this._usernames[username].password;
  },
  getUrls(username) {
    return this._usernames[username].urls;
  },
  newURL(longURL, username) {
    if (!this.validNewUsername(username)) {
      const shortURL = uniqueURL();
      if (!longURL.includes("http://") || !longURL.includes("http://")) {
        longURL = "http://" + longURL;
      }
      this._urls[shortURL] = {
        dateCreated: new Date(),
        username,
        longURL,
        views: {},
      };
      this._usernames[username].urls[shortURL] = this._urls[shortURL];
      return shortURL;      
    } else{
      return null
    }

  },
  getURL(shortURL) {
    if (typeof this._urls[shortURL] !== "undefined") {
      return this._urls[shortURL].longURL;
    } else {
      return null
    }
  },
};
module.exports = { database };
