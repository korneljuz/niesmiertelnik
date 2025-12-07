import React, { useEffect, useState } from "react";
import "../../styles.css";
import MetricBig from "./MetricBig"; // Upewnij się, że masz ten plik
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Rejestracja komponentów wykresu
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// --- SŁOWNIKI TŁUMACZEŃ ---
const MAP = {
  motion: {
    walking: "Chód",
    running: "Bieg",
    stationary: "Bezruch",
    crawling: "Czołganie",
    climbing: "Wspinaczka",
    fallen: "Upadek",
    unknown: "Nieznany"
  },
  pass: {
    active: "Aktywny",
    alarm: "ALARM",
    pre_alarm: "Pre-Alarm",
    off: "Wyłączony"
  },
  connection: {
    connected: "Połączony",
    disconnected: "Rozłączony",
    lora: "LoRa WAN",
    ble: "Bluetooth",
    lte: "LTE / 4G"
  },
  hr_zone: {
    rest: "Spoczynek",
    light: "Lekka",
    moderate: "Umiarkowana",
    hard: "Wysoka",
    max: "Maksymalna"
  }
};

const t = (category, key) => (MAP[category] && MAP[category][key]) ? MAP[category][key] : (key || "-");

// --- KOMPONENT ZWIJANEJ SEKCJI ---
const CollapsibleSection = ({ title, isOpen, onToggle, badges = [], children, hasCritical = false }) => {
  return (
    <div className="collapsible-wrapper">
      <div className={`section-header ${hasCritical ? 'has-critical' : ''}`} onClick={onToggle}>
        <div className="section-title-wrapper">
          <h4 className="section-title">{title}</h4>
          <div className="header-badges">
            {badges.map((b, i) => (
              <span key={i} className={`badge ${b.type}`}>{b.text}</span>
            ))}
          </div>
        </div>
        <div className={`section-toggle-icon ${isOpen ? "open" : ""}`}>▼</div>
      </div>
      <div className={`section-content ${isOpen ? "" : "collapsed"}`}>
        {children}
      </div>
    </div>
  );
};

