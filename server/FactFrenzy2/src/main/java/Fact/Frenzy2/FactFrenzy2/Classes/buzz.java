package Fact.Frenzy2.FactFrenzy2.Classes;

public class buzz {

    private Long roomKey;
    private int questionIndex;
    private String userName;

    public buzz(){
        this.roomKey = null;
        this.questionIndex = 0;
        this.userName = null;
    }

    public Long getRoomKey(){
        return roomKey;
    }

    public String getUserName(){
        return userName;
    }

    public void setRoomKey(Long roomKey) {
        this.roomKey = roomKey;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getQuestionIndex(){
        return questionIndex;
    }
    public void setQuestionIndex(int questionIndex) {
        this.questionIndex = questionIndex;
    }
}