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
      newUsername !== undefined &&
      typeof this._usernames[newUsername] === "undefined" &&
      newUsername.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  },
  validNewPassword(newPassword) {
    if (newPassword !== undefined && newPassword.length > 0) {
      return true;
    } else {
      return false;
    }
  },
  validNewUrl(url) {
    if (url && typeof this._urls[url] === "undefined" && url.length > 0 ) {
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
  newURL(longUrl, username, shortUrlArg) {
    if (!this.validNewUsername(username)) {
      const shortUrl = shortUrlArg || uniqueURL();
      if (!longUrl.includes("http://") || !longUrl.includes("http://")) {
        longUrl = "http://" + longUrl;
      }
      this._urls[shortUrl] = {
        dateCreated: new Date(),
        username,
        longUrl,
        views: {},
      };
      this._usernames[username].urls[shortUrl] = this._urls[shortUrl];
      return shortUrl;
    } else {
      return undefined;
    }
  },
  renameShortUrl(username, oldUrl, newUrl) {
    if (this._usernames[username].urls[oldUrl] !== "undefined") {
      this._urls[newUrl] = this._urls[oldUrl];
      delete this._urls[oldUrl];
      delete this._usernames[username].urls[oldUrl];
      this._usernames[username].urls[newUrl] = this._urls[newUrl];
      return newUrl;
    } else {
      return oldUrl;
    }
  },
  renameLongUrl(username, shortUrl, longUrl) {
    let newLongUrl = longUrl;
    if (!newLongUrl.includes("http://") || !newLongUrl.includes("http://")) {
      newLongUrl = "http://" + newLongUrl;
    }
    if (this._usernames[username].urls[shortUrl] !== "undefined") {
      this._usernames[username].urls[shortUrl]["longUrl"] = newLongUrl;
      return newLongUrl;
    } else {
      return false;
    }
  },
  getURL(shortUrl) {
    if (typeof this._urls[shortUrl] !== "undefined") {
      return this._urls[shortUrl].longUrl;
    } else {
      return undefined;
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
      return true;
    } else {
      return false;
    }
  },
};
module.exports = { database };
