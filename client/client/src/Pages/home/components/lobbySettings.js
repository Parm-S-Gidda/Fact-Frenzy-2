import '../styles/lobbySettings.css';
import { useEffect, useState } from 'react';
import AddedQuestions from './addedQuestions';
import { useNavigate, useLocation} from 'react-router-dom';
import { useWebSocket } from '../../../webSocket.js';


function LobbySettings() {

    // 0 - Standard 1 - Custom 
    const [settingChoice, setSettingChoice] = useState(0);

    // 0 - 10 1 - 15 2 - 20 3 - 25
    const [numberOfQuestionsClick, setNumberOfQuestionsClick] = useState(0)

    // 0 - Easy 1 - Medium 2 - Hard
    const [difficultyClick, setDifficultyClick] = useState(0)
    const [questionInput, setQuestionInput] = useState('');
    const [answerInput, setAnswerInput] = useState('');
    const [allQuestionList, setAllQuestionList] = useState([]);
    const location = useLocation();
    const { stompClient} = useWebSocket();
    
    const {roomKey} = location.state || {};
  

    const navigate = useNavigate();

    const handleStandardClicked = () => {

        setSettingChoice(0)
    }

    const handleCustomClicked = () => {

        setSettingChoice(1)
    }

    const handleBackClicked = () => {

        navigate('/');
    }

    const handleAmountQuestionsClicked = (value) => {

        setNumberOfQuestionsClick(value)
    }

    const handleQuestionDifficultyClicked = (value) => {

        setDifficultyClick(value)
    }

    const handleQuestionInput = (e) => {

       
        setQuestionInput(e.target.value)

    }

    const handleAnswerInput = (e) => {

        setAnswerInput(e.target.value)
    }

    const handleAddClicked = () => {

        if(questionInput.length <= 0){
            alert("Question cannot be blank")
            return;
        }

        if(answerInput.length <= 0){
            alert("Answer cannot be blank")
            return;
        }

        const questionPaylaod = {

            Question: questionInput, 
            Answer: answerInput,
           

        }

       
        setAllQuestionList((prevAllQuestionList) => [...prevAllQuestionList, questionPaylaod]);

        setQuestionInput("")
        setAnswerInput("")

    }

    const deleteEntry = (deleteIndex) => {

        setAllQuestionList(prevAllQuestionList => 
            prevAllQuestionList.filter((_, index) => index !== deleteIndex)
          );


    }

    const handleContinueClicked = () => {


        

        if(settingChoice === 0){

            let amount = 0;

            if(numberOfQuestionsClick === 0){
                amount = 10;
            }
            else if(numberOfQuestionsClick === 1){

                amount = 15;
            }
            else if(numberOfQuestionsClick === 2){
                amount = 20;
            }
            else if(numberOfQuestionsClick === 3){
                amount = 25;
            }


            let payload = {

                type: "standard",
                roomKey:roomKey,
                difficulty:difficultyClick,
                amount:amount
                
              }
        
              stompClient.send('/app/' + roomKey + "/setSettings", {}, JSON.stringify(payload));



            navigate('/lobby', { state: { isScreen: true, roomKey}});

        }
        else{
            
            const questions = allQuestionList.map(record => record.Question);
            const answers = allQuestionList.map(record => record.Answer);

            if(answers.length <= 0){
                alert("Must add at least 1 question before continuing");
                return;
            }

            let payload = {

                questions: questions,
                answers: answers,
                type: "custom",
                roomKey:roomKey
                
              }
        
              stompClient.send('/app/' + roomKey + "/setSettings", {}, JSON.stringify(payload));


            navigate('/lobby', { state: { isScreen: true, roomKey, questions:questions, answers:answers}});




        }




      
    }






    return (

        <div className='lobbySettingsDiv'>

            <div id="lobbyMain">

                <h1 id='lobbySettingTitle'> Fact Frenzy</h1>
                <h1 id='lobbySettingSubTitle'>Game Settings</h1>

                <div className='lobbySettingsSub' id="standard" onClick={handleStandardClicked} style={{ border: settingChoice == 0 ? '5px solid rgb(124, 124, 125)' : 'none' }}>

                    <h2 className='settingTitle'>Standard</h2>

                    <div className='lineBreakSetting'></div>

                    <div className='settingDiv'>

                        <div className='settings'>

                            <h3 className="subSettingTitle">Amount of Questions</h3>

                            <div className='option'>
                                <button className='settingButton' onClick={() => handleAmountQuestionsClicked(0)}  style={{backgroundColor: numberOfQuestionsClick == 0 ? 'rgb(139, 134, 134)': 'rgb(247, 244, 244)'}}></button>
                                <h3 className='optionTitle'>10</h3>
                            </div>
                            <div className='option'>
                                <button className='settingButton' onClick={() => handleAmountQuestionsClicked(1)} style={{backgroundColor: numberOfQuestionsClick == 1 ? 'rgb(139, 134, 134)': 'rgb(247, 244, 244)'}}></button>
                                <h3 className='optionTitle'>15</h3>
                            </div>
                            <div className='option'>
                                <button className='settingButton' onClick={() => handleAmountQuestionsClicked(2)} style={{backgroundColor: numberOfQuestionsClick == 2 ? 'rgb(139, 134, 134)': 'rgb(247, 244, 244)'}}></button>
                                <h3 className='optionTitle'>20</h3>
                            </div>
                            <div className='option'>
                                <button className='settingButton' onClick={() => handleAmountQuestionsClicked(3)} style={{backgroundColor: numberOfQuestionsClick == 3 ? 'rgb(139, 134, 134)': 'rgb(247, 244, 244)'}}></button>
                                <h3 className='optionTitle'>25</h3>
                            </div>


                        </div>

                    </div>

                    <div className='lineBreakSetting'></div>

                    <div className='settingDiv'>

                        <div className='settings'>

                            <h3 className="subSettingTitle">Question Difficulty</h3>

                            <div className='option'>

                                <button className='settingButton' onClick={() => handleQuestionDifficultyClicked(0)}  style={{backgroundColor: difficultyClick == 0 ? 'rgb(139, 134, 134)': 'rgb(247, 244, 244)'}}></button>
                                <h3 className='optionTitle'>Easy</h3>

                            </div>

                            <div className='option'>

                                <button className='settingButton' onClick={() => handleQuestionDifficultyClicked(1)}  style={{backgroundColor: difficultyClick == 1 ? 'rgb(139, 134, 134)': 'rgb(247, 244, 244)'}}></button>
                                <h3 className='optionTitle'>Medium</h3>

                            </div>

                            <div className='option'>

                                <button className='settingButton' onClick={() => handleQuestionDifficultyClicked(2)}  style={{backgroundColor: difficultyClick == 2 ? 'rgb(139, 134, 134)': 'rgb(247, 244, 244)'}}></button>
                                <h3 className='optionTitle'>Hard</h3>

                            </div>



                        </div>



                    </div>
                </div>

                <div className='lobbySettingsSub' id="custom" onClick={handleCustomClicked} style={{ border: settingChoice == 1 ? '5px solid rgb(124, 124, 125)' : 'none' }}>

                    <h2 className='settingTitle'>Custom</h2>

                    <div className='lineBreakSetting'></div>

                    <div id="addQuestionsDivSettings">

                        <input type="text" id="questionInput" name='questionInput' placeholder="Enter Question" value={questionInput} onChange={handleQuestionInput}></input>
                        <input type="text" id="answerInput" name='answerInput' placeholder="Enter Answer" value={answerInput} onChange={handleAnswerInput}></input>
                        <button id="addButton" onClick={handleAddClicked}>Add</button>
                    </div>

                    <div className='lineBreakSetting'></div>

                    <div id="allQuestionsDiv">
                    {allQuestionList.map((record, index) => (
                    <AddedQuestions key={index} record={record} index={index} deleteEntry={deleteEntry} />))}

                    </div>



                </div>

                <div id="lobbyButtons">
                    <button className="settingButtons" onClick={handleContinueClicked}>Continue</button>
                    <button className="settingButtons" onClick={handleBackClicked}>Back</button>

                </div>

            </div>






        </div>

    );
}

export default LobbySettings;