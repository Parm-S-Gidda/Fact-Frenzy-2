import '../styles/lobby.css';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
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

      stompClient.send('/app/hello', {}, JSON.stringify({ message: 'bbb' }));
     // navigate('/Screen')
    }

    useEffect(() => {
      
      if(!isScreen){

       
       setPlayers(playerList);
      }
      else{
        setPlayers(["Waiting For Players..."]);
      }
    

      setLobbyCode(roomKey);
      let playersSubscription = stompClient.subscribe("/room/" + roomKey + "/players", handleReceivedMessage);
      
      return () => {
          
        playersSubscription.unsubscribe();
      };
  }, []);

  const handleReceivedMessage = (message) => {



    const payload = JSON.parse(message.body);

    let { command, playerList} = payload;

    if(command === "updatePlayers"){
      setPlayers(playerList)
    }


    
  }

  return (

    <div id="userLobbyMain">

        <h1 id="lobbyTitle">Fact Frenzy</h1>

        <h2 id="lobbyCode">Lobby Code: {lobbyCode}</h2>

        <div id="displayePlayers">

          {players.map((player, index) => (
            <h2 key={index}>{player}</h2>
          ))}

        </div>

        <div id="playerLobbyDiv">

          {isScreen ? (<button className="settingButtons" onClick={startClicked}>Start</button>): (<></>)}
                    
                    <button className="settingButtons" onClick={handleLeaveClicked}>Leave</button>

        </div>


    </div>



   
  );
}

export default Lobby;