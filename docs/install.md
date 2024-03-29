# Installation

There are **3 methods** of installing this Node, chose the method that fits your environment.

## Method A - Node-RED Palette Manager with Internet access

This method requires Internet access for the system running Node-RED. This is most common use-case for the most common Node-RED installations.

| ![Method A 1](install/gui_install-sitx1.png)                                                                                                                   |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <ol><li>Click the "hamburger" menu in the upper right.</li><li>Click **Manage Palette**</li><ol>                                                            |
| ![Method A 1](install/gui_install-sitx2.png)                                                                                                                   |
| <ol start=3><li>Select **Install** tab.</li><li>Enter **sitx** in search box.</li><li>On the node-red-contrib-sitx entry, Click **Install** button.</li></ol> |


After about a minute you should see:

![Method B 3](install/sitx-palette-install-success.png)

You can confirm installation by clicking the **Nodes** tab:

![Method B 3](install/sitx-palette-nodes.png)

## Method B - Node-RED Palette Manager without Internet access

This method requires Internet access to download a package, but does not require Internet access on the system running Node-RED.

- I. From a system with Internet access, download an archive of [node-red-contrib-sitx](https://registry.npmjs.org/node-red-contrib-sitx/-/node-red-contrib-sitx-1.0.2.tgz)
- II. Copy node-red-contrib-sitx-1.0.2.tgz to a USB drive (or other removable media).
- III. Insert USB drive or media into system running Node-RED.

![Method B 1](install/gui_install-sitx1.png)

<ol start=1>
  <li>Click the "hamburger" menu in the upper right.</li>
  <li>Click <strong>Manage Palette</strong></li>
</ol>

![Method B 2](install/sitx-palette-install-upload.png)

<ol start=3>
  <li>Select <strong>Install</strong> tab.</li>
  <li>Click the <strong>Upload module tgz file</strong> button.</li>
</ol>

![Method B 3](install/sitx-palette-install-upload-upload.png)

<ol start=6>
  <li>Select <strong>Upload</strong>.</li>
</ol>

After about a minute you should see:

![Method B 3](install/sitx-palette-install-success.png)

You can confirm installation by clicking the **Nodes** tab:

![Method B 3](install/sitx-palette-nodes.png)

## Method C - NPM with Internet access

This method requires Internet access for the system running Node-RED and command-line (terminal, SSH or serial) access to the system running Node-RED.

Run the following command in your Node-RED user directory - typically `~/.node-red`, then restart node-red:

```bash
cd ~/.node-red
npm install node-red-contrib-sitx
node-red-admin restart
```
