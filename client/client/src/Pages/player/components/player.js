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

      if(!stompClient){
        console.log("Web Socket Not connected yet");
        return;
      }

      console.log("web socket connected");
      
      let playerRefreshSubscription = stompClient.subscribe("/room/" + roomKey + "/playerRefresh", handleReceivedMessage);
      let questionAnswerSubscription = stompClient.subscribe("/room/" + roomKey + "/answersAndQuestions", handleReceivedMessage);
      let endGameSubscription = stompClient.subscribe("/room/" + roomKey + "/endGameForEveryone", handleReceivedMessage);
      let scoresSubscription = stompClient.subscribe("/room/" + roomKey + "/scores", handleReceivedMessage);
      let correctIncorrectSubscription = stompClient.subscribe("/room/" + roomKey + "/correctIncorrect", handleReceivedMessage);
     
      let payload = {

        roomKey: roomKey,
        userName: "N/A"
        
      }

    stompClient.send('/app/' + roomKey + "/playerRefresh", {}, JSON.stringify(payload));

      return () => {
          
          questionAnswerSubscription.unsubscribe();
          endGameSubscription.unsubscribe();
          scoresSubscription.unsubscribe();
          correctIncorrectSubscription.unsubscribe();
          playerRefreshSubscription.unsubscribe();
     
       
      };
  }, [stompClient]);

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
    else if(command === "playerRefresh"){

      let allScores = payload.scores;

      setScore(allScores[userName]);
      setQuestionIndex(payload.questionIndex)
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