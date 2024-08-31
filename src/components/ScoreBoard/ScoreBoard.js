import { useState, useEffect, useCallback } from 'react';
import './ScoreBoard.css';

export default function ScoreBoard({ year = 2021, week = 2 }) {
  const [rawData, setRawData] = useState(null);
  const [matchups, setMatchups] = useState([]);
  const [scores, setScores] = useState([]);
  const [currWeek, setCurrWeek] = useState(week);


  const getScores = useCallback(async (year) => {
    const url = `https://fantasy-backend-2b7122cce8cf.herokuapp.com/scores/${year}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      return json;
    } catch (error) {
      console.error('Fetch error:', error.message);
    }
  }, []);

  const updateScoresAndMatchups = useCallback((data, week) => {
    let updatedMatchups = [];
    let updatedScores = [];
    setMatchups([])
    week = parseInt(week, 10); // Ensure week is a number
    
    for (let week_entry of data['WeeklyScores']) {
      if (week_entry['Week'] === week) {
        updatedScores = week_entry['Scores'];
        updatedMatchups = week_entry['Matchups'];

        for (let game of updatedMatchups) {
          if(game['teamA'] === '' && game['teamB'] === ''){
            updatedMatchups = []
            break
          }
          for (let team of updatedScores) {
            if (team['Name'] === game['teamA']) {
              game['scoreA'] = team['Score'];
              continue;
            }
            if (team['Name'] === game['teamB']) {
              game['scoreB'] = team['Score'];
              continue;
            }
          }
        }
        break;
      }
    }
    

    setMatchups(updatedMatchups);
    setScores(updatedScores);
  }, []);

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
              <td>{game.scoreA || '-'}</td>
              <td>-</td>
              <td>{game.scoreB || '-'}</td>
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