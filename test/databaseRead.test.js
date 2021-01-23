const { assert } = require('chai');
const { database } = require('../middleware/databases/testDatabase');

describe('database', () => {
  it('getPasswordHash', () => {
    assert.strictEqual(database.getPasswordHash("bryce"), "$2b$10$9MmOcePTjmmHzl7OPSrg2ujPY1rMkPezMPsi4Sr2tlUX8KXQ.Hs86")
  });
  it('getUrls', () => {
    assert.exists(database.getUrls("test"))
  });
  it('getURL', () => {
    assert.strictEqual(database.getURL("yt"), "http://youtube.com")
  });
  it('numberOfVisitors', () => {
    assert.strictEqual(database.numberOfVisitors("yt"), 0)
  });
  it('numberOfVisitors', () => {
    assert.strictEqual(database.numberOfVisitors("tuQxhw"), 1)
  });
});





