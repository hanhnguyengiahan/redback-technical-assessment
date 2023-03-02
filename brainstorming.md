# Brainstorming
1) Problem 1: WebSocket connection to 'ws://localhost:8080/' failed: WebSocket is closed before the connection is established.

- I want to make sure the server is running and listening on the correct port. But when I run it, it still can’t listen on the TCP PORT, so it has to listen on port 12000

- I check that the WebSocket server is actually accepting connections by printing a message to the console when a new client connects. In your code, there’s a line like console.log('TCP client connected') in the connection event handler for the WebSocketServer object. But it is not showing up. I believe the WebSocket server doesn’t accept connections now.

- The server is not sending any data to the connected WebSocket client. So I added this code  to send data to the connected WebSocket client.

tcpServer.on('data', (msg) => {
        		ws.send(msg);
    		});


But it still doesn’t work :>


2) Problem 2: Unable to find image 'mrsangrin/linter-eslint:latest' locally
docker: Error response from daemon: pull access denied for mrsangrin/linter-eslint, repository does not exist or may require 'docker login': denied: requested access to the resource is denied.

- I did search the image again on the Docker Hub website, and it said that that one doesn’t exist.
 
- So I think I should use the official eslint Docker image. Then try to run the linter using the official image. I ran out of time to do this. I’ll try to do this later on.

- Or maybe because we’re using Node.js runtime environment, I think I should use the official Node.js image from Docker Hub.
