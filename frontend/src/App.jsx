import React, { useEffect, useState, useRef } from "react";
import { socket } from "./api/socket";
import MapView from "./MapView";
import InfoPanel from "./components/InfoPanel";
import StatusBar from "./StatusBar";

export default function App() {
  const [firefighters, setFirefighters] = useState({});
  const [beacons, setBeacons] = useState([]);
  const [alerts, setAlerts] = useState([]); 
  const [packetCount, setPacketCount] = useState(0);

  const [selectedId, setSelectedId] = useState(null);
  const [selectedBeaconId, setSelectedBeaconId] = useState(null);

  // --- 1. LOGIKA DODAWANIA ALERTÓW (ZMIENIONA) ---
  const addUniqueAlert = (newAlert) => {
    setAlerts((prevAlerts) => {
      // Sprawdź, czy ten strażak ma już alert TEGO SAMEGO typu
      const exists = prevAlerts.some(
        (a) => a.firefighter_id === newAlert.firefighter_id && a.type === newAlert.type
      );

      // JEŚLI ISTNIEJE: Ignorujemy nowy. 
      // Dzięki temu zachowujemy timestamp PIERWSZEGO alertu.
      if (exists) {
        return prevAlerts;
      }

      // JEŚLI NIE ISTNIEJE: Dodajemy nowy na początek listy
      return [newAlert, ...prevAlerts];
    });
  };

  // --- 2. SPRAWDZANIE TELEMETRII ---
  const checkTelemetryForAlerts = (data) => {
    const f = data.firefighter;
    const dev = data.device || {};
    const scba = data.scba || {};
    const vitals = data.vitals || {};

    const checks = [
      { condition: dev.sos_button_pressed, type: "SOS" },
      { condition: scba.alarms?.very_low_pressure, type: "LOW_AIR" },
      { condition: vitals.stress_level === "critical", type: "CRITICAL_VITALS" },
      { condition: dev.battery_percent < 10, type: "LOW_BATTERY" }
    ];

    checks.forEach(check => {
      if (check.condition) {
        addUniqueAlert({
          id: `${f.id}-${check.type}`, // ID oparte tylko na typie, bez daty (dla unikalności)
          firefighter_id: f.id,
          firefighter_name: f.name,
          type: check.type,
          floor: data.position?.floor || 0,
          timestamp: new Date().toISOString() // To będzie czas PIERWSZEGO wystąpienia
        });
      }
    });
  };

  useEffect(() => {
    socket.on("telemetry", (data) => {
      setPacketCount((p) => p + 1);
      setFirefighters((prev) => ({ ...prev, [data.firefighter.id]: data }));
      checkTelemetryForAlerts(data);
    });

    socket.on("new_alert", (serverAlert) => {
      addUniqueAlert(serverAlert);
    });

    socket.on("beacons_data", (data) => {
      if (data.beacons) setBeacons(data.beacons);
    });

    return () => {
      socket.off("telemetry");
      socket.off("new_alert");
      socket.off("beacons_data");
    };
  }, []);

  // Usuwanie alertu (tylko ręczne!)
  const dismissAlert = (id) => {
    setAlerts((prev) => prev.filter(a => a.id !== id));
  };

  const handleSelectFirefighter = (id) => { setSelectedId(id); if (id) setSelectedBeaconId(null); };
  const handleSelectBeacon = (id) => { setSelectedBeaconId(id); if (id) setSelectedId(null); };

  return (
    <div className="app-container">
      <StatusBar packetCount={packetCount} firefighters={firefighters} />
      <div className="dashboard">
        <div className="left">
          <MapView
            firefighters={firefighters}
            beacons={beacons}
            setSelectedId={handleSelectFirefighter}
            setSelectedBeaconId={handleSelectBeacon}
          />
        </div>
        <div className="right">
          <InfoPanel
            firefighters={firefighters}
            beacons={beacons}
            alerts={alerts}
            onDismissAlert={dismissAlert}
            selectedId={selectedId}
            setSelectedId={handleSelectFirefighter}
            selectedFirefighter={selectedId ? firefighters[selectedId] : null}
            selectedBeaconId={selectedBeaconId}
            setSelectedBeaconId={handleSelectBeacon}
          />
        </div>
      </div>
    </div>
  );
}