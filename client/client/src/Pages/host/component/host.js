import '../styles/host.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';





function Host() {
    const navigate = useNavigate();

    // 0 - Reveal Next Question 1 - Question Displayed + Skip 
    // 2 - Someone Buzzed + Right Or Wrong 3 - Question skipped + show right answer
    const [hostState, setHostState] = useState(0);

    //Show question 
    const handleRevealClicked = () => {

        setHostState(1);
    }

    //Display answer + no one gets a point
    const handleSkipClicked = () => {

        setHostState(3);
    }

    //Give buzzed user a point and return to wait for display answer screen
    const handleCorrectClicked = () => {

        setHostState(0)
    }

    //Remove point from buzzed user and return to wait for display answer screen
    const handleIncorrectClicked = () => {

        setHostState(0)
    }

    //return to wait for display answer screen
    const handleContinueClicked = () => {
        setHostState(0)
    }







  return (

    <div id="hostMainDiv">

        <h1 id='hostTitle'>Fact Frenzy</h1>

        {hostState === 0 && 
         <>
            <div id='previewDiv'>
                <h1 id='nextQuestionPreview'>Next Question Preview:</h1>
                <h1 id='nextQuestion'>What is 10 + 10?</h1> 
            </div>
    

            <button id="revealNextQuestionButton" onClick={handleRevealClicked}>Reveal To Players</button>
        </>
        }

        {hostState === 1 && 
         <>
            <div id='previewDiv'>
                <h1 id='nextQuestionPreview'>Displayed Question:</h1>
                <h1 id='nextQuestion'>What is 10 + 10?</h1> 
            </div>
    

            <button id="revealNextQuestionButton" onClick={handleSkipClicked}>Skip</button>
        </>
        }
        {hostState === 2 && 
         <>
 
            <div id='previewDiv'>
                <h1 id='nextQuestionPreview'>Displayed Question:</h1>
                <h1 id='nextQuestion'>What is 10 + 10?</h1> 
            </div>
            <div id='previewAnswerDiv'>
                <h1 id='nextQuestionPreview'>Answer:</h1>
                <h1 id='nextQuestion'>20</h1> 
            </div>
    

           <div id="rightOrWrongButtonsDiv">

                <h1>Parm's answer was:</h1>

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
                <h1 id='nextQuestion'>What is 10 + 10?</h1> 
            </div>
            <div id='previewAnswerDiv'>
                <h1 id='nextQuestionPreview'>Answer:</h1>
                <h1 id='nextQuestion'>20</h1> 
            </div>
    

            <button id="continueButton" onClick={handleContinueClicked}>Continue</button>
        </>
        }
       


    </div>

   
  );
}

export default Host;