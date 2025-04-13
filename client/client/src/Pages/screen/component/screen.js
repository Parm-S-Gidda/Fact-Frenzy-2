import '../styles/screen.css';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWebSocket } from '../../../webSocket.js';
import PreviousAnswer from './previousAnswer.js';
import { useRef } from 'react';





function Screen() {

    // 0 - Wait for host 1 - Question Displayed 2 - User Answer
    const [screenSate, setScreenState] = useState(0);
    const [isFlexBuzz, setIsFlexBuzz] = useState(false);
    const [isFlexCorrect, setIsFlexCorrect] = useState(false);
    const [isFlexIncorrect, setIsFlexIncorrect] = useState(false);
    const [playerScores, setPlayerScores] = useState({});
    const location = useLocation();
    const { isScreen, roomKey, host} = location.state || {};
    const { stompClient} = useWebSocket();
    const navigate = useNavigate(0);
    const [question, setQuestion] = useState("");
    const [userBuzzed, setUserBuzzed] = useState("");
    const [previousAnswer, setPreviousAnswer] = useState("")
    const [displayPreviousAnswer, setDisplayPreviousAnswer] = useState(false)
    const answerRef = useRef("");


    
  


    const buzzAnimation = (buzzUser) => {

        setUserBuzzed(buzzUser)

        setIsFlexBuzz((prevIsFlex) => !prevIsFlex)

        setTimeout(() => {


            setIsFlexBuzz(false);
            setScreenState(2)

        }, 1500); 


    }

    const correctAnimation = (buzzUser) => {

       

        setIsFlexCorrect((prevIsFlex) => !prevIsFlex)

        setTimeout(() => {


            setIsFlexCorrect(false);
            setScreenState(0)
            setDisplayPreviousAnswer(true)

        }, 1500); 

        
    }



    const incorrectAnimation = (buzzUser) => {

       

        setIsFlexIncorrect((prevIsFlex) => !prevIsFlex)

        setTimeout(() => {


            setIsFlexIncorrect(false);
            setScreenState(0)
            setDisplayPreviousAnswer(true)


        }, 1500); 

    
    }

    useEffect(() => {

      if(!stompClient){
        console.log("Web Socket Not connected yet");
        return;
      }

      console.log("web socket connected");
      
        
        let scoresSubscription = stompClient.subscribe("/room/" + roomKey + "/scores", handleReceivedMessage);
        let questionAnswerSubscription = stompClient.subscribe("/room/" + roomKey + "/answersAndQuestions", handleReceivedMessage);
        let revealSubscription = stompClient.subscribe("/room/" + roomKey + "/revealQuestion", handleReceivedMessage);
        let buzzSubscription = stompClient.subscribe("/room/" + roomKey + "/buzz", handleReceivedMessage);
        let correctIncorrectSubscription = stompClient.subscribe("/room/" + roomKey + "/correctIncorrect", handleReceivedMessage);
        let continueSubscription = stompClient.subscribe("/room/" + roomKey + "/continue", handleReceivedMessage);
        let endGameSubscription = stompClient.subscribe("/room/" + roomKey + "/endGameForEveryone", handleReceivedMessage);

        let payload = {

            host: "N/A",
            roomKey: roomKey
            
          }

        stompClient.send('/app/' + roomKey + "/scores", {}, JSON.stringify(payload));

        return () => {
            
            scoresSubscription.unsubscribe();
            questionAnswerSubscription.unsubscribe();
            revealSubscription.unsubscribe();
            buzzSubscription.unsubscribe();
            correctIncorrectSubscription.unsubscribe();
            continueSubscription.unsubscribe();
            endGameSubscription.unsubscribe();
   
        };
    }, [stompClient]);
  
    const handleReceivedMessage = (message) => {
  
  
  
      const payload = JSON.parse(message.body);
  
      let { command} = payload;

      if(command === "setScores"){

        setPlayerScores(payload.playerScores);
      }
      else if(command === "setQuestionAndAnswer"){

        setQuestion(payload.questionAnswer[0]);

        answerRef.current = payload.questionAnswer[1];
    
      }
      else if(command === "revealQuestion"){

   

        setScreenState(1);
      }
      else if(command === "buzz"){


        buzzAnimation(payload.buzzUser);
      }
      else if(command === "correct"){

        correctAnimation(payload.buzzUser);

        setPlayerScores(payload.playerScores);


        setPreviousAnswer(answerRef.current);
      }
      else if(command === "incorrect"){

        incorrectAnimation(payload.buzzUser);

        setPlayerScores(payload.playerScores);
        setPreviousAnswer(answerRef.current);
      }
      else if(command === "continue"){

        setScreenState(0);
      }
      else if(command === "endGame"){

        navigate('/EndScreen', { state: {roomKey: roomKey, isScreen:isScreen}})
      }
      
  

  
        
  
  
      
    }
   





  return (

      <div id="screenMainDiv">

          <h1 id="screenTitle">Fact Frenzy</h1>

          {screenSate === 0 &&
              <>
                  <div className="questionDiv">Wait for host to display next question</div>
                  <div id="scoreListDiv">
                      {Object.entries(playerScores).map(([player, score], index) => (
                          <h2 className='userScores' key={index}>
                              {player}: {score}
                          </h2>
                      ))}
                  </div>
              </>
        }

        {screenSate === 1 &&  
        
        <>
            <div className="questionDiv">{question}</div>
              <div id="scoreListDiv">
                  {Object.entries(playerScores).map(([player, score], index) => (
                      <h2 className='userScores' key={index}>
                          {player}: {score}
                      </h2>
                  ))}
              </div>
        </>
        }

        {screenSate === 2 && 
        
        <>
            <div className="questionDiv">{question}</div>
            <div className="highlightUserDiv">What is the answer {userBuzzed}?</div>

        </>
        
        }

       
        <div id="screenBackgroundBlack" style={{ display: isFlexBuzz ? 'flex' : 'none' }}>

            <div id="buzzDiv" >BUZZ</div>

        </div>

        <div id="screenBackgroundCorrect" style={{ display: isFlexCorrect ? 'flex' : 'none' }}>

            <div id="correctDiv" >CORRECT</div>

        </div>

        <div id="screenBackgroundIncorrect" style={{ display: isFlexIncorrect ? 'flex' : 'none' }}>

            <div id="incorrectDiv" >INCORRECT</div>

        </div>

        {displayPreviousAnswer && <PreviousAnswer setDisplayPreviousAnswer={setDisplayPreviousAnswer} previousAnswer={previousAnswer}></PreviousAnswer>}

       



        


    </div>

   
  );
}

export default Screen;