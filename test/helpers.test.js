const { assert } = require('chai');
const { getUserByEmail } = require('../helpers.js');
const { database } = require('../middleware/databases/testDatabase');


  it('getUserByEmail with an incorrect user', () => {
    assert.strictEqual(getUserByEmail("joe", database), null)
  });
  it('getUserByEmail', () => {
    assert.strictEqual(getUserByEmail("bryce", database).password, "$2b$10$9MmOcePTjmmHzl7OPSrg2ujPY1rMkPezMPsi4Sr2tlUX8KXQ.Hs86")
  });