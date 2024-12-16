package Fact.Frenzy2.FactFrenzy2.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import Fact.Frenzy2.FactFrenzy2.Classes.*;
import Fact.Frenzy2.FactFrenzy2.repository.questionRepo;
import Fact.Frenzy2.FactFrenzy2.services.questionService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.mongodb.DBObject;


@RestController
@CrossOrigin
public class StartController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    @Autowired
    private questionRepo questionRepo;


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


    @MessageMapping("/{roomKey}/start")
    public void startGame(@RequestBody startObject data){

        Long currentRoomKey = data.getRoomKey();
        String currentHost = data.getHost();

        System.out.println("Host Name: " + currentHost);

        Room currentRoom = allRooms.get(currentRoomKey);

        currentRoom.setHostName(currentHost);
        currentRoom.removeUserName(currentHost);

        messagingTemplate.convertAndSend("/room/" + currentRoomKey + "/start",
                Map.of("hostName", currentHost, "command", "startGame"));




    }

    @MessageMapping("/{roomKey}/scores")
    public void getScores(@RequestBody startObject data){

        Long currentRoomKey = data.getRoomKey();

        System.out.println("Getting Scores for Room: " + currentRoomKey);

        Room currentRoom = allRooms.get(currentRoomKey);

        Map<String, Integer> allScores =  currentRoom.getScores();

        messagingTemplate.convertAndSend("/room/" + currentRoomKey + "/scores",
                Map.of("playerScores", allScores, "command", "setScores"));



    }

    @MessageMapping("/{roomKey}/answersAndQuestions")
    public void getQuestionAndAnswer(@RequestBody startObject data){

        Long currentRoomKey = data.getRoomKey();

        System.out.println("Getting Question & Answer for Room: " + currentRoomKey);

        Room currentRoom = allRooms.get(currentRoomKey);

        ArrayList<String> questionAnswer =  new ArrayList<String>();


        int currentQuestionIndex = currentRoom.getQuestionIndex();

        if(currentQuestionIndex >= currentRoom.getTotalQuestions()){

            messagingTemplate.convertAndSend("/room/" + currentRoomKey + "/endGame",
                    Map.of("command", "endGame"));
        }
        else{

            questionAnswer.add(currentRoom.getCurrentQuestion());
            questionAnswer.add(currentRoom.getCurrentAnswer());

            messagingTemplate.convertAndSend("/room/" + currentRoomKey + "/answersAndQuestions",
                    Map.of("questionAnswer", questionAnswer, "command", "setQuestionAndAnswer", "questionIndex", currentQuestionIndex));

        }




    }

    @MessageMapping("/{roomKey}/revealQuestion")
    public void revealQuestion(@RequestBody startObject data){

        Long currentRoomKey = data.getRoomKey();

        System.out.println("Sending Request to reveal Questions: " + currentRoomKey);

        Room currentRoom = allRooms.get(currentRoomKey);

        currentRoom.setCurrentGameState(1);

        currentRoom.setSomeoneBuzzed(false);

        messagingTemplate.convertAndSend("/room/" + currentRoomKey + "/revealQuestion",
                Map.of("command", "revealQuestion"));



    }

    @MessageMapping("/{roomKey}/buzzIn")
    public void buzzIn(@RequestBody buzz data){

        Long currentRoomKey = data.getRoomKey();
        String currentUserName = data.getUserName();
        int questionIndex = data.getQuestionIndex();

        System.out.println("Buzz In user: " + currentUserName);
        System.out.println("Buzz In index: " + questionIndex);

        Room currentRoom = allRooms.get(currentRoomKey);

        if(currentRoom.getSomeoneBuzzed()){
            return;
        }

        if(questionIndex != currentRoom.getQuestionIndex()-1){
            return;
        }

        if(currentRoom.getCurrentGameState() != 1){
            return;
        }

        currentRoom.setCurrentGameState(2);

        currentRoom.setSomeoneBuzzed(true);


        messagingTemplate.convertAndSend("/room/" + currentRoomKey + "/buzz",
                Map.of("command", "buzz", "buzzUser", currentUserName));



    }

    @MessageMapping("/{roomKey}/correctClicked")
    public void correctClicked(@RequestBody startObject data){

        Long currentRoomKey = data.getRoomKey();
        String buzzUser = data.getHost();

        System.out.println("Giving Point to: " + buzzUser);

        Room currentRoom = allRooms.get(currentRoomKey);

        currentRoom.increaseScore(buzzUser);

        Map<String, Integer> allScores =  currentRoom.getScores();

        messagingTemplate.convertAndSend("/room/" + currentRoomKey + "/correctIncorrect",
                Map.of("buzzUser", buzzUser, "command", "correct", "playerScores", allScores));


        currentRoom.setCurrentGameState(0);

    }

    @MessageMapping("/{roomKey}/incorrectClicked")
    public void incorrectClicked(@RequestBody startObject data){

        Long currentRoomKey = data.getRoomKey();
        String buzzUser = data.getHost();

        System.out.println("Giving Point to: " + buzzUser);

        Room currentRoom = allRooms.get(currentRoomKey);

        currentRoom.decreaseScore(buzzUser);

        Map<String, Integer> allScores =  currentRoom.getScores();

        messagingTemplate.convertAndSend("/room/" + currentRoomKey + "/correctIncorrect",
                Map.of("buzzUser", buzzUser, "command", "incorrect", "playerScores", allScores));


        currentRoom.setCurrentGameState(0);

    }

    @MessageMapping("/{roomKey}/skip")
    public void skip(@RequestBody startObject data){



        Long currentRoomKey = data.getRoomKey();


        System.out.println("Skip Clicked No one can buzz now");

        Room currentRoom = allRooms.get(currentRoomKey);

        currentRoom.setSomeoneBuzzed(true);


    }

    @MessageMapping("/{roomKey}/continue")
    public void continueToLobbyZero(@RequestBody startObject data){

        Long currentRoomKey = data.getRoomKey();

        System.out.println("Continue Clicked Going back to lobby state 0");

        Room currentRoom = allRooms.get(currentRoomKey);

        currentRoom.setCurrentGameState(0);

        messagingTemplate.convertAndSend("/room/" + currentRoomKey + "/continue",
                Map.of("command", "continue"));




    }

    @MessageMapping("/{roomKey}/endGameForEveryone")
    public void endGameForEveryone(@RequestBody startObject data){

        Long currentRoomKey = data.getRoomKey();

        System.out.println("Continue Clicked Going back to lobby state 0");

        Room currentRoom = allRooms.get(currentRoomKey);

        currentRoom.setCurrentGameState(0);

        messagingTemplate.convertAndSend("/room/" + currentRoomKey + "/endGameForEveryone",
                Map.of("command", "endGame"));




    }

    @MessageMapping("/{roomKey}/endScreenValues")
    public void endScreenValues(@RequestBody startObject data){

        Long currentRoomKey = data.getRoomKey();

        System.out.println("Getting end Screen Values");

        Room currentRoom = allRooms.get(currentRoomKey);

        List<String> playersScores = currentRoom.getListedScore();

        String winner = currentRoom.getWinner();

        if(currentRoom.isTie(winner)){

            messagingTemplate.convertAndSend("/room/" + currentRoomKey + "/finalScores",
                    Map.of("command", "tie", "scores", playersScores));

        }
        else{
            messagingTemplate.convertAndSend("/room/" + currentRoomKey + "/finalScores",
                    Map.of("command", "winner", "scores", playersScores, "winner", winner));
        }

    }

    @MessageMapping("/{roomKey}/screenLeft")
    public void screenLeft(@RequestBody startObject data){

        Long currentRoomKey = data.getRoomKey();

        System.out.println("Screen Left, deleting room");

        allRooms.remove(currentRoomKey);

        messagingTemplate.convertAndSend("/room/" + currentRoomKey + "/screenLeft",
                Map.of("command", "screenLeft"));




    }

    @MessageMapping("/{roomKey}/setSettings")
    public void setSettings(@RequestBody settings data){

        Long currentRoomKey = data.getRoomKey();
        String type = data.getType();

        System.out.println("Setting settings for " + currentRoomKey);

        Room currentRoom = allRooms.get(currentRoomKey);


        System.out.println("Setting settings");

        if(Objects.equals(type, "custom")){

            System.out.println("Setting Custom Questions/answers" + data.getQuestions());
            currentRoom.setAllQuestionsCustom(data.getQuestions());
            currentRoom.setAllAnswerCustom(data.getAnswers());
        }
        else{

            System.out.println("Setting Standard: " + data.getAmount() + ", " + data.getDifficulty());
            currentRoom.setAnswersAndQuestions(data.getDifficulty(), data.getAmount(), this.questionRepo);
        }









    }







}