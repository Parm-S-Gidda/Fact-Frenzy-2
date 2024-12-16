import '../styles/host.css';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation, data  } from 'react-router-dom';
import { useWebSocket } from '../../../webSocket.js';






function Host() {
    const navigate = useNavigate();
    const location = useLocation();
    const { stompClient} = useWebSocket();
    const [userBuzzed, setUserBuzzed] = useState("");
    const [gameEnd, setGameEnd] = useState(false);

    const {roomKey, userName} = location.state || {};

    // 0 - Reveal Next Question 1 - Question Displayed + Skip 
    // 2 - Someone Buzzed + Right Or Wrong 3 - Question skipped + show right answer
    const [hostState, setHostState] = useState(0);

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    //Show question 
    const handleRevealClicked = () => {

        let payload = {

            host: "N/A",
            roomKey: roomKey
            
          }

        stompClient.send('/app/' + roomKey + "/revealQuestion", {}, JSON.stringify(payload));

        setHostState(1);


    }

    //Display answer + no one gets a point
    const handleSkipClicked = () => {

        let payload = {

            host: userBuzzed,
            roomKey: roomKey
            
          }

        stompClient.send('/app/' + roomKey + "/skip", {}, JSON.stringify(payload));

        setHostState(3);
    }

    //Give buzzed user a point and return to wait for display answer screen
    const handleCorrectClicked = () => {

        let payload = {

            host: userBuzzed,
            roomKey: roomKey
            
          }

        stompClient.send('/app/' + roomKey + "/correctClicked", {}, JSON.stringify(payload));
        stompClient.send('/app/' + roomKey + "/answersAndQuestions", {}, JSON.stringify(payload));

        setHostState(0)
    }

    //Remove point from buzzed user and return to wait for display answer screen
    const handleIncorrectClicked = () => {

        let payload = {

            host: userBuzzed,
            roomKey: roomKey
            
          }

        stompClient.send('/app/' + roomKey + "/incorrectClicked", {}, JSON.stringify(payload));
        stompClient.send('/app/' + roomKey + "/answersAndQuestions", {}, JSON.stringify(payload));

        setHostState(0)
    }

    //return to wait for display answer screen
    const handleContinueClicked = () => {

        let payload = {

            host: userBuzzed,
            roomKey: roomKey
            
          }

        stompClient.send('/app/' + roomKey + "/continue", {}, JSON.stringify(payload));
        stompClient.send('/app/' + roomKey + "/answersAndQuestions", {}, JSON.stringify(payload));
        setHostState(0)
    }

    const handleWinnerClicked = () =>{

        let payload = {

            host: "N/A",
            roomKey: roomKey
            
          }

        stompClient.send('/app/' + roomKey + "/endGameForEveryone", {}, JSON.stringify(payload));
        navigate('/EndScreen', { state: {roomKey: roomKey, isScreen:false}})
    }

    useEffect(() => {
      
      if(!stompClient){
        console.log("Web Socket Not connected yet");
        return;
      }

      console.log("web socket connected");
        let questionAnswerSubscription = stompClient.subscribe("/room/" + roomKey + "/answersAndQuestions", handleReceivedMessage);
        let buzzSubscription = stompClient.subscribe("/room/" + roomKey + "/buzz", handleReceivedMessage);
        let endGameSubscription = stompClient.subscribe("/room/" + roomKey + "/endGame", handleReceivedMessage);

        let payload = {

            host: "N/A",
            roomKey: roomKey
            
          }

        stompClient.send('/app/' + roomKey + "/answersAndQuestions", {}, JSON.stringify(payload));

        return () => {
            
            questionAnswerSubscription.unsubscribe();
            buzzSubscription.unsubscribe();
            endGameSubscription.unsubscribe();
         
        };
    }, [stompClient]);
  
    const handleReceivedMessage = (message) => {
  
  
  
      const payload = JSON.parse(message.body);
  
      let { command} = payload;

      if(command === "setQuestionAndAnswer"){

        setQuestion(payload.questionAnswer[0])
        setAnswer(payload.questionAnswer[1])

      }
      else if(command === "buzz"){

        setUserBuzzed(payload.buzzUser);
        setHostState(2)
        
      }
      else if(command === "endGame"){

        setHostState(4);
        
      }

   
    }







  return (

    <div id="hostMainDiv">

        <h1 id='hostTitle'>Fact Frenzy</h1>

        {hostState === 0 && 
         <>
            <div id='previewDiv'>
                <h1 id='nextQuestionPreview'>Next Question Preview:</h1>
                <h1 id='nextQuestion'>{question}</h1> 
            </div>
    

            <button id="revealNextQuestionButton" onClick={handleRevealClicked}>Reveal To Players</button>
        </>
        }

        {hostState === 1 && 
         <>
            <div id='previewDiv'>
                <h1 id='nextQuestionPreview'>Displayed Question:</h1>
                <h1 id='nextQuestion'>{question}</h1> 
            </div>
    

            <button id="revealNextQuestionButton" onClick={handleSkipClicked}>Skip</button>
        </>
        }
        {hostState === 2 && 
         <>
 
            <div id='previewDiv'>
                <h1 id='nextQuestionPreview'>Displayed Question:</h1>
                <h1 id='nextQuestion'>{question}</h1> 
            </div>
            <div id='previewAnswerDiv'>
                <h1 id='nextQuestionPreview'>Answer:</h1>
                <h1 id='nextQuestion'>{answer}</h1> 
            </div>
    

           <div id="rightOrWrongButtonsDiv">

                <h1 id="answerWasTitle">{userBuzzed}'s answer was:</h1>

                <div id="rightWrongSubDiv">

                    <button className="rightWrongButton" onClick={handleCorrectClicked}>Correct</button>
                    <button className="rightWrongButton" onClick={handleIncorrectClicked}>Incorrect</button>
                </div>
           </div>
        </>
        }
        {hostState === 3 && 
         <>
            <div id='previewDiv'>
                <h1 id='nextQuestionPreview'>Displayed Question:</h1>
                <h1 id='nextQuestion'>{question}</h1> 
            </div>
            <div id='previewAnswerDiv'>
                <h1 id='nextQuestionPreview'>Answer:</h1>
                <h1 id='nextQuestion'>{answer}</h1> 
            </div>
    

            <button id="continueButton" onClick={handleContinueClicked}>Continue</button>
        </>
        }
        {hostState === 4 && 
         <>
            <div id='previewDiv'>
                <h1 id='nextQuestionPreview'>No more questions</h1>
            </div>
    

            <button id="revealNextQuestionButton" onClick={handleWinnerClicked}>Reveal Winner</button>
        </>
        }
        
       


    </div>

   
  );
}

export default Host;