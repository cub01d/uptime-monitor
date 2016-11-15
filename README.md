# uptime-monitor

Uptime monitor for Corona.
## Usage
Opens a listening port (default: 3000) for HTTP-POST requests. Stores time of post request into a db. Upon HTTP-get, displays the most recent timestamp of the remote host (&lt;5 minutes == online) to determine the status of the remote host.

Run `node app` to start the node server.

## Planned ideas
* create a "notifyTimer", and upon every post from the server do a "clearTimeout" then use "setTimeout" to trigger a callback to occur after the polltime+1
* integrate with twilio for text push notifications
* meaningful content in HTTP-POST requests. install bodyparser
* authorization token? ensure it's corona making the call and not anyone else
