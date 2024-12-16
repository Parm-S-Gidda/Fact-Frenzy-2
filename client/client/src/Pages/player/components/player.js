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
    const [score, setScore] = useState(0);
 

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
      let scoresSubscription = stompClient.subscribe("/room/" + roomKey + "/scores", handleReceivedMessage);
      let correctIncorrectSubscription = stompClient.subscribe("/room/" + roomKey + "/correctIncorrect", handleReceivedMessage);
     

      return () => {
          
          questionAnswerSubscription.unsubscribe();
          endGameSubscription.unsubscribe();
          scoresSubscription.unsubscribe();
          correctIncorrectSubscription.unsubscribe();
     
       
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
    else if(command === "setScores" || command === "incorrect" || command === "correct"){

      let allScores = payload.playerScores;

      setScore(allScores[userName]);
      
    }
 

 
  }




  return (

    <div id="playerMainDiv">

        <h1 id="playerTitle">Fact Frenzy</h1>

        <h1 id="currentPlayerPoints">{score}</h1>

        <button id="buzzButton" onClick={handleBuzzClicked}>BUZZ</button>

    </div>
   
  );
}

export default Player;