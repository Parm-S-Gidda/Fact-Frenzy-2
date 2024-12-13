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
    
    

    const handleLeaveClicked = async() => {

        
      try {

        const response = await fetch('http://127.0.0.1:8080/' + roomKey + '/removeUser', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomKey: roomKey, userName: userName }),
        });

        if (!response.ok) {
            alert("Could not join game, please try again later")
        }

  
        navigate('/')
    }
    catch (error) {

        console.log(error.message)
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
      
      if(!isScreen){

       
       setPlayers(playerList);
      }
   
    

      setLobbyCode(roomKey);
      let playersSubscription = stompClient.subscribe("/room/" + roomKey + "/players", handleReceivedMessage);
      let startSubScription = stompClient.subscribe("/room/" + roomKey + "/start", handleReceivedMessage);
      
      return () => {
          
        playersSubscription.unsubscribe();
        startSubScription.unsubscribe();
      };
  }, []);

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


    
  }

  return (

    <div id="userLobbyMain">

        <h1 id="lobbyTitle">Fact Frenzy</h1>

        <h2 id="lobbyCode">Lobby Code: {lobbyCode}</h2>

        <div id="displayePlayers">

          {players.map((player, index) => (


            index == 0 ? (<h2 key={index}>{player} 👑</h2>) : (<h2 key={index}>{player} </h2>) 

            


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