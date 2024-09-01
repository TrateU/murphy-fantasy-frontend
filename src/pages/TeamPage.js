import React, { useState, useCallback, useEffect } from "react";
import RosterBoard from "../components/TeamBoard/RosterBoard";
import ScheduleBoard from "../components/TeamBoard/ScheduleBoard";

export default function TeamPage() {
    const [fetchedData, setFetched] = useState({ teamStats: [] }); // Initialize with a structure
    const [team, setTeam] = useState({})
    const [owner, setOwner] = useState("")
    const [roster, setRoster] = useState([])
    const [schedule, setSchedule] = useState([])

    const getTeams = useCallback(async () => {
        const url = `https://fantasy-backend-2b7122cce8cf.herokuapp.com/teams`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const json = await response.json();
            setFetched(json);
        } catch (error) {
            console.error('Fetch error:', error.message);
        }
    }, []);

    const updateOptions = useCallback(() => {
        if (!fetchedData || !Array.isArray(fetchedData.teamStats)) return []; // Return an empty array if teamStats is not valid

        const options = [];
        const teamNames = [];

        for (let findTeam of fetchedData.teamStats) {
            options.push(
                <option key={findTeam.Name} value={findTeam.Name}>{findTeam.Name}</option>
            );
            teamNames.push(findTeam.Name); // Keep track of team names
        }

        // If owner is not set and there are team names available, set it to the first team
        if (!owner && teamNames.length > 0) {
            setOwner(teamNames[0]);
        }

        return options;
    }, [fetchedData, owner]);

    const updateTeam = useCallback(() => {
        if (!fetchedData || !Array.isArray(fetchedData.teamStats)) return; // Check if teamStats exists and is an array

        let tempTeam = {};
        for (let findTeam of fetchedData.teamStats) {
            if (findTeam.Name === owner) {
                tempTeam = findTeam;
                break; // Stop loop once the team is found
            }
        }

        setRoster(tempTeam.Roster || []);
        setSchedule(tempTeam.Scores || []);
        setTeam(tempTeam);
    }, [fetchedData, owner]);

    const handleOwnerChange = (event) => {
        setOwner(event.target.value);
        updateTeam();
    };

    useEffect(() => {
        getTeams(); // Run getTeams initially
        const intervalId = setInterval(getTeams, 60 * 1000);
        return () => clearInterval(intervalId);
    }, [getTeams]);

    useEffect(() => {
        if (fetchedData.teamStats.length > 0) {
            updateTeam();
        }
    }, [fetchedData, updateTeam]);

    return (
        <div>
            &nbsp;
            <select value={owner} onChange={handleOwnerChange}>
                {updateOptions()}
            </select>
            <RosterBoard roster={roster}></RosterBoard>
            <ScheduleBoard schedule={schedule}></ScheduleBoard>
        </div>
    );
}
