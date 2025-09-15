import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

let client: Client | null = null;

export function connect(onMessage: (msg: string) => void) {
    client = new Client({
        webSocketFactory: () => new SockJS("http://192.168.2.29:8080/ws"),
        onConnect: () => {
            client?.subscribe("/topic/messages", (message: IMessage) => {
                onMessage(message.body);
            });
        },
    });
    client.activate();
}

export function sendMessage(message: string) {
    client?.publish({ destination: "/app/send", body: message });
}

export function disconnect() {
    client?.deactivate();
}
