import React, { useEffect, useState } from "react";
import ScoreBoard from "../components/ScoreBoard/ScoreBoard";
import MatchupBoard from "../components/MatchupBoard/MatchupBoard";

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

export default function MatchupPage() {
    const [yearDropdown, setYear] = useState(2024)
    const [weekDropdown, setWeek] = useState(1)
    const [currWeek, setCurrWeek] = useState(1)
    const [weekSet, setWeekSet] = useState(0)
    const [currMatch, setMatch] = useState(0)
    const [maxMatchup, setMaxMatch] = useState(9)

    const handleYearChange = (event) => {
        setYear(event.target.value)
    }

    const handleWeekChange = (event) => {
        const selectedWeek = parseInt(event.target.value);
        setWeek(selectedWeek);
        setWeekSet(1);
        setMatch(0)
    }

    useEffect(() => {
        if (weekDropdown <= 14) {
            setMaxMatch(9);
        } else if (weekDropdown === 15) {
            setMaxMatch(4);
        } else if (weekDropdown === 16) {
            setMaxMatch(2);
        } else if (weekDropdown === 17) {
            setMaxMatch(1);
        }
    }, [weekDropdown]);

    useEffect(() => {
        setCurrentWeek();
        if (currWeek && !weekSet) {
            setWeek(currWeek);
        }
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

    const setViewCurrentWeek = () => {
        setMatch(0)
        setWeek(currWeek);
        setYear(currentYear);
    }

    const updateMatchLeft = () => {
        if (currMatch !== 0) {
            setMatch(currMatch - 1);
        } else {
            setMatch(maxMatchup - 1);
        }
    }

    const updateMatchRight = () => {
        if (currMatch !== maxMatchup - 1) {
            setMatch(currMatch + 1);
        } else {
            setMatch(0);
        }
    }

    return (
        <div>
            &nbsp;
            <select value={yearDropdown} onChange={handleYearChange}>
                <option value={2021}>2021</option>
                <option value={2022}>2022</option>   
                <option value={2023}>2023</option>   
                <option value={2024}>2024</option>       
            </select>
            <select value={weekDropdown} onChange={handleWeekChange}>
                <option value={1}>Week 1</option>
                <option value={2}>Week 2</option>   
                <option value={3}>Week 3</option>   
                <option value={4}>Week 4</option>
                <option value={5}>Week 5</option>
                <option value={6}>Week 6</option>   
                <option value={7}>Week 7</option>   
                <option value={8}>Week 8</option>
                <option value={9}>Week 9</option>
                <option value={10}>Week 10</option>   
                <option value={11}>Week 11</option>   
                <option value={12}>Week 12</option>
                <option value={13}>Week 13</option>
                <option value={14}>Week 14</option> 
                <option value={15}>Playoffs Week 1</option>
                <option value={16}>Playoffs Week 2</option>
                <option value={17}>Playoffs Week 3</option>               
            </select>
            <button onClick={setViewCurrentWeek}>Current Week</button>
            <div>
            &ensp;
            <button onClick={updateMatchLeft}>{'<'}</button>
            <>  Matchup {currMatch + 1} of {maxMatchup}  </>
            <button onClick={updateMatchRight}>{'>'}</button>
            </div>
            <MatchupBoard year={yearDropdown} week={weekDropdown} match={currMatch}/>
        </div>
    )
}