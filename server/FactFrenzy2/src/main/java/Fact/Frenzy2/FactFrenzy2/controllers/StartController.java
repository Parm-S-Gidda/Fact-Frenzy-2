package Fact.Frenzy2.FactFrenzy2.controllers;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class StartController {


    private final AtomicLong roomKey = new AtomicLong();

    @GetMapping("/createLobby")
    public long createRoom() {

        long newRoomKey = roomKey.incrementAndGet();
        System.out.println("Generated New Room Key: " + newRoomKey);

        return newRoomKey;
    }
}