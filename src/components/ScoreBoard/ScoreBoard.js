import { useState, useEffect, useCallback } from 'react';
import './ScoreBoard.css';

export default function ScoreBoard({ year = 2021, week = 2 }) {
  const [rawData, setRawData] = useState(null);
  const [matchups, setMatchups] = useState([]);
  const [scores, setScores] = useState([]);
  const [currWeek, setCurrWeek] = useState(week);
  const [rosters, setRosters] = useState(null)


  const getScores = useCallback(async () => {
    const url = `https://fantasy-backend-2b7122cce8cf.herokuapp.com/scores/${year}`;
    try {
      const response = await fetch(url);
      const rosterResponse = await fetch(`https://fantasy-backend-2b7122cce8cf.herokuapp.com/matchups/${year}/${week}`);
      if (!response.ok || !rosterResponse.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      const rosterJson = await rosterResponse.json()
      setRosters(rosterJson)
      return json;
    } catch (error) {
      console.error('Fetch error:', error.message);
    }
  }, [year,week]);

  const updateScoresAndMatchups = useCallback((data, week) => {
    let updatedMatchups = [];
    let updatedScores = [];
    setMatchups([])
    week = parseInt(week, 10); // Ensure week is a number
    
    for (let week_entry of data['WeeklyScores']) {
      if (week_entry['Week'] === week) {
        updatedScores = rosters['teams'];
        updatedMatchups = week_entry['Matchups'];

        for (let game of updatedMatchups) {
          if(game['teamA'] === '' && game['teamB'] === ''){
            updatedMatchups = []
            break
          }
          for (let team of updatedScores) {
            if (team['Name'] === game['teamA']) {
              game['scoreA'] = team['totalPoints'];
              continue;
            }
            if (team['Name'] === game['teamB']) {
              game['scoreB'] = team['totalPoints'];
              continue;
            }
          }
        }
        break;
      }
    }
    

    setMatchups(updatedMatchups);
    setScores(updatedScores);
  }, [rosters]);

  

  useEffect(() => {
    const fetchData = async () => {
      const response = await getScores(year);
      if (response) {
        setRawData(response);
      }
    };

    fetchData();
    
    // Clear previous interval before setting a new one
    const intervalId = setInterval(fetchData, 60 * 1000);
    return () => clearInterval(intervalId);
  }, [year, getScores]);

  useEffect(() => {
    setCurrWeek(week);
  }, [week]);

  useEffect(() => {
    if (rawData) {
      updateScoresAndMatchups(rawData, currWeek);
    }
  }, [currWeek, rawData, updateScoresAndMatchups]);

  return (
    <table>
      <thead>
        <tr>
          <th>Team</th>
          <th>Points</th>
          <th />
          <th>Points</th>
          <th>Team</th>
        </tr>
      </thead>
      <tbody>
        {matchups.length > 0 ? (
          matchups.map((game) => (
            <tr key={game.teamA}>
              <td>{game.teamA}</td>
              <td>{game.scoreA.toFixed(2) || '0'}</td>
              <td>-</td>
              <td>{game.scoreB.toFixed(2) || '0'}</td>
              <td>{game.teamB}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No data available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}