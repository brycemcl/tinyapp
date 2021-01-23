const { uniqueURL } = require("../uniqueURL");
const database = {
  _usernames: {
    test: {
      password: "$2b$10$GpEvDQzicQjAJTlZ.YsiaOBH8EJW9xKZ7dzT7SlipxtOTlHjZf2ve",
      fp: {},
      urls: {
        compass: {
          dateCreated: "2021-01-22T19:33:37.519Z",
          username: "test",
          longUrl: "https://web.compass.lighthouselabs.ca/days/today",
          views: {
            "4343204f5a072dd0a57171dd1902a332": ["2021-01-22T19:33:46.432Z"],
          },
        },
        nqVWcq: {
          dateCreated: "2021-01-22T19:33:52.082Z",
          username: "test",
          longUrl: "https://web.compass.lighthouselabs.ca/days/today",
          views: {},
        },
      },
    },
    bryce: {
      password: "$2b$10$9MmOcePTjmmHzl7OPSrg2ujPY1rMkPezMPsi4Sr2tlUX8KXQ.Hs86",
      fp: {},
      urls: {
        yt: {
          dateCreated: "2021-01-22T19:34:13.281Z",
          username: "bryce",
          longUrl: "http://youtube.com",
          views: {},
        },
        tuQxhw: {
          dateCreated: "2021-01-22T19:34:29.171Z",
          username: "bryce",
          longUrl: "https://github.com/",
          views: {
            "4343204f5a072dd0a57171dd1902a332": [
              "2021-01-22T19:34:36.128Z",
              "2021-01-22T19:34:36.250Z",
              "2021-01-22T19:34:36.445Z",
              "2021-01-22T19:34:36.680Z",
              "2021-01-22T19:34:36.873Z",
              "2021-01-22T19:34:37.103Z",
              "2021-01-22T19:34:37.320Z",
              "2021-01-22T19:34:37.573Z",
              "2021-01-22T19:34:37.889Z",
              "2021-01-22T19:34:38.038Z",
              "2021-01-22T19:34:38.178Z",
              "2021-01-22T19:34:38.501Z",
              "2021-01-22T19:34:38.640Z",
            ],
          },
        },
      },
    },
  },
  _urls: {
    compass: {
      dateCreated: "2021-01-22T19:33:37.519Z",
      username: "test",
      longUrl: "https://web.compass.lighthouselabs.ca/days/today",
      views: {
        "4343204f5a072dd0a57171dd1902a332": ["2021-01-22T19:33:46.432Z"],
      },
    },
    nqVWcq: {
      dateCreated: "2021-01-22T19:33:52.082Z",
      username: "test",
      longUrl: "https://web.compass.lighthouselabs.ca/days/today",
      views: {},
    },
    yt: {
      dateCreated: "2021-01-22T19:34:13.281Z",
      username: "bryce",
      longUrl: "http://youtube.com",
      views: {},
    },
    tuQxhw: {
      dateCreated: "2021-01-22T19:34:29.171Z",
      username: "bryce",
      longUrl: "https://github.com/",
      views: {
        "4343204f5a072dd0a57171dd1902a332": [
          "2021-01-22T19:34:36.128Z",
          "2021-01-22T19:34:36.250Z",
          "2021-01-22T19:34:36.445Z",
          "2021-01-22T19:34:36.680Z",
          "2021-01-22T19:34:36.873Z",
          "2021-01-22T19:34:37.103Z",
          "2021-01-22T19:34:37.320Z",
          "2021-01-22T19:34:37.573Z",
          "2021-01-22T19:34:37.889Z",
          "2021-01-22T19:34:38.038Z",
          "2021-01-22T19:34:38.178Z",
          "2021-01-22T19:34:38.501Z",
          "2021-01-22T19:34:38.640Z",
        ],
      },
    },
  },
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
    if (url && typeof this._urls[url] === "undefined" && url.length > 0) {
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
      if (!longUrl.includes("http://") && !longUrl.includes("https://")) {
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
    if (!longUrl.includes("http://") && !longUrl.includes("https://")) {
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
