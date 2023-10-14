package com.chat.server;

import com.chat.server.model.UserWithUsername;
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
        for (int i = 0; i < 30; i++) {
            ChatMessage chatMessage = ChatMessage.builder()
                    .sender(
                            new UserWithUsername(
                                    "652a46f195d1c211d2d7fe0a",
                                    "user1"
                            )
                    )
                    .channelId("652a4819196a4537474a2f78")
                    .content("Message" + i)
                    .build();
            messageService.saveMessage(chatMessage);
            ChatMessage chatMessage2 = ChatMessage.builder()
                    .sender(
                            new UserWithUsername(
                                    "652a46fc95d1c211d2d7fe0c",
                                    "user3"
                            )
                    )
                    .channelId("652a4819196a4537474a2f78")
                    .content(i + "Message")
                    .build();
            messageService.saveMessage(chatMessage2);
            ChatMessage chatMessage3 = ChatMessage.builder()
                    .sender(
                            new UserWithUsername(
                                    "652a46f695d1c211d2d7fe0b",
                                    "user2"
                            )
                    )
                    .channelId("652a4819196a4537474a2f78")
                    .content(i + "Message")
                    .build();
            messageService.saveMessage(chatMessage3);
        }

        for (int i = 0; i < 30; i++) {
            ChatMessage chatMessage = ChatMessage.builder()
                    .sender(
                            new UserWithUsername(
                                    "652a46f695d1c211d2d7fe0b",
                                    "user2"
                            )
                    ).channelId("652a4857196a4537474a2f79")
                    .content("Message" + i)
                    .build();
            messageService.saveMessage(chatMessage);
            ChatMessage chatMessage2 = ChatMessage.builder()
                    .sender(
                            new UserWithUsername(
                                    "652a46f195d1c211d2d7fe0a",
                                    "user1"
                            )
                    ).channelId("652a4857196a4537474a2f79")
                    .content(i + "Message")
                    .build();
            messageService.saveMessage(chatMessage2);
        }

    }
}
