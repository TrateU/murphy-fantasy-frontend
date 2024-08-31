import React, {useState,useEffect} from "react";


export default function StandingsTable({stats = {}}){
    return(
        <table>
            <thead>
                <tr>
                    <th colSpan={11}>{stats['Division']}</th>
                </tr>
                <tr>
                    <th>Rank</th>
                    <th style={{width:100}}>Team</th>
                    <th>W</th>
                    <th>L</th>
                    <th>W%</th>
                    <th>Points For</th>
                    <th>Points Against</th>
                    <th>Point Difference</th>
                    <th>Div W</th>
                    <th>Div L</th>
                    <th>Div W%</th>
                </tr>
            </thead>
            <tbody>
                {stats['teams'] && stats['teams'].length > 0 ? (
                    stats['teams'].map((team, index) => (
                        <tr key={team.Name}>
                            <td>{index+1}</td>
                            <td>{team.Name}</td>
                            <td>{team.Wins}</td>
                            <td>{team.Losses}</td>
                            <td>{team.wPercentage.toFixed(3)}</td>
                            <td>{team.TotalFor.toFixed(2)}</td>
                            <td>{team.TotalAgainst.toFixed(2)}</td>
                            <td>{team.PointDiff.toFixed(2)}</td>
                            <td>{team.DivWins}</td>
                            <td>{team.DivLosses}</td>
                            <td>{team.wDivPercentage.toFixed(3)}</td>
                        </tr>
                    ))
                ):(
                    <tr>
                        <td colSpan="11">No data available</td>
                    </tr>
                )}
            </tbody>
        </table>
    )   
}