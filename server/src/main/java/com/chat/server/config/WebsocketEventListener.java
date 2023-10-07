package com.chat.server.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.*;

@Component
@Slf4j
public class WebsocketEventListener {
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        log.info("SessionConnectEvent a new web socket connection:{}", event.toString());
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        log.info("Received a new web socket connection:{}",event.toString());
    }

    @EventListener
    public void handleWebSocketSubscribeListener(SessionSubscribeEvent event){
        log.info("WebSocket Subscribe:{}, user:{}", event.getMessage(),event.getUser());
    }

    @EventListener
    public void handleWebSocketUnSubscribeListener(SessionUnsubscribeEvent event){
        log.info("WebSocket UnSubscribe:{}, user:{}",event.getMessage(),event.getUser());
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        log.info("WebSocket Disconnect:{}, user:{}",event.getMessage(),event.getUser());
    }
}
