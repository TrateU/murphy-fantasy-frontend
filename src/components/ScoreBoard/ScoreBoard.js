import { useState, useEffect, useCallback } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
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
const actualYear = 2024

const defaultData = {
  "WeeklyScores": []
}

export default function ScoreBoard({ year = 2021, week = 2 }) {
  const [rawData, setRawData] = useState(null);
  const [matchups, setMatchups] = useState([]);
  const [scores, setScores] = useState([]);
  const [actWeek, setActWeek] = useState(0);
  const [currWeek, setCurrWeek] = useState(parseInt(week));
  const [rosters, setRosters] = useState(null);
  const navigate = useNavigate()

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
      return defaultData
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
              game['inA'] = team['inPlay']
              game['leftA'] = team['leftToPlay'];
              game['doneA'] = team['donePlay']
              continue;
            }
            if (team['Name'] === game['teamB']) {
              game['scoreB'] = team['totalPoints'];
              game['inB'] = team['inPlay']
              game['leftB'] = team['leftToPlay'];
              game['doneB'] = team['donePlay']
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
    if(year !== actualYear){
      setActWeek(0)
      return
    }
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
  }, [year]);

  const handleRowClick = useCallback((rowData) =>{
    console.log(rowData)
    navigate(`/matchups/${rowData.year}/${rowData.week}/${rowData.match}`)
  })

  useEffect(() => {
    if(year === actualYear){
      const timeId = setInterval(setCurrentWeek, 60 * 1000);
      return () => clearInterval(timeId);
    }
  }, [year,setCurrentWeek]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getScores(year);
      if (response) {
        setRawData(response);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5 * 1000);
    return () => clearInterval(intervalId);
  }, [year, getScores]);

  useEffect(() => {
    setCurrWeek(week);
    if(year === actualYear){
      setCurrentWeek(); 
    }
  }, [week, setCurrentWeek]);

  useEffect(() => {
    if (rawData) {
      updateScoresAndMatchups(rawData, currWeek);
    }
  }, [currWeek, rawData, updateScoresAndMatchups, actWeek]); // Ensure actWeek re-renders

  return (
    <div>
      <table>
        <thead>
          {currWeek !== actWeek || year !== actualYear ? (
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
              <th>TP/IP/DP</th>
              <th>Points</th>
              <th />
              <th>Points</th>
              <th>TP/IP/DP</th>
              <th>Team</th>
            </tr>
          )}
        </thead>
        <tbody>
        {matchups.length > 0 ? (
          matchups.map((game,index) => {
            const isNotCurrentWeek = currWeek !== actWeek;
            const isNotCurrentYear = year !== actualYear
            const teamAHasHigherScore = game.scoreA > game.scoreB;
            const scoresAreEqual = game.scoreA === game.scoreB;

            return (
              
              <tr key={game.teamA} onClick={() => handleRowClick({"match":index, "week":week, "year":year})}>
                {currWeek === actWeek && !isNotCurrentYear ? (
                  <>
                    <td>{game.teamA}</td>
                    <td>{game.leftA} / {game.inA} / {game.doneA}</td>
                    <td>{game.scoreA.toFixed(2) || '0'}</td>
                    <td>-</td>
                    <td>{game.scoreB.toFixed(2) || '0'}</td>
                    <td>{game.leftB} / {game.inB} / {game.doneB}</td>
                    <td>{game.teamB}</td>
                  </>
                ) : (
                  <>
                    <td>{game.teamA}</td>
                    <td
                      className={
                        isNotCurrentWeek && game.leftA === 0 && game.leftB === 0 && !scoresAreEqual || isNotCurrentYear
                          ? teamAHasHigherScore
                            ? 'green-bg'
                            : 'red-bg'
                          : '' // Explicitly reset class when it's the current week
                      }
                    >
                      {game.scoreA.toFixed(2) || '0'}
                    </td>
                    <td>-</td>
                    <td
                      className={
                        isNotCurrentWeek && game.leftA === 0 && game.leftB === 0 && !scoresAreEqual || isNotCurrentYear
                          ? teamAHasHigherScore
                            ? 'red-bg'
                            : 'green-bg'
                          : '' // Explicitly reset class when it's the current week
                      }
                    >
                      {game.scoreB.toFixed(2) || '0'}
                    </td>
                    <td>{game.teamB}</td>
                  </>
                )}
              </tr>
              
            );
          })
        ) : (
          <tr>
            <td colSpan={currWeek === actWeek ? "7" : "5"}>No data available</td>
          </tr>
        )}
      </tbody>
      </table>
      {currWeek === actWeek && year === actualYear ? (
        <p>
          * TP = Players left to play <br />
          * IP = Players in play <br />
          * DP = Players done playing <br />
        </p>
      ) : (
        <></>
      )}
    </div>
  );
}
