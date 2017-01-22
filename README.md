# uptime-monitor

Uptime monitor for Corona.
## Usage
Opens a listening port (default: 3000) for HTTP-POST requests. Stores time of post request into a db. Upon HTTP-get, displays the most recent timestamp of the remote host (&lt;5 minutes == online) to determine the status of the remote host.

Run `node app` to start the node server.

## Planned ideas
* meaningful content in HTTP-POST requests. maybe look into bodyparser?
** authentication in terms of pubkey/privkey requests
** idea: generate random(?) message. encrypt message with corona's pubkey. if decrypted message is the same as random message sent, then user is verified.
* client-side program that automates the HTTP-POST requests.