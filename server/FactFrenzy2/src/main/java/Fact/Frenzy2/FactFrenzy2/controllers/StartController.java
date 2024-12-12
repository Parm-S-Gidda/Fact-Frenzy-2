package Fact.Frenzy2.FactFrenzy2.controllers;

import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import Fact.Frenzy2.FactFrenzy2.Classes.Room;
import Fact.Frenzy2.FactFrenzy2.Classes.players;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@RestController
@CrossOrigin
public class StartController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    private final AtomicLong masterRoomKey = new AtomicLong();
    ConcurrentHashMap<Long, Room> allRooms = new ConcurrentHashMap<>();

    @GetMapping("/createRoom")
    public long createRoom() {

        long newRoomKey = masterRoomKey.incrementAndGet();
        System.out.println("Generated New Room Key: " + newRoomKey);

        Room newRoom = new Room(newRoomKey);

        allRooms.put(newRoomKey, newRoom);


        return newRoomKey;
    }

    @GetMapping("/joinLobby")
    public String joinLobby(@RequestParam Long key) {

       // Long tempString = Long.parseLong(key);
        System.out.println("Joining Lobby: " + key);

        if(allRooms.containsKey(key)) {
            return "roomExists";
        }
        else{
            return "DNE";
        }

    }

    @PostMapping("/{roomKey}/addUser")
    public ArrayList<String> adduser(@RequestBody players playerData) {

        Long currentRoomKey = playerData.getRoomKey();
        String currentUserName = playerData.getUserName();

        System.out.println("add User: " + currentUserName);

        Room currentRoom = allRooms.get(currentRoomKey);

        ArrayList<String> updatedPlayerList = currentRoom.addUserName(currentUserName);

        messagingTemplate.convertAndSend("/room/" + currentRoomKey + "/players",
                Map.of("playerList", updatedPlayerList, "command", "updatePlayers"));

        return updatedPlayerList;

    }

    @PostMapping("/{roomKey}/removeUser")
    public ArrayList<String> removeUser(@RequestBody players playerData) {

        Long currentRoomKey = playerData.getRoomKey();
        String currentUserName = playerData.getUserName();

        System.out.println("Remove User: " + currentUserName);

        Room currentRoom = allRooms.get(currentRoomKey);

        ArrayList<String> updatedPlayerList = currentRoom.removeUserName(currentUserName);

        messagingTemplate.convertAndSend("/room/" + currentRoomKey + "/players",
                Map.of("playerList", updatedPlayerList, "command", "updatePlayers"));

        System.out.println(updatedPlayerList);

        return updatedPlayerList;

    }





}