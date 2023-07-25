#!/usr/bin/env node
/**
 * PAR Sit(x) Node-RED Node.
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

    node.status({ fill: "red", shape: "dot", text: "Initializing" });

    node.on("input", (msg) => {
      if (node.server) {
        const status = {
          fill: "yellow",
          shape: "dot",
          text: "Transmitting",
          event: "connect"
        }
        node.status(status)

        node.server.send(msg.payload)
      }
    })

    node.on("close", (done) => {
      if (node.heartbeatInterval) {
        clearInterval(node.heartbeatInterval)
      }

      node.closing = true
      
      if (node.server) {
        node.server.close()
      }
      
      // wait 20*50 (1000ms max) for ws to close.
      // call done when readyState === ws.CLOSED (or 1000ms, whichever comes fist)
      const closeMonitorInterval = 20
      let closeMonitorCount = 50
      
      const si = setInterval(() => {
        if (node.server == null || node.server.readyState === WebSocket.CLOSED || closeMonitorCount <= 0) {
          if (node.tout) {
            clearTimeout(node.tout)
            node.tout = null
          }
          clearInterval(si)
          return done()
        }
        closeMonitorCount--
      }, closeMonitorInterval)
    })

    node.on("nrSocketOpened", () => {
      const status = {
        fill: "green",
        shape: "dot",
        text: "Connected"
      }
      node.status(status)
    })

    node.on("nrSocketError", (event) => {
      node.log(`nrSocketError(${JSON.stringify(event)})`)
      const status = {
        fill: "red",
        shape: "ring",
        text: event.err.message
      }
      node.status(status)
    })

    node.on("nrSocketClosed", (event) => {
      node.log(`nrSocketClosed(${JSON.stringify(event)})`)
      const status = {
        fill: "red",
        shape: "ring",
        text: event.err.message
      }
      node.status(status)
    })

    function startBridge () {
      const scope = `${node.subdomain}.takserver.parteamconnect.com/${node.group}/.${node.scope}`
      let wsURL = `wss://${node.subdomain}.takserver.parteamconnect.com/${node.group}`;
      sitxLib.auth(node.subdomain, node.accessKeyID, node.secretKey, scope).then((res) => {
        startSocket(wsURL, res.access_token)
      }).catch((reason) => localErrorHandler(reason))
    };

    function localErrorHandler (err) {
      node.log(`localErrorHandler(${JSON.stringify(err)})`)
      clearInterval(node.heartbeatInterval)
      node.emit("nrSocketError", { err })
      if (!node.closing && !node.isServer) {
        clearTimeout(node.tout)
        node.tout = setTimeout(function () { startBridge() }, 3000) // try to reconnect every 3 secs... bit fast ?
      }
    }
    
    function startSocket (wsURL, authToken) {
      const authHeader = `Bearer ${authToken}`
      const socket = new WebSocket(wsURL, [], { headers: { Authorization: authHeader } })

      const redId = RED.util.generateId()
      socket.nrId = redId
      socket.nrPendingHeartbeat = false

      socket.on("open", () => {
        if (node.heartbeat) {
          clearInterval(node.heartbeatInterval)
          node.heartbeatInterval = setInterval(() => {
            if (socket.nrPendingHeartbeat) {
              socket.terminate()
              socket.nrErrorHandler(new Error("WebSocket Heartbeat Timeout"))
              return
            }
            socket.nrPendingHeartbeat = true
            try {
              socket.ping()
            } catch (err) {}
          }, node.heartbeat)
        }
        node.emit("nrSocketOpened")
      })

      socket.on("message", (msg) => handleMessage(msg))
      
      function handleMessage (msg) {
        const msgToSend = {
          payload: msg.toString(),
          websocket: socket.send.bind(socket)
        }
        node.send(msgToSend)
      }

      socket.on("error", localErrorHandler)
      socket.on("connect_error", localErrorHandler)
      socket.on("connect_timeout", localErrorHandler)

      socket.on("close", () => {
        clearInterval(node.heartbeatInterval)
        node.emit("nrSocketClosed")

        if (!node.closing) {
          clearTimeout(node.tout)
          node.log("Sit(x) Bridge connection closed. Retrying...")
          node.tout = setTimeout(function () { startBridge() }, 3000)
        }
      })

      socket.on("ping", function () {
        socket.nrPendingHeartbeat = false
        const status = {
          fill: "green",
          shape: "dot",
          text: "Connected (RX'd Ping)"
        }
        node.status(status)
      })

      socket.on("pong", function () {
        socket.nrPendingHeartbeat = false
        const status = {
          fill: "green",
          shape: "dot",
          text: "PONG RX"
        }
        node.status(status)
      })

      node.server = socket
    }

    node.closing = false
    startBridge()
  }

  RED.nodes.registerType("Sit(x) Node", SitxNode, {
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
