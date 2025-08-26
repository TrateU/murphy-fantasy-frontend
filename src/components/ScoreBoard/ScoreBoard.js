import { useState, useEffect, useCallback } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import './ScoreBoard.css';

export const weekRanges2025 = [
    {"Week": 1, "start":"2025:8:3", "end":"2025:8:9"},
    {"Week": 2, "start":"2025:8:10", "end":"2025:8:16"},
    {"Week": 3, "start":"2025:8:17", "end":"2025:8:23"},
    {"Week": 4, "start":"2025:8:24", "end":"2025:8:30"},
    {"Week": 5, "start":"2025:9:1", "end":"2025:9:7"},
    {"Week": 6, "start":"2025:9:8", "end":"2025:9:14"},
    {"Week": 7, "start":"2025:9:15", "end":"2025:9:21"},
    {"Week": 8, "start":"2025:9:22", "end":"2025:9:28"},
    {"Week": 9, "start":"2025:9:29", "end":"2025:10:4"},
    {"Week": 10, "start":"2025:10:5", "end":"2025:10:11"},
    {"Week": 11, "start":"2025:10:12", "end":"2025:10:18"},
    {"Week": 12, "start":"2025:10:19", "end":"2025:10:25"},
    {"Week": 13, "start":"2025:10:26", "end":"2025:11:2"},
    {"Week": 14, "start":"2025:11:3", "end":"2025:11:9"},
    {"Week": 15, "start":"2025:11:10", "end":"2025:11:16"},
    {"Week": 16, "start":"2025:11:17", "end":"2025:11:23"},
    {"Week": 17, "start":"2025:11:24", "end":"2025:11:30"}
]

const actualYear = 2025

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
    
    for (let week of weekRanges2025) {
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
