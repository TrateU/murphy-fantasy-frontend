import { useState, useEffect, useCallback } from 'react';
import './ScoreBoard.css';

const weekRanges2024 = [
  {"Week": 1, "start":"2024:8:4", "end":"2024:8:10"},
  {"Week": 2, "start":"2024:8:11", "end":"2024:8:17"},
  {"Week": 3, "start":"2024:8:18", "end":"2024:8:24"},
  {"Week": 4, "start":"2024:8:25", "end":"2024:9:1"},
  {"Week": 5, "start":"2024:9:2", "end":"2024:9:8"},
  {"Week": 6, "start":"2024:9:9", "end":"2024:9:15"},
  {"Week": 7, "start":"2024:9:16", "end":"2024:9:22"},
  {"Week": 8, "start":"2024:9:23", "end":"2024:9:29"},
  {"Week": 9, "start":"2024:9:30", "end":"2024:10:5"},
  {"Week": 10, "start":"2024:10:6", "end":"2024:10:12"},
  {"Week": 11, "start":"2024:10:13", "end":"2024:10:19"},
  {"Week": 12, "start":"2024:10:20", "end":"2024:10:26"},
  {"Week": 13, "start":"2024:10:27", "end":"2024:11:3"},
  {"Week": 14, "start":"2024:11:4", "end":"2024:11:10"},
  {"Week": 15, "start":"2024:11:11", "end":"2024:11:17"},
  {"Week": 16, "start":"2024:11:18", "end":"2024:11:24"},
  {"Week": 17, "start":"2024:11:25", "end":"2024:11:31"}
]

export default function ScoreBoard({ year = 2021, week = 2 }) {
  const [rawData, setRawData] = useState(null);
  const [matchups, setMatchups] = useState([]);
  const [scores, setScores] = useState([]);
  const [actWeek, setActWeek] = useState(0);
  const [currWeek, setCurrWeek] = useState(week);
  const [rosters, setRosters] = useState(null);

  const getScores = useCallback(async () => {
    const url = `https://fantasy-backend-2b7122cce8cf.herokuapp.com/scores/${year}`;
    try {
      const response = await fetch(url);
      const rosterResponse = await fetch(`https://fantasy-backend-2b7122cce8cf.herokuapp.com/matchups/${year}/${week}`);
      if (!response.ok || !rosterResponse.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      const rosterJson = await rosterResponse.json();
      setRosters(rosterJson);
      return json;
    } catch (error) {
      console.error('Fetch error:', error.message);
    }
  }, [year, week]);

  const updateScoresAndMatchups = useCallback((data, week) => {
    let updatedMatchups = [];
    let updatedScores = [];
    setMatchups([]);
    week = parseInt(week, 10); // Ensure week is a number
    
    for (let week_entry of data['WeeklyScores']) {
      if (week_entry['Week'] === week) {
        updatedScores = rosters['teams'];
        updatedMatchups = week_entry['Matchups'];

        for (let game of updatedMatchups) {
          if(game['teamA'] === '' && game['teamB'] === ''){
            updatedMatchups = [];
            break;
          }
          for (let team of updatedScores) {
            if (team['Name'] === game['teamA']) {
              game['scoreA'] = team['totalPoints'];
              game['leftA'] = team['leftToPlay'];
              continue;
            }
            if (team['Name'] === game['teamB']) {
              game['scoreB'] = team['totalPoints'];
              game['leftB'] = team['leftToPlay'];
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

  const setCurrentWeek = useCallback(() => {
    function isDateinRange(dateStr, startStr, endStr) {
      function parseDate(dateStr) {
        const [y, m, d] = dateStr.split(':').map(Number);
        return new Date(y, m, d);
      }
      const d = parseDate(dateStr);
      const s = parseDate(startStr);
      const e = parseDate(endStr);
      
      return d >= s && d <= e;
    }

    const currentDate = new Date();
    const date = `${currentDate.getFullYear()}:${currentDate.getMonth()}:${currentDate.getDate()}`;
    
    for (let week of weekRanges2024) {
      if (isDateinRange(date, week['start'], week['end'])) {
        setActWeek(week['Week']);
        break;
      }
    }
  }, []);

  useEffect(() => {
    setCurrentWeek();
  }, [setCurrentWeek]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getScores(year);
      if (response) {
        setRawData(response);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 60 * 1000);
    return () => clearInterval(intervalId);
  }, [year, getScores]);

  useEffect(() => {
    setCurrWeek(week);
    setCurrentWeek()
  }, [week, setCurrentWeek]);

  useEffect(() => {
    if (rawData) {
      updateScoresAndMatchups(rawData, currWeek);
    }
  }, [currWeek, rawData, updateScoresAndMatchups, actWeek]); // Ensure actWeek re-renders

  return (
    <table>
      <thead>
        {currWeek !== actWeek ? (
          <tr>
            <th>Team</th>
            <th>Points</th>
            <th />
            <th>Points</th>
            <th>Team</th>
          </tr>
        ) : (
          <tr>
            <th>Team</th>
            <th>Players Left</th>
            <th>Points</th>
            <th />
            <th>Points</th>
            <th>Players Left</th>
            <th>Team</th>
          </tr>
        )}
      </thead>
      <tbody>
        {matchups.length > 0 ? (
          matchups.map((game) => (
            <tr key={game.teamA}>
              {currWeek === actWeek ? (
                <>
                  <td>{game.teamA}</td>
                  <td>{game.leftA || '0'}</td>
                  <td>{game.scoreA.toFixed(2) || '0'}</td>
                  <td>-</td>
                  <td>{game.scoreB.toFixed(2) || '0'}</td>
                  <td>{game.leftB || '0'}</td>
                  <td>{game.teamB}</td>
                </>
              ) : (
                <>
                  <td>{game.teamA}</td>
                  <td>{game.scoreA.toFixed(2) || '0'}</td>
                  <td>-</td>
                  <td>{game.scoreB.toFixed(2) || '0'}</td>
                  <td>{game.teamB}</td>
                </>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={currWeek === actWeek ? "7" : "5"}>No data available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
