package com.chat.server;

import com.chat.server.payload.request.ChatMessage;
import com.chat.server.service.MessageService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ServerApplication implements CommandLineRunner {
    private final MessageService messageService;

    public ServerApplication(MessageService messageService) {
        this.messageService = messageService;
    }

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
//        for (int i = 0; i < 30; i++) {
//            ChatMessage chatMessage = ChatMessage.builder()
//                    .sender("65295a07f911e7012cc6bc0d")
//                    .channelId("65295a46f911e7012cc6bc11")
//                    .content("Message" + i)
//                    .build();
//            messageService.saveMessage(chatMessage);
//            ChatMessage chatMessage2 = ChatMessage.builder()
//                    .sender("65295a0ef911e7012cc6bc0e")
//                    .channelId("65295a46f911e7012cc6bc11")
//                    .content(i + "Message")
//                    .build();
//            messageService.saveMessage(chatMessage2);
//            ChatMessage chatMessage3 = ChatMessage.builder()
//                    .sender("65295a00f911e7012cc6bc0c")
//                    .channelId("65295a46f911e7012cc6bc11")
//                    .content(i + "Message")
//                    .build();
//            messageService.saveMessage(chatMessage3);
//        }
//
//        for (int i = 0; i < 30; i++) {
//            ChatMessage chatMessage = ChatMessage.builder()
//                    .sender("65295a00f911e7012cc6bc0c")
//                    .channelId("65295a32f911e7012cc6bc10")
//                    .content("Message" + i)
//                    .build();
//            messageService.saveMessage(chatMessage);
//            ChatMessage chatMessage2 = ChatMessage.builder()
//                    .sender("65295a0ef911e7012cc6bc0e")
//                    .channelId("65295a32f911e7012cc6bc10")
//                    .content(i + "Message")
//                    .build();
//            messageService.saveMessage(chatMessage2);
//        }

    }
}
