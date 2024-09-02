import './App.css';
import {useEffect, useState} from 'react';
import Navbar from './components/Navbar';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import ScoreBoard from './components/ScoreBoard/ScoreBoard';
import ScoresPage from './pages/ScoresPage';
import MatchupBoard from './components/MatchupBoard/MatchupBoard';
import MatchupPage from './pages/MatchupsPage';
import StandingsPage from './pages/StandingsPage';
import TeamPage from './pages/TeamPage';
import HomePage from './pages/HomePage';





export default function MyApp() {
  const [count, setCount] = useState(0);
  const [info, setInfo] = useState(null);

  function handleClick() {
    setCount(count + 1);
  }
  
  return (
    
    <Router> 
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/scores" element={<ScoresPage/>}/>
        <Route path='/matchups' element={<MatchupPage/>}/>
        <Route path='/standings' element={<StandingsPage/>}/>
        <Route path='/teams' element={<TeamPage/>}/>
      </Routes>
    </Router>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}