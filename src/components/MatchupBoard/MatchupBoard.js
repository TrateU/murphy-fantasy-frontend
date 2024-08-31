import React, { useEffect, useState, useCallback } from "react";

const team_format = {
    "Name": "TEMP",
    "Team": "TEMP",
    "Score": 0,
    "Roster": []
};

export default function MatchupBoard({ year = 2024, week = 1, match = 0 }) {
    const [matchups, setMatchups] = useState(null);
    const [rosters, setRosters] = useState(null);
    const [teamA, setTeamA] = useState(team_format);
    const [teamB, setTeamB] = useState(team_format);
    const [currWeek,setCurrWeek] = useState(week)

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
                if (week_entry['Week'] === currWeek) {
                    weekMatchups = week_entry['Matchups']
                }
            }
            setMatchups(weekMatchups);
            setRosters(rostersJson);
            
        } catch (error) {
            console.error('Fetch error:', error.message);
        }
    }, [year, currWeek]);

    useEffect(() => {
        setCurrWeek(parseInt(week))
        fetchData();
        const intervalId = setInterval(fetchData, 60 * 1000);
        return () => clearInterval(intervalId);
    }, [fetchData, week]);

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
                }
                if (team['Name'] === teamBData.Name) {
                    teamBData.Team = team['Team'];
                    teamBData.Roster = team['roster'];
                }
            }
            teamAData.Score = 0
            teamAData.Score = teamAData.Roster
                .filter(player => player.position !== 'IR' && player.position !== 'Bench')
                .reduce((total, player) => total + player.points, 0);

            teamBData.Score = 0
            teamBData.Score = teamBData.Roster
                .filter(player => player.position !== 'IR' && player.position !== 'Bench')
                .reduce((total, player) => total + player.points, 0);

            setTeamA(teamAData);
            setTeamB(teamBData);
        }
    }, [matchups, rosters, match, week]);

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

                rows.push(
                    <tr key={`${index}-${i}-${playerA?.name || 'emptyA'}-${playerB?.name || 'emptyB'}`}>
                        <td>{playerA?.position || ''}</td>
                        <td>{playerA?.name || ''}</td>
                        <td>{playerA ? playerA.points.toFixed(2) : ''}</td>
                        <td></td> {/* Separator column */}
                        <td>{playerB ? playerB.points.toFixed(2) : ''}</td>
                        <td>{playerB?.name || ''}</td>
                        <td>{playerB?.position || ''}</td>
                    </tr>
                );
            }

            if (position === 'K') {
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
    }, []);

    return (
        <table>
            <thead>
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
                    <th colSpan="3">{teamA['Score'].toFixed(2)}</th>
                    <th />
                    <th colSpan="3">{teamB['Score'].toFixed(2)}</th>
                </tr>
                <tr>
                    <th>Pos</th>
                    <th>Player</th>
                    <th>Pts</th>
                    <th />
                    <th>Pts</th>
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
