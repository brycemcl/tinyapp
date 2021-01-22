const { uniqueURL } = require("./uniqueURL");
const database = {
  _usernames: {
    bryce: {
      password: "$2b$10$/Hbdg0/iU84BhS4.8r7QP.DN5lcXe3u.wlum7Jv90y.1X59rGkMFy",
      fp: {},
      urls: {},
    },
  },
  _urls: {},
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
    } else {
      return null;
    }
  },
  getURL(shortURL) {
    if (typeof this._urls[shortURL] !== "undefined") {
      return this._urls[shortURL].longURL;
    } else {
      return null;
    }
  },
  visit(url, fp) {
    if (typeof url !== "undefined" && typeof fp !== "undefined" && url && fp) {
      if (this["_urls"][url]["views"][fp]) {
        this["_urls"][url]["views"][fp].push(new Date());
      } else {
        this["_urls"][url]["views"][fp] = [new Date()];
      }
    }
  },
  numberOfVisitors(url) {
    if (typeof Object.keys(this["_urls"][url]["views"]) === undefined) {
      return 0;
    } else {
      return Object.keys(this["_urls"][url]["views"]).length;
    }
  },
  deleteUrl(url, username) {
    if (
      typeof url !== "undefined" &&
      typeof username !== "undefined" &&
      typeof this["_usernames"][username]["urls"][url] !== "undefined"
    ) {
      delete this["_usernames"][username]["urls"][url];
      delete this._urls[url];
      return true
    } else {
      return false
    }
  },
};
module.exports = { database };
