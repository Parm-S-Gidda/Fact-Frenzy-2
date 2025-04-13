import '../styles/screen.css';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWebSocket } from '../../../webSocket.js';
import correctSound from '../../../sounds/correct.wav';
import incorrectSound from '../../../sounds/incorrect.wav';
import dingSound from '../../../sounds/ding.wav';
import musicSound from '../../../sounds/music.mp3';
import clockSound from '../../../sounds/clock.wav';
import revealSound from '../../../sounds/reveal.wav';





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
    const [answer, setAnswer] = useState("");
    const [userBuzzed, setUserBuzzed] = useState("");
    const correctNoise = new Audio(correctSound);  
    const incorrectNoise = new Audio(incorrectSound);  
    const dingNoise = new Audio(dingSound);  
    const musicNoise = new Audio(musicSound); 
    const clockNoise = new Audio(clockSound);  
    const revealNoise = new Audio(revealSound);  
    let audioOn = useRef(false);


    const buzzAnimation = (buzzUser) => {

   

        if(audioOn){


     
          dingNoise.play();
        }
        
        

        setUserBuzzed(buzzUser)

        setIsFlexBuzz((prevIsFlex) => !prevIsFlex)

        setTimeout(() => {


            setIsFlexBuzz(false);
            setScreenState(2);



          if(audioOn){
          
            clockNoise.loop = true;
            clockNoise.volume = 0.05
            clockNoise.play();
          }

        }, 1500); 


    }

    const correctAnimation = (buzzUser) => {

      if(audioOn){

    
        correctNoise.play();
        clockNoise.pause();

 
      }
       

        setIsFlexCorrect((prevIsFlex) => !prevIsFlex)

        setTimeout(() => {


            setIsFlexCorrect(false);
            setScreenState(0)

        }, 1500); 

        
    }

    const incorrectAnimation = (buzzUser) => {

      if(audioOn){

      
        incorrectNoise.play();
        clockNoise.pause();
      }
     

        setIsFlexIncorrect((prevIsFlex) => !prevIsFlex)

        setTimeout(() => {


            setIsFlexIncorrect(false);
            setScreenState(0)

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
        setAnswer(payload.questionAnswer[1]);
    
      }
      else if(command === "revealQuestion"){

        setScreenState(1);

        if(audioOn){

          revealNoise.volume = 0.05;
          revealNoise.playbackRate = 2.5;
          revealNoise.play();
        }
      }
      else if(command === "buzz"){

        buzzAnimation(payload.buzzUser, audioOn);
      }
      else if(command === "correct"){

        correctAnimation(payload.buzzUser, audioOn);

        setPlayerScores(payload.playerScores);
      }
      else if(command === "incorrect"){

        incorrectAnimation(payload.buzzUser, audioOn);

        setPlayerScores(payload.playerScores);
      }
      else if(command === "continue"){

        setScreenState(0);
      }
      else if(command === "endGame"){

        navigate('/EndScreen', { state: {roomKey: roomKey, isScreen:isScreen}})
      }
      
    }

    const enableMusic = () => {

 
      audioOn = true;

      if(audioOn){
        musicNoise.loop = true;
        musicNoise.volume = 0.01;
        musicNoise.play();
      }

    }
   





  return (

      <div id="screenMainDiv" onClick = {enableMusic}>

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

       



        


    </div>

   
  );
}

export default Screen;