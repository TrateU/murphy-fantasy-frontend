import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MatchupBoard from "../components/MatchupBoard/MatchupBoard";
import {weekRanges2026,currentYear} from "../info"

export default function MatchupPage() {
  const { year, week, match } = useParams();
  const navigate = useNavigate(); // For programmatic navigation

  // Initialize the states based on URL params, but only once
  const [yearDropdown, setYear] = useState(year || currentYear);
  const [weekDropdown, setWeek] = useState(week ? parseInt(week) : 0);
  const [currMatch, setMatch] = useState(match ? parseInt(match) : 0);
  const [currWeek, setCurrWeek] = useState(1);
  const [weekSet, setWeekSet] = useState(false);
  const [maxMatchup, setMaxMatch] = useState(9);

  useEffect(() => {
    setCurrentWeek();
  }, []); // Set the current week when the component mounts

  // Update state when the URL params change, but prevent unnecessary updates
  useEffect(() => {
    if (year && year !== yearDropdown) setYear(parseInt(year));
    if (week && parseInt(week) !== weekDropdown) setWeek(parseInt(week));
    if (match && parseInt(match) !== currMatch) setMatch(parseInt(match));
  }, [year, week, match, yearDropdown, weekDropdown, currMatch]);

  // Function to handle navigation updates to /matchups with the latest values
  const updateUrl = useCallback((newYear, newWeek, newMatch) => {
    navigate(`/matchups/${newYear}/${newWeek}/${newMatch}`);
  });

  const handleYearChange = (event) => {
    const selectedYear = event.target.value;
    setYear(selectedYear);
    updateUrl(selectedYear, weekDropdown, currMatch);
  };

  const handleWeekChange = (event) => {
    const selectedWeek = parseInt(event.target.value);
    setWeek(selectedWeek);
    setMatch(0); // Reset match when week changes
    setWeekSet(true);
    updateUrl(yearDropdown, selectedWeek, 0);
  };

  useEffect(() => {
    if (weekDropdown <= 14) {
      setMaxMatch(10);
    } else if (weekDropdown === 15) {
      setMaxMatch(4);
    } else if (weekDropdown === 16) {
      setMaxMatch(2);
    } else if (weekDropdown === 17) {
      setMaxMatch(1);
    }
  }, [weekDropdown]);

  useEffect(() => {
    if (currWeek && !weekSet && !match) {
      setWeek(currWeek); // Only set week if the user hasn't manually selected it
    }
  }, [currWeek, weekSet]);

  const setCurrentWeek = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    const currentDate = `${year}:${month}:${day}`;

    for (let week of weekRanges2026) {
      const { start, end } = week;
      if (isDateInRange(currentDate, start, end)) {
        setCurrWeek(week.Week);
        break;
      }
    }
  };

  function isDateInRange(dateStr, startStr, endStr) {
    const [year, month, day] = dateStr.split(":").map(Number);
    const [startYear, startMonth, startDay] = startStr.split(":").map(Number);
    const [endYear, endMonth, endDay] = endStr.split(":").map(Number);

    const date = new Date(year, month, day);
    const startDate = new Date(startYear, startMonth, startDay);
    const endDate = new Date(endYear, endMonth, endDay);

    return date >= startDate && date <= endDate;
  }

  const setViewCurrentWeek = () => {
    setMatch(0);
    setWeek(currWeek);
    setYear(currentYear);
    updateUrl(currentYear, currWeek, 0);
  };

  const updateMatchLeft = () => {
    const newMatch = currMatch > 0 ? currMatch - 1 : maxMatchup - 1;
    setMatch(newMatch);
    updateUrl(yearDropdown, weekDropdown, newMatch);
  };

  const updateMatchRight = () => {
    const newMatch = currMatch < maxMatchup - 1 ? currMatch + 1 : 0;
    setMatch(newMatch);
    updateUrl(yearDropdown, weekDropdown, newMatch);
  };

  return (
    <div>
      <select value={yearDropdown} onChange={handleYearChange}>
        <option value={2021}>2021</option>
        <option value={2022}>2022</option>
        <option value={2023}>2023</option>
        <option value={2024}>2024</option>
        <option value={2025}>2025</option>
      </select>

      <select value={weekDropdown} onChange={handleWeekChange}>
        {weekRanges2026.map((week, index) => (
          <option key={index} value={week.Week}>
            {week.Week <= 14 ? `Week ${week.Week}` : `Playoffs Week ${week.Week - 14}`}
          </option>
        ))}
      </select>

      <button onClick={setViewCurrentWeek}>Current Week</button>

      <div>
        <button onClick={updateMatchLeft}>{"<"}</button>
        <> Matchup {currMatch + 1} of {maxMatchup} </>
        <button onClick={updateMatchRight}>{">"}</button>
      </div>
      <MatchupBoard
        year={parseInt(yearDropdown)}
        week={parseInt(weekDropdown)}
        match={parseInt(currMatch)}
      />
    </div>
  );
}
