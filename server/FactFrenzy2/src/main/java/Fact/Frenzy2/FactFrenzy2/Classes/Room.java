package Fact.Frenzy2.FactFrenzy2.Classes;



import Fact.Frenzy2.FactFrenzy2.modal.question;
import Fact.Frenzy2.FactFrenzy2.repository.questionRepo;


import java.util.*;

public class Room {

    private ArrayList<String> players;
    private ArrayList<String> questions;
    private ArrayList<String> answers;
    private Long roomKey;
    private String hostName;
    private Map<String, Integer> scores;
    private int totalQuestions;
    private int currentQuestion;
    private int currentGameState;
    private boolean someoneBuzzed;


    public Room(Long roomKey){
        this.roomKey = roomKey;
        this.players = new ArrayList<>();
        this.questions = new ArrayList<>();
        this.answers = new ArrayList<>();
        this.scores = new HashMap<>();
        this.totalQuestions = 0;
        this.currentQuestion = 0;
        this.currentGameState = 0;
        this.someoneBuzzed = false;



    }


    public ArrayList<String> addUserName(String username)
    {


        players.add(username);


        scores.put(username, 0);
        return players;
    }

    public ArrayList<String> removeUserName(String username)
    {
        players.remove(username);
        scores.remove(username);
        return players;
    }

    public ArrayList<String> getAllPlayers(){
        return players;
    }

    public ArrayList<String> getAllQuestions(boolean isCustom, int difficulty, int amount){

        return questions;
    }

    public void setAllQuestionsCustom(ArrayList<String> questions){

        this.questions = questions;
        this.totalQuestions = questions.size();
    }

    public void setAllAnswerCustom(ArrayList<String> answers){
        this.answers = answers;
    }





    public void setAnswersAndQuestions(int difficulty, int amount, questionRepo questionRepo){

        List<question> allQuestions = questionRepo.findRandomQuestionsByDifficulty(difficulty, amount);

        this.totalQuestions = allQuestions.size();

        for (question q : allQuestions) {
            this.questions.add(q.getQuestion());
            this.answers.add(q.getAnswer());
        }
    }

    public void setRoomKey(Long key){
        this.roomKey = key;
    }

    public Long getRoomKey(){
        return roomKey;
    }

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
    }

    public Map<String, Integer> getScores() {

        return scores;
    }

    public void increaseScore(String username){

        scores.put(username, scores.getOrDefault(username, 0) + 1);

    }

    public void decreaseScore(String username){

        int currentScore = scores.getOrDefault(username, 0);

        //if current score is already 0 don't change score further
        if(currentScore == 0){
            return;
        }

        scores.put(username, scores.getOrDefault(username, 0) - 1);
    }

    public void setCurrnetQuestion(int newCurrnetQuestion){

        this.currentQuestion = newCurrnetQuestion;

    }


    public int getTotalQuestions(){
        return totalQuestions;
    }

    public void setCurrentGameState(int newGameState){
        this.currentGameState = newGameState;
    }

    public int getCurrentGameState(){
        return currentGameState;
    }

    public String getCurrentQuestion(){
        return questions.get(currentQuestion);
    }

    public String getCurrentAnswer(){

        String tempAnswer = answers.get(currentQuestion);
        currentQuestion++;

        return tempAnswer;


    }

    public int getQuestionIndex(){
        return currentQuestion;
    }

    public boolean getSomeoneBuzzed(){
        return someoneBuzzed;
    }

    public void setSomeoneBuzzed(boolean someoneBuzzed){
        this.someoneBuzzed = someoneBuzzed;
    }

    public List<String> getListedScore(){

        List<String> orderedList = scores.entrySet()
                .stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .map(entry -> entry.getKey() + ": " + entry.getValue())
                .toList();


        return orderedList;
    }

    public String getWinner(){


        return Collections.max(scores.entrySet(), Map.Entry.comparingByValue()).getKey();


    }

    public boolean isTie(String userName){

        int value = scores.get(userName);

        int count = 0;
        for (int v : scores.values()) {
            if (v == value) {
                count++;
            }
            if (count > 1) {
                return true;
            }
        }
        return false;


    }

}
