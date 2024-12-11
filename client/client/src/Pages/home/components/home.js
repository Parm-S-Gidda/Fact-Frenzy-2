import '../styles/home.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {

    const [isFlex, setIsFlex] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const navigate = useNavigate();
    let lobbyInput = 0
 

    //displays pop up 
    const handleJoinLobbyClicked = () => {
        
        setIsFlex(true)
    };

    //gets rid of pop up
    const handleCancleClicked = () => {

        setIsFlex(false)
    }

    //grabs current value in input field
    const handleInputChange = (e) => {

        lobbyInput = e.target.value
        console.log("input: " + lobbyInput)

        handleJoinClicked(lobbyInput)

    }

    //make fetch request to backend to join room 
    const handleJoinClicked = async (lobbyCode) => {

        //TO DO 
      //  navigate('/SelectName')

      navigate('/Host')

    };

    //will make request to back end lobby code
    const handleHostGameClicked = async (lobbyCode) => {

        navigate('/LobbySettings');
        /*
        try { 

            const response = await fetch("http://127.0.0.1:8080/createLobby")

            if( !response.ok){
                alert("Could not make lobby, please try again later")
            }

            const data = await response.text();

            console.log("respone: " + data)

            navigate('/LobbySettings');

        }
        catch (error){

            console.log(error.message)
        }

        */
       
    }


    


  return (
    <div className="homeMain">

        <h1 className="homeTitle">Fact Frenzy</h1>

        <div id="buttonDiv">
            <button className="homebutton" onClick={handleHostGameClicked}>Host Game</button>
            <button className="homebutton"  onClick={handleJoinLobbyClicked}>Join Lobby</button>
        </div>

        <div id="backgroundBlur" style={{ display: isFlex ? 'flex' : 'none' }}>

            <div className="enterLobbyDiv">

                <h2 id="lobbyCodeTitle">Enter Lobby Code</h2>
                <input type="text" id="lobbyCodeInput" name='lobbyCodeInput' placeholder="i.e. 5" onChange={handleInputChange}></input>

                <div  id="joinLobbyButtonsDiv">

                    <button className="joinLobbyButtons" onClick={handleJoinClicked}>Join</button>
                    <button className="joinLobbyButtons" onClick={handleCancleClicked}>Back</button>

                </div>


            </div>

        </div>
            
        

    </div>
  );
}

export default Home;