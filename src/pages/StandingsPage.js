import React, { useCallback, useEffect, useState } from "react";
import StandingsTable from "../components/StandingsTable/StandingsTable";

export default function StandingsPage() {
    const [year, setYear] = useState(2024);
    const [fetchedData, setFetched] = useState(null);
    const [mfcArray, setMFC] = useState({ "Division": "Mary's Football Conference", "teams": [] });
    const [jfcArray, setJFC] = useState({ "Division": "Jack's Football Conference", "teams": [] });

    const getStats = useCallback(async () => {
        const url = `https://fantasy-backend-2b7122cce8cf.herokuapp.com/stats/${year}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const json = await response.json();
            console.log(json);
            setFetched(json);
        } catch (error) {
            console.error('Fetch error:', error.message);
        }
    }, [year]);

    const updateStandingsDefault = useCallback(() => {
        if (!fetchedData) return;

        let mData = { 'Division': "Mary's Football Conference", "teams": [] };
        let jData = { 'Division': "Jack's Football Conference", "teams": [] };

        for (let team of fetchedData['teamStats']) {
            if (team['Division'] === "MFC") {
                mData['teams'].push(team);
            }
            if (team['Division'] === "JFC") {
                jData['teams'].push(team);
            }
        }
        
        mData['teams'].sort((a,b) => {
            if(b.wPercentage !== a.wPercentage){
                return b.wPercentage - a.wPercentage
            }else if (b.wDivPercentage !== a.wDivPercentage){
                return b.wDivPercentage - a.wDivPercentage
            }else{
                return b.TotalFor - a.TotalFor
            }
        })
        jData['teams'].sort((a,b) => {
            if(b.wPercentage !== a.wPercentage){
                return b.wPercentage - a.wPercentage
            }else if (b.wDivPercentage !== a.wDivPercentage){
                return b.wDivPercentage - a.wDivPercentage
            }else{
                return b.TotalFor - a.TotalFor
            }
        })

        setMFC({ ...mData });
        setJFC({ ...jData });
    }, [fetchedData]);

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    useEffect(() => {
        // Fetch data initially and set an interval to fetch it every minute
        getStats();
        const intervalId = setInterval(getStats, 60 * 1000);
        return () => clearInterval(intervalId);
    }, [getStats]);

    useEffect(() => {
        // Update standings whenever fetchedData changes
        updateStandingsDefault();
    }, [fetchedData, updateStandingsDefault]);

    return (
        <div>
            <select value={year} onChange={handleYearChange}>
                <option value={2021}>2021</option>
                <option value={2022}>2022</option>
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
            </select>
            <StandingsTable stats={mfcArray} />
            <StandingsTable stats={jfcArray} />
        </div>
    );
}
