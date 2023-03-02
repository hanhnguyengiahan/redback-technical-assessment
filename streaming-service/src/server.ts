import net from 'net';
import { WebSocket, WebSocketServer } from 'ws';
import fs from 'fs';

const TCP_PORT = parseInt(process.env.TCP_PORT || '12000', 10);
const SAFE_TEMP_RANGE = { min: 20, max: 80 };
const INCIDENT_THRESHOLD = 3;
const INCIDENT_WINDOW_DURATION = 5000; // 5 seconds
const INCIDENT_LOG_FILE = 'incidents.log';

const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: 8080 });
let incidentCounter = 0;
let incidentWindowStartTime = 0;

tcpServer.on('connection', (socket) => {
    console.log('TCP client connected');

    socket.on('data', (msg) => {
        console.log(msg.toString());

        let currJSON;
        try {
            currJSON = JSON.parse(msg.toString());
        } catch (e) {
            console.log('Error parsing JSON:', (e as Error).message);
            const truncatedMsg = msg.toString().substring(0, msg.toString().lastIndexOf('}') + 1);
            try {
                currJSON = JSON.parse(truncatedMsg);
            } catch (e2) {
                console.log('Error parsing JSON after truncating:', (e2 as Error).message);
                return;
            }
        }

        // Check if battery temperature is within safe range
        if (currJSON?.batteryTemperature && (currJSON.batteryTemperature < SAFE_TEMP_RANGE.min || currJSON.batteryTemperature > SAFE_TEMP_RANGE.max)) {
            // Update incident counter and window start time
            const currentTime = Date.now();
            if (currentTime - incidentWindowStartTime >= INCIDENT_WINDOW_DURATION) {
                // Reset counter and window start time if window has elapsed
                incidentCounter = 1;
                incidentWindowStartTime = currentTime;
            } else {
                incidentCounter++;
            }

            // Log incident to file if threshold exceeded
            if (incidentCounter >= INCIDENT_THRESHOLD) {
                const incidentMsg = `Battery temperature exceeded safe range at ${new Date(currentTime).toLocaleString()}\n`;
                fs.appendFile(INCIDENT_LOG_FILE, incidentMsg, (err) => {
                    if (err) {
                        console.log(`Error writing incident to ${INCIDENT_LOG_FILE}:`, err.message);
                    }
                });
            }
        }
    });

    socket.on('end', () => {
        console.log('Closing connection with the TCP client');
    });

    socket.on('error', (err) => {
        console.log('TCP client error: ', err);
    });
});

websocketServer.on('listening', () => console.log('Websocket server started'));

websocketServer.on('connection', async (ws: WebSocket) => {
    console.log('Frontend websocket client connected to websocket server');
    ws.on('error', console.error);
});

tcpServer.listen(TCP_PORT, () => {
    console.log(`TCP server listening on port ${TCP_PORT}`);
});
