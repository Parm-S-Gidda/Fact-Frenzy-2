import '../styles/screen.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';





function Screen() {

    // 0 - Wait for host 1 - Question Displayed 2 - User Answer
    const [screenSate, setScreenState] = useState(1);
    const [isFlexBuzz, setIsFlexBuzz] = useState(false);
    const [isFlexCorrect, setIsFlexCorrect] = useState(false);
    const [isFlexIncorrect, setIsFlexIncorrect] = useState(false);
    const navigate = useNavigate(0);


    const tempClick = () => {

        setIsFlexBuzz((prevIsFlex) => !prevIsFlex)

        setTimeout(() => {


            setIsFlexBuzz(false);
            setScreenState(2)

            navigate('/EndScreen')
        }, 1500); 


    }
   





  return (

    <div id="screenMainDiv" onClick={tempClick}>

        <h1 id="screenTitle">Fact Frenzy</h1>

        {screenSate === 0 &&  <div className="questionDiv">Wait for host to display next question</div>}

        {screenSate === 1 &&  
        
        <>
            <div className="questionDiv">What is 10 + 10?</div>
            <div id="scoreListDiv">
                <h1 className='userScores'>Parm: 0</h1>
                <h1 className='userScores'>Eric: 0</h1>
                <h1 className='userScores'>Lou: 0</h1>
                <h1 className='userScores'>Gelo: 0</h1>
                <h1 className='userScores'>Cathy: 0</h1>

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