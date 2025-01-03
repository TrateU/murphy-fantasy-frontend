import React, { useEffect, useState } from "react";
import ScoreBoard from "../components/ScoreBoard/ScoreBoard";
import {weekRanges2024,currentYear} from "../info"

export default function ScoresPage(){
    const [yearDropdown, setYear] = useState(currentYear)
    const [weekDropdown, setWeek] = useState(1)
    const [currWeek, setCurrWeek] = useState(1)
    const [weekSet, setWeekSet] = useState(0)

    const handleYearChange = (event) => {
        setYear(event.target.value)
    }

    const handleWeekChange = (event) => {
        setWeek(event.target.value)
        setWeekSet(1)
    }

    const setCurrentWeek = () => {
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

    }

    useEffect(()=>{
        setCurrentWeek()
        if(currWeek && !weekSet){
            setWeek(currWeek)
        }
    })

    const setViewCurrentWeek = () =>{
        setWeek(currWeek)
        setYear(currentYear)
    }



    return(
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
            <ScoreBoard year={parseInt(yearDropdown)} week={parseInt(weekDropdown)}/>
        </div>
    )

}