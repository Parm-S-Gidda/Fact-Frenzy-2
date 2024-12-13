import '../styles/screen.css';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWebSocket } from '../../../webSocket.js';





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


    const tempClick = () => {

      //  setIsFlexBuzz((prevIsFlex) => !prevIsFlex)

        //setTimeout(() => {


          //  setIsFlexBuzz(false);
            //setScreenState(2)

           // navigate('/EndScreen')
        //}, 1500); 


    }

    useEffect(() => {
      
        
        let scoresSubscription = stompClient.subscribe("/room/" + roomKey + "/scores", handleReceivedMessage);
      
        let payload = {

            host: "N/A",
            roomKey: roomKey
            
          }

        stompClient.send('/app/' + roomKey + "/scores", {}, JSON.stringify(payload));

        return () => {
            
            scoresSubscription.unsubscribe();
         
        };
    }, []);
  
    const handleReceivedMessage = (message) => {
  
  
  
      const payload = JSON.parse(message.body);
  
      let { command} = payload;

      if(command === "setScores"){

        setPlayerScores(payload.playerScores);
      }
  

  
        
  
  
      
    }
   





  return (

      <div id="screenMainDiv" onClick={tempClick}>

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
            <div className="questionDiv">What is 10 + 10?</div>
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
            <div className="questionDiv">What is 10 + 10?</div>
            <div className="highlightUserDiv">What is the answer Parm?</div>

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