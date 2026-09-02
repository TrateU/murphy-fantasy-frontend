import React, {useState, useEffect, useCallback} from "react";
import ScoreBoard from "../components/ScoreBoard/ScoreBoard";
import {weekRanges2026,currentYear} from "../info"

export default function HomePage(){
    const [currWeek, setCurrWeek] = useState(0)

    const setCurrentWeek = useCallback(() => {
        function isDateinRange(dateStr, startStr, endStr){
            function parseDate(dateStr){
                const [y,m,d] = dateStr.split(':').map(Number);
                return new Date(y,m,d)
            }
            const d = parseDate(dateStr)
            const s = parseDate(startStr)
            const e = parseDate(endStr)
            
            return d >= s && d <= e
        }
        const year = new Date().getFullYear()
        const month = new Date().getMonth()
        const day = new Date().getDate()

        const date = `${year}:${month}:${day}`
        for(let week of weekRanges2026){
            if(isDateinRange(date,week['start'],week['end'])){
                setCurrWeek(week['Week'])
                break
            }
        }

    })
    useEffect(()=>{
        setCurrentWeek()
        const intervalId = setInterval(setCurrentWeek, 5 * 1000);
        return () => clearInterval(intervalId);
    },[setCurrentWeek])

    return(
        <div>
            <h1>Murphy Fantasy</h1>
            <br/>
            &nbsp;
            <a href="https://fantasy.espn.com/football/league?leagueId=52278251" target="_blank">Mary's Football Conference</a>
            <br/>
            <br/>
            &nbsp;
            <a href="https://fantasy.espn.com/football/league?leagueId=1306743362" target="_blank">Jack's Football Conference</a>
            <br/>
            <br/>
            <br/>
            <h3>Current Scores:</h3>
            <ScoreBoard year={currentYear} week={currWeek} />
        </div>
    )
}