import React, {useState, useEffect, useCallback} from "react";
import ScoreBoard from "../components/ScoreBoard/ScoreBoard";

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
        for(let week of weekRanges2024){
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
            <a href="https://fantasy.espn.com/football/league?leagueId=52278251" target="_blank">Jack's Football Conference</a>
            <br/>
            <br/>
            &nbsp;
            <a href="https://fantasy.espn.com/football/league?leagueId=1306743362" target="_blank">Mary's Football Conference</a>
            <br/>
            <br/>
            <br/>
            <h3>Current Scores:</h3>
            <ScoreBoard year={currentYear} week={currWeek} />
        </div>
    )



}