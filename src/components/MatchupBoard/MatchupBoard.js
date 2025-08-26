import React, { useEffect, useState, useCallback } from "react";

const team_format = {
    "Name": "TEMP",
    "Team": "TEMP",
    "Score": 0,
    "Roster": []
};

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

const currentYear = 2025

export default function MatchupBoard({ year = 2025, week = 0, match = 0 }) {
    const [matchups, setMatchups] = useState(null);
    const [rosters, setRosters] = useState(null);
    const [currWeek, setCurrWeek] = useState(0)
    const [weekSet, setWeekSet] = useState(1)
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
        const intId = setInterval(setCurrentWeek, 5 * 1000);
        return () => clearInterval(intId);
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
        for (let week of weekRanges2025) {
            if (isDateinRange(date, week['start'], week['end'])) {
                setCurrWeek(week['Week']);
                break;
            }
        }
    }

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 5 * 1000);
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
    
                if (currWeek === week && year === currentYear) {
                    rows.push(
                        <tr key={`${index}-${i}-${playerA?.name || 'emptyA'}-${playerB?.name || 'emptyB'}`}>
                            <td>{playerA?.position || ''}</td>
                            <td style={{ whiteSpace: 'nowrap'}}>{playerA?.name || ''}
                                <br/>
                                {playerA?.proTeamAbbrev} 
                                <br/>
                                {playerA?.startTime} 
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
                                {playerA?.startTime} 
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
    
            if (position === 'K' && currWeek === week && currentYear === year) {
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
    }, [currWeek, week, year]);
    

    return (
        <table>
            <thead>
                {currWeek === week && year === currentYear ? (
                <>
                <tr>
                    <th colSpan="3">{teamA['Name']}</th>
                    <th colSpan="3" />
                    <th colSpan="3">{teamB['Name']}</th>
                </tr>
                <tr>
                    <th colSpan="3">{teamA['Team']}</th>
                    <th colSpan="3" />
                    <th colSpan="3">{teamB['Team']}</th>
                </tr>
                <tr>
                    <th colSpan="3">{teamA['Score'].toFixed(2)}</th>
                    <th colSpan="3" />
                    <th colSpan="3">{(teamB['Score'] || 0).toFixed(2)}</th>
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
                    {currWeek === week && currentYear === year ? (
                        <th>Proj</th>
                    ):(
                        <></>
                    )}
                    <th>Pts</th>
                    <th />
                    <th>Pts</th>
                    {currWeek === week && currentYear === year ? (
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
