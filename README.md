# uptime-monitor

Uptime monitor for Corona.
## Usage
Opens a listening port (default: 3000) for HTTP-post requests. Stores time of post request into a db. Upon HTTP-get, displays the most recent timestamp of the remote host (&lt;5 minutes == online) to determine the status of the remote host.

Run `node app` to start the node server.
