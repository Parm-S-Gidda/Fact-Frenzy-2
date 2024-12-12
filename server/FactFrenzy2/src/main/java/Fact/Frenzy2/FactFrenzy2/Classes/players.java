package Fact.Frenzy2.FactFrenzy2.Classes;

public class players {

    private Long roomKey;
    private String userName;

    public players(){
        this.roomKey = null;
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
}
