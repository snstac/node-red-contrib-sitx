/**
 * Tests for Orion Node-RED nodes.
 *
 * @author Greg Albrecht <oss@undef.net>
 * @copyright Copyright 2023 Greg Albrecht
 * @license Apache-2.0
 */

'use strict';

const fs = require('fs');
const helper = require('node-red-node-test-helper');
const should = require('should');

const SitxConfig = require('../sitx/sitxConfig.js');
const SitxNode = require('../sitx/sitxNode.js');

helper.init(require.resolve('node-red'));

describe('SitxConfig', () => {
  beforeEach((done) => helper.startServer(done));

  afterEach((done) => {
    helper.unload();
    helper.stopServer(done);
  });

  it('Should load Node with Credentials', (done) => {
    const flow = [{ id: 'c1', type: 'sitx_config', name: 'sitx_config', groupIds: 'g1' }];
    const credentials = { c1: { username: 'u1', password: 'p1' } };
    helper.load(OrionNode, flow, credentials, () => {
      const c1 = helper.getNode('c1');
      c1.should.have.property('name', 'sitx_config');
      c1.should.have.property('groupIds', 'g1');
      c1.should.have.property('credentials', { username: 'u1', password: 'p1' });
      done();
    });
  });
});
