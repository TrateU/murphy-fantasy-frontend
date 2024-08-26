import './App.css';
import {useState} from 'react';
import Navbar from './components/Navbar';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import {Client} from 'espn-fantasy-football-api'
import YourComponent from './components/YourComponent';

const DEFAULT_USER = {
  user_id : "U-00000",
  team_name : "USER_TEAM",
  user_name : "USER-00",
  conference: "XXX"
}

const jfc_client = new Client({ 
  leagueId: 52278251, 
  espnS2 : 'AEA%2F6oPSpeOb4uMjvymHz32EP3b9XmEtvL8e%2B3SyTvmgEL3Go7KAJT5c1mwjqVgzaXAWZRs2%2BxbXgAylb7MqMTuZn6gweNlUrSsoKGVQGqY7627isx7s9%2BMCjN0QLIqjE1O5aajkMmta6zLf0t9oD6GVFf0GStiT5CDxdzynExtMjmUVUAOm4nfD%2F4hKC9M%2FK9RYwyL53ufrO4jo%2B8ynYzXBTIBOU2PkzZJ5uTbzs%2FrMV1VJPh1YLYprwPuON4prBI1IgdPX17H72yLxWee29n29Isay1kwePzsop3rnb2hjBdxoOu2LHKNviIdba9cC%2B7M%3D',
  SWID : '57685D79-5D3D-49FE-A85D-795D3DD9FEF0'
})




export default function MyApp() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(DEFAULT_USER)

  function handleClick() {
    setCount(count + 1);
  }

  

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<YourComponent jfc_client={jfc_client} seasonID={2023} matchupPeriodId={10} scoringPeriodId={10} />}/>
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