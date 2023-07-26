# Configuration

## Create a Sit(x) Bridge Adaptor

Login to your Sit(x) portal.

![Sit(x) Web Login](config/sitx-login-screen.png)

Click **Admin**, **Account Settings**.

![Sit(x) Web Login](config/sitx-admin-account-settings.png)

Click **Bridge Adapters**

![Sit(x) Web Login](config/sitx-bridge-adapters.png)

Click **Create New Bridge Adapter**

![Sit(x) Web Login](config/sitx-bridge-adapter-create-new.png)

Name the Bridge Adapter and fill out other fields as appropriate.

![Sit(x) Web Login](config/sitx-bridge-adapter-new-dialog.png)

Select a Group & Scope (see below) and click **Authorize**.

![Sit(x) Web Login](config/sitx-bridge-adapter-scope.png)

Click **Back to Bridge Adapter**.

![Sit(x) Web Login](config/sitx-bridge-adapter-finish.png)

Show the **Secret Key** and copy to clipboard.

![Sit(x) Web Login](config/sitx-bridge-adapter-example-hidden.png)

## Configure Sit(x) Node

Locate the Sit(x) node on the left-hand Node Palette in Node-RED.

![Sit(x) Node in the Node-RED Palette](node/sitx-palette-node.png)

Drag the Sit(x) Node into a Flow and double-click to open the Node Properties dialog.

![Sit(x) Node unconfigured](node/sitx-node-unconfigured.png)

Click the Edit button to add a new sitx_config.

![Sit(x) Node properties dialog](node/sitx-node-properties.png)

Update the configuration settings and click Add.

![Sit(x) config Node](node/sitx-config-node.png)

Complete!

![Sit(x) Node connected](node/sitx-node-connected.png)


## Sit(x) Groups & Scope

In the following example, the URL for our group is `https://sns.takserver.parteamconnect.com/sitx-group-5c60c609`

![Sit(x) group](config/sitx-groups.png)

The following elements of this URL are used for Sit(x) Node Configuration:

- Subdomain: **sns**
- Group: **sitx-group-5c60c609**

Scope is defined during Sit(x) Bridge Adaptor creation (see above). There are three options for scope:

1. `bridge_both`: Bi-directional (in & out) data with a Sit(x) Bridge Adaptor.
2. `bridge_in`: Ingress/input only into a Sit(x) Bridge Adaptor.
3. `bridge_out`: Egress/output only from a Sit(x) Bridge Adaptor.

When entering the Scope into the Sit(x) Node Properties dialog, **do not** include the leading `.` period in the scope, this will be prepended automatically.