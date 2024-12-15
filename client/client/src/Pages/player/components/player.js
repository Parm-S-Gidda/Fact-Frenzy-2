import '../styles/player.css';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation, data  } from 'react-router-dom';
import { useWebSocket } from '../../../webSocket.js';

function Player() {

    const navigate = useNavigate();
    const location = useLocation();
    const { stompClient} = useWebSocket();
    const [questionIndex, setQuestionIndex] = useState(0);
    const {roomKey, userName} = location.state || {};
 

    const handleBuzzClicked = () => {

      
      let payload = {

        roomKey: roomKey,
        questionIndex: questionIndex,
        userName: userName
        
      }

    stompClient.send('/app/' + roomKey + "/buzzIn", {}, JSON.stringify(payload));


    }

    useEffect(() => {
      
        
      let questionAnswerSubscription = stompClient.subscribe("/room/" + roomKey + "/answersAndQuestions", handleReceivedMessage);
      let endGameSubscription = stompClient.subscribe("/room/" + roomKey + "/endGameForEveryone", handleReceivedMessage);


     

      return () => {
          
          questionAnswerSubscription.unsubscribe();
          endGameSubscription.unsubscribe();
     
       
      };
  }, []);

  const handleReceivedMessage = (message) => {



    const payload = JSON.parse(message.body);

    let { command} = payload;

    if(command === "setQuestionAndAnswer"){

      setQuestionIndex(payload.questionIndex)

    }
    else if(command === "endGame"){

      navigate('/EndScreen', { state: {roomKey: roomKey, isScreen:false}})
    }
 

 
  }




  return (

    <div id="playerMainDiv">

        <h1 id="playerTitle">Fact Frenzy</h1>

        <h1 id="currentPlayerPoints">0</h1>

        <button id="buzzButton" onClick={handleBuzzClicked}>BUZZ</button>

    </div>
   
  );
}

export default Player;