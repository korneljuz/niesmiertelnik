import React, { useState, useEffect, useMemo } from "react";
import FirefighterCard from "./FirefighterPanel/FirefighterCard";
import FirefighterDetail from "./FirefighterPanel/FirefighterDetail";
import BeaconCard from "./BeaconCard/BeaconCard"; 
import BeaconDetail from "./BeaconDetail/BeaconDetail";
import AlertCard from "./AlertsPanel/AlertCard"; 
import { IoSearchOutline, IoTimeOutline, IoWarningOutline } from "react-icons/io5"; // Dodatkowe ikony
import "../styles.css";

export default function InfoPanel({
  firefighters,
  beacons,
  alerts,
  onDismissAlert,
  selectedId,
  setSelectedId,
  selectedFirefighter,
  selectedBeaconId,
  setSelectedBeaconId
}) {
  const [activeTab, setActiveTab] = useState("strazacy");
  
  const [searchText, setSearchText] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [sortBy, setSortBy] = useState("id"); 

  const [alertSort, setAlertSort] = useState("priority");

  useEffect(() => { if (selectedId) setActiveTab("strazacy"); }, [selectedId]);
  useEffect(() => { if (selectedBeaconId) setActiveTab("beacons"); }, [selectedBeaconId]);

  const listFirefighters = Object.values(firefighters);
  const listBeacons = beacons || [];

  const filteredFirefighters = useMemo(() => {
    let result = listFirefighters;
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(item => 
        item.firefighter.name.toLowerCase().includes(lowerSearch) ||
        item.firefighter.id.toLowerCase().includes(lowerSearch)
      );
    }
    if (filterTeam !== "all") {
      result = result.filter(item => item.firefighter.team === filterTeam);
    }
    result.sort((a, b) => {
        if (sortBy === 'battery_asc') return (a.device.battery_level || 0) - (b.device.battery_level || 0);
        if (sortBy === 'battery_desc') return (b.device.battery_level || 0) - (a.device.battery_level || 0);
        if (sortBy === 'name') return a.firefighter.name.localeCompare(b.firefighter.name);
        return a.firefighter.id.localeCompare(b.firefighter.id); 
    });
    return result;
  }, [listFirefighters, searchText, filterTeam, sortBy]);

  const uniqueTeams = [...new Set(listFirefighters.map(f => f.firefighter.team))];

  const getAlertPriority = (type) => {
    switch (type) {
      case "SOS": return 100;
      case "NO_MOVEMENT": return 90;
      case "CRITICAL_VITALS": return 80;
      case "LOW_AIR": return 80;
      case "LOW_BATTERY": return 10;
      default: return 50;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "strazacy":
        if (selectedFirefighter) {
          const detailAlerts = alerts ? alerts.filter(a => a.firefighter_id === selectedFirefighter.firefighter.id) : [];
          return <FirefighterDetail data={selectedFirefighter} activeAlerts={detailAlerts} onBack={() => setSelectedId(null)} />;
        }
        
        return (
          <>
            <div className="filters-container">
              <div className="search-box">
                <IoSearchOutline className="search-icon"/>
                <input type="text" placeholder="Szukaj..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
              </div>
              <div className="filter-options">
                <select value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)}>
                  <option value="all">Wszystkie</option>
                  {uniqueTeams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="id">ID</option>
                  <option value="name">Nazwisko</option>
                  <option value="battery_asc">Bateria (rosnąco)</option>
                </select>
              </div>
            </div>

            {filteredFirefighters.length === 0 ? (
              <p className="empty-state">Brak wyników...</p>
            ) : (
              <div className="cards">
                {filteredFirefighters.map(data => (
                    <FirefighterCard 
                      key={data.firefighter.id} 
                      data={data} 
                      activeAlerts={alerts.filter(a => a.firefighter_id === data.firefighter.id)}
                      isSelected={data.firefighter.id === selectedId} 
                      onSelect={() => setSelectedId(data.firefighter.id)} 
                    />
                ))}
              </div>
            )}
          </>
        );

      case "beacons":
        const selectedBeacon = listBeacons.find((b) => b.id === selectedBeaconId);
        if (selectedBeacon) {
            return <BeaconDetail data={selectedBeacon} onBack={() => setSelectedBeaconId(null)} />;
        }
        return (
          <div className="cards">
            {listBeacons.map(beacon => (
                <BeaconCard key={beacon.id} data={beacon} onClick={() => setSelectedBeaconId(beacon.id)} />
            ))}
          </div>
        );

      case "alerty":
         if (!alerts || alerts.length === 0) return <div className="empty-state"><p>Brak aktywnych zagrożeń.</p></div>;
         
         const sortedAlerts = [...alerts].sort((a, b) => {
            if (alertSort === "priority") {
                const pA = getAlertPriority(a.type);
                const pB = getAlertPriority(b.type);
                if (pA !== pB) return pB - pA;
                return new Date(b.timestamp) - new Date(a.timestamp);
            } else {
                return new Date(b.timestamp) - new Date(a.timestamp);
            }
         });

         return (
          <>
            <div className="alert-sort-bar">
                <span className="sort-label">Sortuj:</span>
                <button 
                    className={`sort-btn ${alertSort === 'priority' ? 'active' : ''}`} 
                    onClick={() => setAlertSort('priority')}
                >
                    <IoWarningOutline /> Priorytet
                </button>
                <button 
                    className={`sort-btn ${alertSort === 'time' ? 'active' : ''}`} 
                    onClick={() => setAlertSort('time')}
                >
                    <IoTimeOutline /> Czas
                </button>
            </div>

            <div className="alerts-list">
                {sortedAlerts.map((alert) => (
                <AlertCard 
                    key={alert.id} 
                    alert={alert} 
                    onDismiss={() => onDismissAlert(alert.id)} 
                />
                ))}
            </div>
          </>
         );

      default: return null;
    }
  };

  return (
    <div className="panel">
      <div className="tabs-header">
        <button className={`tab-btn ${activeTab === "strazacy" ? "active" : ""}`} onClick={() => setActiveTab("strazacy")}>Strażacy</button>
        <button className={`tab-btn ${activeTab === "beacons" ? "active" : ""}`} onClick={() => setActiveTab("beacons")}>Beacony</button>
        <button className={`tab-btn ${activeTab === "alerty" ? "active" : ""} ${alerts && alerts.length > 0 ? "alert-active-btn" : ""}`} onClick={() => setActiveTab("alerty")}>
          Alerty {alerts && alerts.length > 0 && <span className="badge">{alerts.length}</span>}
        </button>
      </div>
      <div className="panel-content">
        {renderContent()}
      </div>
    </div>
  );
}