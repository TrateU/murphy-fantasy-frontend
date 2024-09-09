import React, { useEffect, useState, useCallback } from "react";

const team_format = {
    "Name": "TEMP",
    "Team": "TEMP",
    "Score": 0,
    "Roster": []
};

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
const currentYear = 2024

export default function MatchupBoard({ year = 2024, week = 1, match = 0 }) {
    const [matchups, setMatchups] = useState(null);
    const [rosters, setRosters] = useState(null);
    const [currWeek, setCurrWeek] = useState(1)
    const [weekSet, setWeekSet] = useState(0)
    const [teamA, setTeamA] = useState(team_format);
    const [teamB, setTeamB] = useState(team_format);

    const fetchData = useCallback(async () => {
        try {
            const matchupsResponse = await fetch(`https://fantasy-backend-2b7122cce8cf.herokuapp.com/scores/${year}`);
            const rosterResponse = await fetch(`https://fantasy-backend-2b7122cce8cf.herokuapp.com/matchups/${year}/${week}`);
            
            if (!matchupsResponse.ok || !rosterResponse.ok) {
                throw new Error(`Error fetching data`);
            }
            
            const matchupsJson = await matchupsResponse.json();
            const rostersJson = await rosterResponse.json();
            let weekMatchups = []
            for (let week_entry of matchupsJson['WeeklyScores']) {
                if (week_entry['Week'] === week) {
                    weekMatchups = week_entry['Matchups']
                }
            }
            setMatchups(weekMatchups);
            setRosters(rostersJson);
            
        } catch (error) {
            console.error('Fetch error:', error.message);
        }
    }, [year, week]);  // Now using `week` directly

    useEffect(() => {
        setCurrentWeek();
    }, [currWeek, weekSet]);

    const setCurrentWeek = () => {
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
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const day = new Date().getDate();

        const date = `${year}:${month}:${day}`;
        for (let week of weekRanges2024) {
            if (isDateinRange(date, week['start'], week['end'])) {
                setCurrWeek(week['Week']);
                break;
            }
        }
    }

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 60 * 1000);
        return () => clearInterval(intervalId);
    }, [fetchData]);

    useEffect(() => {
        if (matchups && rosters) {
            const teamAData = {
                ...team_format,
                Name: matchups[match]?.['teamA'] || 'Unknown'
            };
            const teamBData = {
                ...team_format,
                Name: matchups[match]?.['teamB'] || 'Unknown'
            };

            for (let team of rosters['teams']) {
                if (team['Name'] === teamAData.Name) {
                    teamAData.Team = team['Team'];
                    teamAData.Roster = team['roster'];
                    teamAData.Score = team['totalPoints']
                    teamAData.Projected = team['projPoints']
                }
                if (team['Name'] === teamBData.Name) {
                    teamBData.Team = team['Team'];
                    teamBData.Roster = team['roster'];
                    teamBData.Score = team['totalPoints']
                    teamBData.Projected = team['projPoints']
                }
            }

            setTeamA(teamAData);
            setTeamB(teamBData);
        }
    }, [matchups, rosters, match]);

    const addPlayersToTable = useCallback((teamA, teamB) => {
        const positionOrder = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'D/ST', 'K', 'Bench', 'IR'];
        const rows = [];
    
        positionOrder.forEach((position, index) => {
            const playersA = teamA['Roster'].filter(player => player.position === position);
            const playersB = teamB['Roster'].filter(player => player.position === position);
            const maxLength = Math.max(playersA.length, playersB.length);
    
            for (let i = 0; i < maxLength; i++) {
                const playerA = playersA[i] || null;
                const playerB = playersB[i] || null;
    
                const playerAProjPoints = playerA?.projPoints !== undefined ? playerA.projPoints.toFixed(2) : '';
                const playerAPoints = playerA?.points !== undefined ? playerA.points.toFixed(2) : '';
                const playerBProjPoints = playerB?.projPoints !== undefined ? playerB.projPoints.toFixed(2) : '';
                const playerBPoints = playerB?.points !== undefined ? playerB.points.toFixed(2) : '';
    
                if (currWeek === week) {
                    rows.push(
                        <tr key={`${index}-${i}-${playerA?.name || 'emptyA'}-${playerB?.name || 'emptyB'}`}>
                            <td>{playerA?.position || ''}</td>
                            <td style={{ whiteSpace: 'nowrap'}}>{playerA?.name || ''}
                                <br/>
                                {playerA?.proTeamAbbrev} 
                                <br/>
                                {playerB?.startTime} 
                            </td>
                            <td>{playerAProjPoints}</td>
                            {playerA?.isFinal ? (<td style={{fontWeight: "bold"}}>{playerAPoints}</td>):(<td>{playerAPoints}</td>)} 
                            <td/>
                            {playerB?.isFinal ? (<td style={{fontWeight: "bold"}}>{playerBPoints}</td>):(<td>{playerBPoints}</td>)} 
                            <td>{playerBProjPoints}</td>
                            <td style={{ whiteSpace: 'nowrap'}}>{playerB?.name || ''}
                                <br/>
                                {playerB?.proTeamAbbrev}
                                <br/>
                                {playerB?.startTime}
                            </td>
                            <td>{playerB?.position || ''}</td>
                        </tr>
                    );
                } else {
                    rows.push(
                        <tr key={`${index}-${i}-${playerA?.name || 'emptyA'}-${playerB?.name || 'emptyB'}`}>
                            <td>{playerA?.position || ''}</td>
                            <td style={{ whiteSpace: 'nowrap'}}>{playerA?.name || ''}
                                <br/>
                                {playerA?.proTeamAbbrev} 
                                <br/>
                                {playerB?.startTime} 
                            </td>
                            <td>{playerAPoints}</td>
                            <td></td> {/* Separator column */}
                            <td>{playerBPoints}</td>
                            <td style={{ whiteSpace: 'nowrap'}}>{playerB?.name || ''}
                                <br/>
                                {playerB?.proTeamAbbrev}
                                <br/>
                                {playerB?.startTime}
                            </td>
                            <td>{playerB?.position || ''}</td>
                        </tr>
                    );
                }
            }
    
            if (position === 'K' && currWeek === week) {
                rows.push(
                    <>
                    <tr style={{fontWeight: "bold"}} key={`total-projected-${position}`}>
                        <td colSpan={2}>Totals</td>
                        <td style={{fontWeight: "normal"}}>{teamA.Projected?.toFixed(2) || '0.00'}</td>
                        <td style={{fontSize: '1.2em'}}>{teamA.Score?.toFixed(2) || '0.00'}</td>
                        <td colSpan={1}/>
                        <td style={{fontSize: '1.2em'}}>{teamB.Score?.toFixed(2) || '0.00'}</td>
                        <td style={{fontWeight: "normal"}}>{teamB.Projected?.toFixed(2) || '0.00'}</td>
                        <td colSpan={2}>Totals</td>
                    </tr>
                    <tr key={`separator-${position}`}>
                        <td colSpan="9" style={{ backgroundColor: '#d3d3d3', height: '4px', padding: '0' }}>
                            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '0.85em', lineHeight: '1.5em' }}>
                            </div>
                        </td>
                    </tr>
                    </>
                );
            } else if(position === 'K') {
                rows.push(
                    <tr key={`separator-${position}`}>
                        <td colSpan="7" style={{ backgroundColor: '#d3d3d3', height: '4px', padding: '0' }}>
                            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '0.85em', lineHeight: '1.5em' }}>
                            </div>
                        </td>
                    </tr>
                );
            }
        });
    
        return rows;
    }, [currWeek, week]);
    

    return (
        <table>
            <thead>
                {currWeek === week ? (
                <>
                <tr>
                    <th colSpan="5">{teamA['Name']}</th>
                    <th />
                    <th colSpan="5">{teamB['Name']}</th>
                </tr>
                <tr>
                    <th colSpan="5">{teamA['Team']}</th>
                    <th />
                    <th colSpan="5">{teamB['Team']}</th>
                </tr>
                <tr>
                    <th colSpan="5">{teamA['Score'].toFixed(2)}</th>
                    <th />
                    <th colSpan="5">{(teamB['Score'] || 0).toFixed(2)}</th>
                </tr>
                </>
                ):(
                <>
                <tr>
                    <th colSpan="3">{teamA['Name']}</th>
                    <th />
                    <th colSpan="3">{teamB['Name']}</th>
                </tr>
                <tr>
                    <th colSpan="3">{teamA['Team']}</th>
                    <th />
                    <th colSpan="3">{teamB['Team']}</th>
                </tr>
                <tr>
                    <th colSpan="3">{(teamA['Score'] || 0).toFixed(2)}</th>
                    <th />
                    <th colSpan="3">{(teamB['Score'] || 0).toFixed(2)}</th>
                </tr>
                </>
                )}
                <tr>
                    <th>Pos</th>
                    <th>Player</th>
                    {currWeek === week ? (
                        <th>Proj</th>
                    ):(
                        <></>
                    )}
                    <th>Pts</th>
                    <th />
                    <th>Pts</th>
                    {currWeek === week ? (
                        <th>Proj</th>
                    ):(
                        <></>
                    )}
                    <th>Player</th>
                    <th>Pos</th>
                </tr>
            </thead>
            <tbody>
                {addPlayersToTable(teamA, teamB)}
            </tbody>
        </table>
    );
}
