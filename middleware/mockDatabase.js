emptyDatabase =  require("./databases/emptyDatabase");
testDatabase =  require("./databases/testDatabase");
module.exports = process.env.NODE_ENV === "production" ? emptyDatabase : testDatabase;