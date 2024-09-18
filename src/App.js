import React, { useCallback, useEffect, useState } from 'react';
import { Header, Grid, Loader } from './components';
import { loadGrid, mapUsersByUserId } from './utils';

// Custom hook to handle loading and saving settings in localStorage
const useLocalSettings = () => {
  const loadSettings = useCallback(() => ({
    grouping: localStorage.getItem("grouping") || "status",
    ordering: localStorage.getItem("ordering") || "priority",
  }), []);

  const saveSettings = useCallback((data) => {
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  }, []);

  return { loadSettings, saveSettings };
};

function App() {
  const [tickets, setTickets] = useState([]);
  const [userData, setUserData] = useState({});
  const [gridData, setGridData] = useState({});
  const [grouping, setGrouping] = useState("status");
  const [ordering, setOrdering] = useState("priority");
  const [loading, setLoading] = useState(true);

  const { loadSettings, saveSettings } = useLocalSettings();
  const API_URL = "https://api.quicksell.co/v1/internal/frontend-assignment";

  // Fetch data and load saved settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const { tickets, users } = await response.json();
        setTickets(tickets);
        setUserData(mapUsersByUserId(users));
      } catch (err) {
        console.error("Failed to fetch tickets or users", err);
      }
    };

    const settings = loadSettings();
    setGrouping(settings.grouping);
    setOrdering(settings.ordering);
    fetchData();
  }, [loadSettings]);

  // Update grid data whenever tickets, grouping, or ordering change
  useEffect(() => {
    if (tickets.length === 0) return;
    setGridData(loadGrid(tickets, grouping, ordering));
    setLoading(false);
  }, [tickets, grouping, ordering]);

  // Handlers for grouping and ordering changes
  const handleGroupingChange = useCallback((value) => {
    setLoading(true);
    setGrouping(value);
    saveSettings({ grouping: value });
  }, [saveSettings]);

  const handleOrderingChange = useCallback((value) => {
    setLoading(true);
    setOrdering(value);
    saveSettings({ ordering: value });
  }, [saveSettings]);

  return (
    <div className="lay">
      <Header 
        grouping={grouping} 
        setGrouping={handleGroupingChange} 
        ordering={ordering} 
        setOrdering={handleOrderingChange} 
      />
      {loading ? <Loader /> :
        <Grid gridData={gridData} grouping={grouping} userIdToData={userData} />
      }
    </div>
  );
}

export default App;
