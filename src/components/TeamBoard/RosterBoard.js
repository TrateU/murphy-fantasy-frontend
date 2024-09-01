import React, {useCallback} from "react";


export default function RosterBoard({roster = []}){


    const addPlayersToTable = useCallback(() => {
        const positionOrder = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'D/ST', 'K', 'Bench', 'IR'];
        const rows = [];

        positionOrder.forEach((slot, index) => {
            const playersA = roster.filter(player => player.slot === slot);
            const maxLength = playersA.length;

            for (let i = 0; i < maxLength; i++) {
                const playerA = playersA[i] || null;

                rows.push(
                    <tr key={`${index}-${i}-${playerA?.name || 'emptyA'}`}>
                        <td>{playerA?.slot || ''}</td>
                        <td style={{width: '350px'}}>
                            {`${playerA?.name}`|| ''}
                            <br/>
                            {playerA?.team} - {playerA?.position}

                        </td>
                        <td>{playerA ? playerA.bye : ''}</td>
                        <td>{playerA ? playerA.averagePoints.toFixed(2) : ''}</td>
                        <td>{playerA ? playerA.totalPoints.toFixed(2) : ''}</td>
                        <td>{playerA ? playerA.posRank : ''}</td>
                    </tr>
                );
            }

            if (slot === 'K') {
                rows.push(
                    <tr key={`separator-${slot}`}>
                        <td colSpan="7" style={{ backgroundColor: '#d3d3d3', height: '4px', padding: '0' }}>
                            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '0.85em', lineHeight: '1.5em' }}>
                            </div>
                        </td>
                    </tr>
                );
            }
        });

        return rows;
    }, [roster]);


    return(
        <table>
            <thead>
                <tr>
                    <th colSpan={6} style={{textAlign: 'center'}}>Roster</th>
                </tr>
                <tr>
                    <th>Slot</th>
                    <th>Name &#40;Pos&#41;</th>
                    <th>Bye</th>
                    <th>Avg Pts</th>
                    <th>Total Pts</th>
                    <th>Pos Rank</th>
                </tr>
            </thead>
            <tbody>
            {roster.length > 0 ? (
                addPlayersToTable()
                ) : (
                <tr>
                    <td colSpan="5">No data available</td>
                </tr>
            )}
            </tbody>
        </table>
    )
}