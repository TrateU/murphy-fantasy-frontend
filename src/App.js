import './App.css';
import Navbar from './components/Navbar';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import ScoresPage from './pages/ScoresPage';
import MatchupPage from './pages/MatchupsPage';
import StandingsPage from './pages/StandingsPage';
import TeamPage from './pages/TeamPage';
import HomePage from './pages/HomePage';

export default function MyApp() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/scores" element={<ScoresPage/>}/>
        <Route path='/matchups' element={<MatchupPage/>}>
          <Route path=':year/:week/:match' element={<MatchupPage />} />
        </Route>
        <Route path='/standings' element={<StandingsPage/>}/>
        <Route path='/teams' element={<TeamPage/>}/>
      </Routes>
    </Router>
  );
}

