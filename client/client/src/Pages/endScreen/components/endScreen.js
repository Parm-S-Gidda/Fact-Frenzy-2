import '../styles/endScreen.css';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation, data  } from 'react-router-dom';
import { useWebSocket } from '../../../webSocket.js';
import winSound from '../../../sounds/win.wav';
import { useRef } from 'react';
 





function EndScreen() {

    const location = useLocation();
    const { stompClient} = useWebSocket();
    const {roomKey, isScreen} = location.state || {};
    const navigate = useNavigate(0);
    const [winner, setWinner] = useState("");
    const [scores, setScores] = useState([]);
    const winNoise = useRef(new Audio(winSound));

    const leaveClicked = () => {

        if(isScreen){
          winNoise.current.pause();
          winNoise.current.currentTime = 0;

            let payload = {


                host: "N/A",
                roomKey: roomKey
                
              }

            stompClient.send('/app/' + roomKey + "/screenLeft", {}, JSON.stringify(payload));
         
        }

        navigate('/')
    }

    useEffect(() => {
      
        if(!stompClient){
          console.log("Web Socket Not connected yet");
          return;
        }

        console.log("web socket connected");
        let finalScoreSubscription = stompClient.subscribe("/room/" + roomKey + "/finalScores", handleReceivedMessage);
       
  
        let payload = {

            host: "N/A",
            roomKey: roomKey
            
          }

        stompClient.send('/app/' + roomKey + "/endScreenValues", {}, JSON.stringify(payload));
       
  
        return () => {
            
            finalScoreSubscription.unsubscribe();
         
        };
    }, [stompClient]);
  
    const handleReceivedMessage = (message) => {
  
  
  
      const payload = JSON.parse(message.body);
  
      let { command} = payload;
  
      if(command === "tie"){
  
      
        setWinner("Tie")
        setScores(payload.scores)
  
      }
      else if(command === "winner"){

        setWinner(payload.winner)
        setScores(payload.scores)
  
       
      }
   
  
   
    }

    useEffect(() => {

      if(isScreen){
        winNoise.current.loop = true;
        winNoise.current.volume = 0.05;
        winNoise.current.play();
      }
  
      
    }, [])






  return (

    <div id="endScreenMain">

        <h1 id="endScreenTitle">Fact Frenzy</h1>

        {winner === "Tie" && <h1 id='endScreenWinner'>Tie!</h1>}
        {winner != "Tie" && <h1 id='endScreenWinner'>{winner} Wins!</h1>}
        

        <div id="endScreenScoreDiv">

            <h1 id='endScreenScoreTitle'>Scores</h1>

            <ol id="endScreenList">
            {scores.map((player, index) => (

                <li key={index}>{player}</li>
            ))}
            </ol>


        </div>

    
        <button id="leaveEndScreen" onClick={leaveClicked}>Leave</button>

        
    </div>

   
  );
}

export default EndScreen;