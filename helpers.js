const getUserByEmail = (email, databaseObject) => {
  if (typeof databaseObject["_usernames"][email] !== "undefined") {
    return databaseObject["_usernames"][email];
  } else {
    return null;
  }
};
module.exports= {getUserByEmail}