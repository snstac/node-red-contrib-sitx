#!/usr/bin/env node
/**
 * PAR Sit(x) Node-RED Config Node.
 *
 * @module node-red-contrib-sitx
 * @author Greg Albrecht <gba@snstac.com>
 * @copyright 2023 Sensors & Signals LLC
 * @license Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* jslint node: true */
/* jslint white: true */

const makeSitxConfigNode = (RED) => {
  function SitxConfig(config) {
    RED.nodes.createNode(this, config);
    this.accessKeyID = config.accessKeyID;
    this.secretKey = config.secretKey;
    this.subdomain = config.subdomain;
    this.scope = config.scope;
    this.group = config.group;
  }
  RED.nodes.registerType('sitx_config', SitxConfig, {
    credentials: {
      accessKeyID: { type: 'text' },
      secretKey: { type: 'text' },
      subdomain: { type: 'text' },
      scope: { type: 'text' },
      group: { type: 'text' },
    },
  });
};

module.exports = makeSitxConfigNode;
