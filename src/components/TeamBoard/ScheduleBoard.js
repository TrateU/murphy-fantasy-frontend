import React, { useCallback } from "react";



export default function ScheduleBoard({schedule = []}){

    const getTableData = useCallback(()=>{
        if (schedule.length === 0) return
        const rows = []
        for(let weekNum = 0; weekNum < 7; weekNum++){
            rows.push(
                <tr>
                <td>{weekNum + 1}</td>
                <td style={{width: '300px'}}>
                    {schedule[weekNum].Opponent} 
                    {schedule[weekNum].Result !== 'NA' ? ` - ${schedule[weekNum].Result}` : ''}
                    <br />
                    {schedule[weekNum].Result !== 'NA' ? `(${schedule[weekNum].For} - ${schedule[weekNum].Against})` : ''}
                </td>
                <td>{weekNum + 8}</td>
                <td style={{width: '300px'}}>
                    {schedule[weekNum+7].Opponent} 
                    {schedule[weekNum+7].Result !== 'NA' ? ` - ${schedule[weekNum+7].Result}` : ''}
                    <br />
                    {schedule[weekNum+7].Result !== 'NA' ? `(${schedule[weekNum+7].For} - ${schedule[weekNum+7].Against})` : ''}
                </td>
                </tr>
            )
        }
        return rows
    },[schedule])




    return(
        <table>
            <thead>
                <tr>
                    <th colSpan={4}>Schedule</th>
                </tr>
                <tr>
                    <th>Week</th>
                    <th>Matchup</th>
                    <th>Week</th>
                    <th>Matchup</th>
                </tr>
            </thead>
            <tbody>
                {getTableData()}
            </tbody>
        </table>
    )
}