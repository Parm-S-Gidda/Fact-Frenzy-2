import '../styles/home.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Home() {

    const [isFlex, setIsFlex] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const navigate = useNavigate();
    let lobbyInput = 0
    const API_BASE = process.env.REACT_APP_API_BASE;

 

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
        

     

    }

    //make fetch request to backend to join room 
    const handleJoinClicked = async () => {

      try { 

        const response = await fetch(`${API_BASE}/joinLobby?key=${lobbyInput}`);


        if( !response.ok){
            alert("Could not join game, please try again later")
            return;
        }

        const data = await response.text();

        if(data === "DNE"){
            alert("Lobby Doesn't Exist")
            return;
        }

        console.log("respone: " + data)

        navigate('/SelectName', { state: { roomKey: lobbyInput}})

    }
    catch (error){

        console.log(error.message)
    }


    };

    //will make request to back end lobby code
    const handleHostGameClicked = async () => {

       
        
        try { 

            const response = await fetch(`${API_BASE}/createRoom`);
          

            if( !response.ok){
                alert("Could not make lobby, please try again later")
            }

            const data = await response.text();

       

            navigate('/LobbySettings', { state: { roomKey: parseInt(data)}});

        }
        catch (error){

            console.log(error.message)
        }

        
       
    }


    


  return (
    <div className="homeMain">

        <h1 className="homeTitle">Fact Frenzy</h1>

        <div id="buttonDiv">
            <button className="homebutton" onClick={handleHostGameClicked}>Host Game</button>
            <button className="homebutton"  onClick={handleJoinLobbyClicked}>Join Game</button>
        </div>

        <div id="backgroundBlur" style={{ display: isFlex ? 'flex' : 'none' }}>

            <div className="enterLobbyDiv">

                <h2 id="lobbyCodeTitle">Enter Game Code</h2>
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