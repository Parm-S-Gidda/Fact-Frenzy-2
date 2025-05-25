import '../styles/player.css';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWebSocket } from '../../../webSocket.js';

function Player() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stompClient } = useWebSocket();
  const { roomKey, userName } = location.state || {};

  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isWaitingToBuzz, setIsWaitingToBuzz] = useState(false);
  const [cooldownReason, setCooldownReason] = useState(null); // "wait", "penalty", "buzz"

  const cooldownInterval = useRef(null); // ✅ Track current interval

  // ✅ Reusable cooldown starter
  const startCooldown = (duration, reason, onComplete = () => {}) => {
    if (cooldownInterval.current) {
      clearInterval(cooldownInterval.current);
    }

    setCooldown(true);
    setCooldownReason(reason);
    setCooldownTime(duration);

    cooldownInterval.current = setInterval(() => {
      setCooldownTime(prev => {
        if (prev <= 1) {
          clearInterval(cooldownInterval.current);
          cooldownInterval.current = null;
          setCooldown(false);
          setCooldownReason(null);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleBuzzClicked = () => {
    if (isWaitingToBuzz) {
      // ✅ Early buzz = penalty
      setIsWaitingToBuzz(false); // ✅ Clear WAIT state immediately
      startCooldown(2, "penalty");
      return;
    }

    if (cooldown) return;

    const payload = {
      roomKey,
      questionIndex,
      userName
    };

    stompClient.send(`/app/${roomKey}/buzzIn`, {}, JSON.stringify(payload));
    startCooldown(2, "buzz");
  };

  useEffect(() => {
    if (!stompClient) {
      console.log("Web Socket Not connected yet");
      return;
    }

    console.log("web socket connected");

    const playerRefreshSubscription = stompClient.subscribe(`/room/${roomKey}/playerRefresh`, handleReceivedMessage);
    const questionAnswerSubscription = stompClient.subscribe(`/room/${roomKey}/answersAndQuestions`, handleReceivedMessage);
    const endGameSubscription = stompClient.subscribe(`/room/${roomKey}/endGameForEveryone`, handleReceivedMessage);
    const scoresSubscription = stompClient.subscribe(`/room/${roomKey}/scores`, handleReceivedMessage);
    const correctIncorrectSubscription = stompClient.subscribe(`/room/${roomKey}/correctIncorrect`, handleReceivedMessage);
    const revealSubscription = stompClient.subscribe(`/room/${roomKey}/revealQuestion`, handleReceivedMessage);

    const payload = {
      roomKey,
      userName: "N/A"
    };

    stompClient.send(`/app/${roomKey}/playerRefresh`, {}, JSON.stringify(payload));

    return () => {
      playerRefreshSubscription.unsubscribe();
      questionAnswerSubscription.unsubscribe();
      endGameSubscription.unsubscribe();
      scoresSubscription.unsubscribe();
      correctIncorrectSubscription.unsubscribe();
      revealSubscription.unsubscribe();

      // ✅ Clean up interval
      if (cooldownInterval.current) {
        clearInterval(cooldownInterval.current);
      }
    };
  }, [stompClient]);

  const handleReceivedMessage = (message) => {
    const payload = JSON.parse(message.body);
    const { command } = payload;

    if (command === "setQuestionAndAnswer") {
      setQuestionIndex(payload.questionIndex);
    } else if (command === "endGame") {
      navigate('/EndScreen', { state: { roomKey, isScreen: false } });
    } else if (command === "setScores" || command === "incorrect" || command === "correct") {
      setScore(payload.playerScores[userName]);
    } else if (command === "playerRefresh") {
      setScore(payload.scores[userName]);
      setQuestionIndex(payload.questionIndex);
    } else if (command === "revealQuestion") {
      if (cooldown) return; // ✅ Don't override penalty or buzz cooldown

      setIsWaitingToBuzz(true);
      startCooldown(1, "wait", () => {
        setIsWaitingToBuzz(false);
      });
    }
  };

  return (
    <div id="playerMainDiv">
      <h1 id="playerTitle">Fact Frenzy</h1>
      <h1 id="currentPlayerPoints">{score}</h1>

      <button id="buzzButton" onClick={handleBuzzClicked}>
        {cooldown
          ? cooldownReason === "wait"
            ? "WAIT"
            : cooldownTime
          : "BUZZ"}
      </button>
    </div>
  );
}

export default Player;
