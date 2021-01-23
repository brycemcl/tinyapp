const { assert } = require('chai');
const { database } = require('../middleware/databases/emptyDatabase');

describe('database', () => {
  it('create user', () => {
    database.addUsername("bryce")
    assert.exists(database._usernames.bryce)
  });
  it('cannot create new user over an existing user', () => {
    assert.isFalse(database.validNewUsername("bryce"))
  });
  it('cannot create an empty password', () => {
    assert.isFalse(database.validNewPassword(""))
  });
  it('can create a password', () => {
    assert.isTrue(database.validNewPassword("hello#"))
  });
  it('cannot create duplicate short urls', () => {
    const shorturl = database.newURL("https://google.com/", "bryce")
      assert.isFalse(database.validNewUrl(shorturl))
  });
  it('able to delete urls', () => {
    const shorturl = database.newURL("https://google.com/", "bryce")
      assert.isTrue(database.deleteUrl(shorturl, "bryce"))
  });

});