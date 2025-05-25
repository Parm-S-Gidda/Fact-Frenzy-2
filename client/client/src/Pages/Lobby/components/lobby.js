import '../styles/lobby.css';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation, data  } from 'react-router-dom';
import { useWebSocket } from '../../../webSocket.js';

function Lobby() {
    const navigate = useNavigate();
    const location = useLocation();
    const { stompClient} = useWebSocket();
    const { isScreen, roomKey, userName, playerList} = location.state || {};
    const [players, setPlayers] = useState([]);
    const [lobbyCode, setLobbyCode] = useState(0);
    const API_BASE = process.env.REACT_APP_API_BASE;

    

  const handleLeaveClicked = async () => {

    if (!isScreen) {

      try {

        const response = await fetch(`${API_BASE}/${roomKey}/removeUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ roomKey: roomKey, userName: userName }),
        }); 


 
        if (!response.ok) {
          alert("Could not leave game, please try again");
          return;
        }


        navigate('/')
      }
      catch (error) {

        console.log(error.message)
      }

    }
    else{

      let payload = {

        host: "N/A",
        roomKey: roomKey
        
      }

      stompClient.send('/app/' + roomKey + "/screenLeft", {}, JSON.stringify(payload));


      navigate('/')
    }
  }

    const startClicked = () => {

      if(players.length < 2){
        alert("Must have at least 2 players in the lobby before starting!")
        return;
      }

      let payload = {

        host: players[0],
        roomKey: roomKey
        
      }

      stompClient.send('/app/' + roomKey + "/start", {}, JSON.stringify(payload));


      navigate('/Screen', { state: {isScreen:true, roomKey: roomKey, host: players[0]}})
    }

    useEffect(() => {

      if(!stompClient){
        console.log("Web Socket Not connected yet");
        return;
      }

      console.log("web socket connected");


      
      if(!isScreen){

       
       setPlayers(playerList);
      }

      let payload = {

        host: "N/A",
        roomKey: roomKey
        
      }

     
   
    

      setLobbyCode(roomKey);
      let playersSubscription = stompClient.subscribe("/room/" + roomKey + "/players", handleReceivedMessage);
      let startSubScription = stompClient.subscribe("/room/" + roomKey + "/start", handleReceivedMessage);
      let screenLeftSubscription = stompClient.subscribe("/room/" + roomKey + "/screenLeft", handleReceivedMessage);
      let lobbyRefreshSubscription = stompClient.subscribe("/room/" + roomKey + "/lobbyRefresh", handleReceivedMessage);

      stompClient.send('/app/' + roomKey + "/lobbyRefresh", {}, JSON.stringify(payload));

      return () => {
          
        playersSubscription.unsubscribe();
        startSubScription.unsubscribe();
        screenLeftSubscription.unsubscribe();
        lobbyRefreshSubscription.unsubscribe();
      };
  }, [stompClient]);

  const handleReceivedMessage = (message) => {



    const payload = JSON.parse(message.body);

    let { command} = payload;

    if(command === "updatePlayers"){
      setPlayers(payload.playerList)
    }
    else if(command === "startGame"){

      let hostName = payload.hostName;

      if(hostName === userName){
        navigate('/Host', { state: {isScreen:false, isHost:true, roomKey: roomKey, userName: userName}})
      }
      else{
        navigate('/Player', { state: {isScreen:false, isHost:false, roomKey: roomKey, userName: userName}})
      }

     
    }
    else if(command === "screenLeft"){

      if(!isScreen){
        navigate('/ScreenLeft')
      }
   
    }
    else if(command === "lobbyRefresh"){

      setPlayers(payload.allPlayers)
    }


    
  }

  return (

    <div id="userLobbyMain">

        <h1 id="lobbyTitle">Fact Frenzy</h1>

        <h2 id="lobbyCode">Lobby Code: {lobbyCode}</h2>

        <div id="displayePlayers">

          {players.map((player, index) => (


            index == 0 ? (<h2 className='playerNamesLobby' key={index}>{player} 👑</h2>) : (<h2 className='playerNamesLobby' key={index}>{player} </h2>) 

            


          ))}

          {players.length === 0 && (<h2> Waiting for players to join</h2>)}

        </div>

        <div id="playerLobbyDiv">

          {isScreen ? (<button className="settingButtons" onClick={startClicked}>Start</button>): (<></>)}
                    
                    <button className="settingButtons" onClick={handleLeaveClicked}>Leave</button>

        </div>


    </div>



   
  );
}

export default Lobby;