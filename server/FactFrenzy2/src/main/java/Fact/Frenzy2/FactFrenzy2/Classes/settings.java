package Fact.Frenzy2.FactFrenzy2.Classes;

import java.util.ArrayList;

public class settings {

    private Long roomKey;
    private ArrayList<String> questions;
    private ArrayList<String> answers;
    private String type;
    private int difficulty;
    private int amount;

    public settings(){

        this.roomKey = null;
        this.questions = new ArrayList<String>();
        this.answers = new ArrayList<String>();
        this.type = null;
        this.difficulty = 0;
        this.amount = 0;
    }

    public void setRoomKey(Long roomKey) {
        this.roomKey = roomKey;
    }

    public Long getRoomKey() {
        return roomKey;
    }

    public void setQuestions(ArrayList<String> questions) {
        this.questions = questions;
    }

    public ArrayList<String> getQuestions() {
        return questions;
    }

    public void setAnswers(ArrayList<String> answers) {
        this.answers = answers;
    }

    public ArrayList<String> getAnswers() {
        return answers;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public void setDifficulty(int difficulty) {
        this.difficulty = difficulty;
    }

    public int getDifficulty() {
        return difficulty;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public int getAmount() {
        return amount;
    }


}