// --- GŁÓWNY KOMPONENT ---
// Dodano prop 'activeAlerts'
export default function FirefighterDetail({ data, onBack, activeAlerts = [] }) {
  const f = data.firefighter || {};
  const v = data.vitals || {};
  const s = data.scba || {};
  const d = data.device || {};
  const pos = data.position || {};
  const imu = data.imu || {};
  const baro = data.barometer || {};
  const pass = data.pass_status || {};
  const recco = data.recco || {};
  const box = data.black_box || {};
  const letter = f.name ? f.name.charAt(0).toUpperCase() : "?";

  // --- Stan sekcji (Zwijanie/Rozwijanie) ---
  const [sections, setSections] = useState({
    vitals: true,
    alerts: true,
    chart: true,
    position: true,
    sensors: false,
    device: false,
  });

  const toggleSection = (key) => setSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // --- LOGIKA WYŚWIETLANIA ALERTÓW ---
  const [filter, setFilter] = useState("all");

  // Helper do mapowania typu alertu na czytelny tekst i poziom
  const getAlertInfo = (type) => {
    switch (type) {
      case "SOS": return { label: "WEZWANO POMOC (SOS)", level: "critical" };
      case "LOW_AIR": return { label: "Krytyczne ciśnienie", level: "critical" };
      case "CRITICAL_VITALS": return { label: "Krytyczne parametry życiowe", level: "critical" };
      case "NO_MOVEMENT": return { label: "Wykryto bezruch (>30s)", level: "critical" };
      case "LOW_BATTERY": return { label: "Niski poziom baterii", level: "warning" };
      default: return { label: `Zdarzenie: ${type}`, level: "warning" };
    }
  };

  // Filtrowanie alertów (na podstawie activeAlerts z App.jsx)
  const filteredAlerts = activeAlerts.filter(alert => {
    const info = getAlertInfo(alert.type);
    if (filter === "all") return true;
    if (filter === "critical") return info.level === "critical";
    if (filter === "warning") return info.level === "warning";
    return true;
  });

  const hasCriticalAlerts = activeAlerts.some(a => getAlertInfo(a.type).level === "critical");

  // --- WYKRES HR ---
  const [hrHistory, setHrHistory] = useState([]);
  useEffect(() => {
    if (v.heart_rate_bpm != null) setHrHistory((prev) => [...prev, v.heart_rate_bpm].slice(-20));
  }, [v.heart_rate_bpm]);

  const hrData = {
    labels: hrHistory.map((_, i) => i),
    datasets: [
      {
        label: "BPM",
        data: hrHistory,
        borderColor: "#37f58c",
        backgroundColor: "rgba(55, 245, 140, 0.1)",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.2,
        fill: true,
      },
    ],
  };

  const hrOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: { display: false },
      y: {
        min: 40, max: 200,
        grid: { color: "rgba(55, 245, 140, 0.15)" },
        border: { display: false },
        ticks: { color: "#37f58c", stepSize: 40 },
      },
    },
    plugins: { legend: { display: false } },
  };

  // --- LOGIKA KOLORÓW KAFELKÓW (Wizualna) ---
  const getScbaStatus = () => {
    if (s.alarms?.very_low_pressure) return "metric-critical";
    if (s.alarms?.low_pressure) return "metric-warning";
    return "";
  };

  const getPassClass = () => {
    if (pass.alarm_active) return "metric-critical";
    if (pass.status === "pre_alarm") return "metric-warning";
    return "metric-normal";
  };
  
  const getStressClass = () => {
      if (v.stress_level === "critical") return "metric-critical";
      if (v.stress_level === "high") return "metric-warning";
      return "";
  };

  return (
    <div className="ff-detail">
      <button className="btn-back" onClick={onBack}>← Powrót</button>

      {/* HEADER */}
      <div className="ff-header">
        <div className={`ff-avatar large ${d.sos_button_pressed ? 'pulse sos' : ''}`}>{letter}</div>
        <div className="ff-info">
          <h3>{f.name}</h3>
          <p>{f.rank} · {f.role}</p>
        </div>
        <div className="ff-team">
          {f.team} 
          <span style={{marginLeft: 8, fontSize: '0.8em', color: '#aaa'}}>
             ● {t('connection', d.connection_primary)}
          </span>
        </div>
      </div>

      {/* --- SEKCJA 1: PARAMETRY ŻYCIOWE i SCBA --- */}
      <CollapsibleSection 
        title="Parametry"
        isOpen={sections.vitals} 
        onToggle={() => toggleSection('vitals')}
        badges={v.stress_level === 'critical' ? [{text: 'STRES!', type: 'critical'}] : []}
      >
        <div className="ff-stats-grid">
          <MetricBig 
            label="Tętno" 
            value={`${v.heart_rate_bpm ?? "?"} bpm`} 
            customClass={getStressClass()} 
          />
          <MetricBig label="Strefa HR" value={t('hr_zone', v.hr_zone)} />
          <MetricBig 
            label="Stres" 
            value={v.stress_level === 'critical' ? 'KRYTYCZNY' : (v.stress_level === 'high' ? 'WYSOKI' : 'Norma')} 
            customClass={getStressClass()} 
          />
          <MetricBig 
            label="Ciśnienie SCBA" 
            value={`${s.cylinder_pressure_bar ?? "?"} bar`} 
            customClass={getScbaStatus()} 
          />
          <MetricBig 
            label="Czas pracy" 
            value={`${s.remaining_time_min ?? "?"} min`}
            customClass={s.remaining_time_min < 10 ? (s.remaining_time_min < 5 ? 'metric-critical' : 'metric-warning') : ''}
          />
          <MetricBig label="Zużycie" value={`${s.consumption_rate_lpm ?? "?"} L/min`} />
          <MetricBig 
            label="PASS Status" 
            value={t('pass', pass.status)} 
            customClass={getPassClass()} 
          />
          <MetricBig label="Ruch" value={t('motion', v.motion_state)} />
          <MetricBig label="Temp. skóry" value={`${v.skin_temperature_c ?? "?"}°C`} />
        </div>
      </CollapsibleSection>

      {/* --- SEKCJA 2: CENTRUM POWIADOMIEŃ (ZBUFOROWANE ALERTY) --- */}
      <CollapsibleSection 
        title="Centrum Powiadomień" 
        isOpen={sections.alerts} 
        onToggle={() => toggleSection('alerts')}
        hasCritical={hasCriticalAlerts}
        badges={[{ text: `${activeAlerts.length}`, type: hasCriticalAlerts ? 'critical' : 'neutral' }]}
      >
        <div className="alert-filters">
           <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Wszystkie</button>
           <button className={filter === "warning" ? "active" : ""} onClick={() => setFilter("warning")}>Ostrzeżenia</button>
           <button className={filter === "critical" ? "active" : ""} onClick={() => setFilter("critical")}>Krytyczne</button>
        </div>
        
        <div className="ff-alert-list">
          {filteredAlerts.length === 0 ? <p className="no-alerts">Brak aktywnych alertów</p> : 
            filteredAlerts.map((alert) => {
              const info = getAlertInfo(alert.type);
              const timeString = new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'});
              
              return (
                <div key={alert.id} className={`alert-item alert-${info.level}`}>
                  <span className="alert-time">{timeString}</span>
                  <span className="alert-text">{info.label}</span>
                </div>
              );
            })
          }
        </div>
      </CollapsibleSection>

      {/* --- SEKCJA 3: WYKRES --- */}
      <CollapsibleSection title="Monitoring Pracy Serca" isOpen={sections.chart} onToggle={() => toggleSection('chart')}>
        <div className="medical-chart-wrapper">
          <div className="medical-background"></div>
          <div className="medical-chart-canvas" style={{ height: '120px' }}>
            <Line data={hrData} options={hrOptions} />
          </div>
        </div>
      </CollapsibleSection>

      {/* --- SEKCJA 4: POZYCJA --- */}
      <CollapsibleSection 
        title="Lokalizacja" 
        isOpen={sections.position} 
        onToggle={() => toggleSection('position')}
        badges={[{text: `Piętro: ${pos.floor ?? 0}`, type: 'neutral'}]}
      >
        <div className="ff-stats-grid">
          <MetricBig label="Piętro (Est)" value={pos.floor ?? "0"} />
          <MetricBig label="Dokładność" value={`±${pos.accuracy_m ?? "?"}m`} />
          <MetricBig label="GPS Sat" value={pos.gps?.satellites ?? 0} />
          <MetricBig label="Kierunek" value={`${data.heading_deg ?? 0}°`} />
          <MetricBig label="Pos X" value={pos.x ?? "?"} />
          <MetricBig label="Pos Y" value={pos.y ?? "?"} />
        </div>
      </CollapsibleSection>

      {/* --- SEKCJA 5: SENSORY --- */}
      <CollapsibleSection title="Środowisko i Sensory" isOpen={sections.sensors} onToggle={() => toggleSection('sensors')}>
        <div className="ff-stats-grid">
          <MetricBig label="Ciśnienie Atm." value={`${(baro.pressure_pa / 100).toFixed(1)} hPa`} />
          <MetricBig label="Temp. Otoczenia" value={`${baro.temperature_c ?? "?"}°C`} />
          <MetricBig label="Wysokość Rel." value={`${baro.altitude_rel_m ?? "?"} m`} />
        </div>
      </CollapsibleSection>

       {/* --- SEKCJA 6: URZĄDZENIE --- */}
       <CollapsibleSection title="Urządzenie" isOpen={sections.device} onToggle={() => toggleSection('device')}>
        <div className="ff-stats-grid">
          <MetricBig 
            label="Bateria Tag" 
            value={`${d.battery_percent ?? "?"}%`} 
            customClass={d.battery_percent < 20 ? 'metric-warning' : ''} 
          />
          <MetricBig label="LoRa RSSI" value={`${d.lora_rssi_dbm ?? "?"} dBm`} />
        </div>
      </CollapsibleSection>

    </div>
  );
}