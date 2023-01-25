const assert = require('assert');
const app = require('../../src/app');

describe('\'meow\' service', () => {
  it('registered the service', () => {
    const service = app.service('meow');

    assert.ok(service, 'Registered the service');
  });
});
