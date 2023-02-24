#!/usr/bin/env node
/**
 * PAR Sit(x) Node-RED Nodes.
 *
 * @module node-red-contrib-sitx/sitxLib
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


const axios = require("axios");

const auth = (subdomain, accessKeyID, secretKey, scope, grant_type="client_credentials") => {
  const authURL = `https://${subdomain}.parteamconnect.com/api/v1/client_auth/token`;

  let payload = {
    grant_type: grant_type,
    client_id: accessKeyID,
    client_secret: secretKey,
    scope: scope
  };

  let options = {
    url: authURL,
    method: "POST",
    data: payload
  };

  return new Promise((resolve, reject) => {
    axios(options)
      .then((response) => resolve(response.data))
      .catch((reason) => reject(reason));
  });
};

module.exports = { auth };
