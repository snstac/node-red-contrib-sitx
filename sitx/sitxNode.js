#!/usr/bin/env node
/**
 * PAR Sit(x) Node-RED Node.
 *
 * @module node-red-contrib-sitx/sitxNode
 * @author Greg Albrecht <oss@undef.net>
 * @copyright 2023 Greg Albrecht <oss@undef.net>
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

const sitxLib = require("./sitxLib");

const makeSitxNode = (RED) => {
  function SitxNode(config) {
    const WebSocket = require("ws");

    RED.nodes.createNode(this, config);
    const node = this;

    node.sitx_config = RED.nodes.getNode(config.sitx_config);
    node.accessKeyID = node.sitx_config.credentials.accessKeyID;
    node.secretKey = node.sitx_config.credentials.secretKey;
    node.subdomain = node.sitx_config.credentials.subdomain;
    node.scope = node.sitx_config.credentials.scope;
    node.group = node.sitx_config.credentials.group;

    node.status({ fill: 'red', shape: 'dot', text: 'Initializing' });

    let socket;
    sitxLib.auth(node.subdomain, node.accessKeyID, node.secretKey, node.scope).then((res) => {
      let authHeader = `Bearer ${res.access_token}`;
      let wsURL = `wss://${node.subdomain}.takserver.parteamconnect.com/${node.group}`;
      console.log(`wsURL=${wsURL}`)
      socket = new WebSocket(
        wsURL, [], { headers: { "Authorization": authHeader } }
      );

      socket.on("connect", () => {
        node.status({ fill: "yellow", shape: "dot", text: "Connected" });
      });

      socket.on("connect_error", (err) => {
        node.status({
          fill: "red",
          shape: "ring",
          text: `Connection Error: ${err}`
        });
      });

      socket.on("connect_timeout", (err) => {
        node.status({
          fill: "red",
          shape: "ring",
          text: `Connection Timeout: ${err}`
        });
      });

      socket.on("error", (err) => {
        node.status({ fill: "red", shape: "ring", text: `Error: ${err}` });
      });

      socket.on("close", () => {
        node.status({ fill: "red", shape: "ring", text: "Closed" });
        this.on("close", function(msg) { 

          // DOES THIS WORK?
          console.log("Close event: " + msg);
          socket = new WebSocket(
            wsURL, [], { headers: { "Authorization": authHeader } }
          );

        })
      });

      socket.on("open", () => {
        node.status({ fill: "green", shape: "dot", text: "Open" });
        this.on("input", function(msg, nodeSend, nodeDone) {
          node.status({ fill: "yellow", shape: "dot", text: "Transmitting" });
          console.log("Sending: " + msg.payload)
          console.log(socket.send(msg.payload));
          nodeDone();
        });
      });

      socket.on("message", (data, flags) => {
        node.status({ fill: "green", shape: "dot", text: "Receiving" });
        msg = { payload: data };
        node.send(msg);
      });
    });

  }

  RED.nodes.registerType('Sit(x) Node', SitxNode, {
    credentials: {
      accessKeyID: { type: "text" },
      secretKey: { type: "text" },
      subdomain: { type: "text" },
      scope: { type: "text" },
      group: { type: "text" },
    },
  });
};

module.exports = makeSitxNode;