package Fact.Frenzy2.FactFrenzy2.Classes;

public class startObject {

    private Long roomKey;
    private String host;

    public startObject(){
        this.roomKey = null;
        this.host = null;
    }

    public Long getRoomKey(){
        return roomKey;
    }

    public String getHost(){
        return host;
    }

    public void setRoomKey(Long roomKey) {
        this.roomKey = roomKey;
    }

    public void setHost(String host) {
        this.host = host;
    }
}
