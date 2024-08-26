import { useEffect, useState } from 'react';
import jfc_client from 'espn-fantasy-football-api'; // Assuming this is how the client is imported

const YourComponent = ({ jfc_client ,seasonID, matchupPeriodId, scoringPeriodId }) => {
  const [boxscores, setBoxscores] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoxscores = async () => {
      try {
        const boxscores = await jfc_client.getBoxscoreForWeek({
          seasonID,
          matchupPeriodId,
          scoringPeriodId,
        });
        setBoxscores(boxscores);
      } catch (err) {
        console.error('Error fetching box scores:', err);
        setError('Failed to fetch box scores');
      }
    };

    fetchBoxscores();
  }, [seasonID, matchupPeriodId, scoringPeriodId]);

  if (error) return <div>Error: {error}</div>;
  if (!boxscores) return <div>Loading...</div>;

  return (
    <div>
      {/* Render box scores */}
      {JSON.stringify(boxscores)}
    </div>
  );
};

export default YourComponent;