import React from "react";
import {
  MdOpacity,
  MdAccessTime,
  MdDirectionsRun,
  MdLayers,
  MdPerson,
} from "react-icons/md";
import { FaBatteryHalf } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { IoLocateOutline, IoWarning } from "react-icons/io5"; 
import "../style.css";

export default function FirefighterCard({ data, onSelect, isSelected, activeAlerts = [] }) {
  const f = data.firefighter;
  const v = data.vitals || {};
  const s = data.scba || {};
  const d = data.device || {};
  const pos = data.position || {};

  const heartRate = v.heart_rate_bpm ?? "?";
  const timeLeft = s.remaining_time_min ?? "?";

  const hrColor = heartRate > 180 ? "var(--color-critical)" : heartRate > 120 ? "var(--color-warning)" : "var(--color-ok)";
  const timeClass = timeLeft < 10 ? "critical" : timeLeft < 20 ? "warning" : "";

  const moveMap = {
    stationary: "Stop",
    walking: "Chód",
    running: "Bieg",
    fallen: "Upadek",
    climbing: "Wspina",
    unknown: "-"
  };

  const isAlertState = activeAlerts && activeAlerts.length > 0;

  const handleLocateClick = (e) => {
    e.stopPropagation(); 
    onSelect(); 
  };

  return (
    <div
      className={`ff-card ${isSelected ? "selected" : ""} ${isAlertState ? "alert-active" : ""}`}
      onClick={onSelect}
    >
      <div className="ff-header">
        <div style={{display:'flex', alignItems:'center'}}>
            <div className="ff-avatar"><MdPerson /></div>
            <div className="ff-info">
              <h3>{f.name}</h3>
              <p>{f.rank} · {f.role}</p>
            </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="ff-team">{f.team}</div>

        </div>
      </div>

{isAlertState && (
  <div className="card-alerts-list">
    {activeAlerts.map((alert) => (
      <div
        key={alert.id}
        className="mini-alert-badge"
        style={{ justifyContent: "space-between", width: "97.5%" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <IoWarning className="alert-icon-small" />
          <span>{alert.type}</span>
        </div>

        <span className="alert-badge-time">
          {new Date(alert.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </div>
    ))}
  </div>
)}

      <div className="ff-metrics-small" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', background: 'transparent' }}>
        <MiniTile icon={<FaRegHeart />} color={hrColor} label="BPM" value={heartRate} />
        <MiniTile icon={<MdLayers />} color="#3498db" label="Piętro" value={pos.floor ?? "?"} />
        <MiniTile
          icon={<FaBatteryHalf />}
          color={d.battery_percent < 20 ? "#e74c3c" : "#2ecc71"}
          label="Bateria"
          value={`${d.battery_percent ?? "?"}%`}
        />
        <MiniTile
          icon={<MdDirectionsRun />}
          color="#ecf0f1"
          label="Ruch"
          value={moveMap[v.motion_state] || "-"}
        />
        <MiniTile
          icon={<MdOpacity />}
          color={timeClass === "critical" ? "#e74c3c" : timeClass === "warning" ? "#f1c40f" : "#3498db"}
          label="Bar"
          value={s.cylinder_pressure_bar ?? "?"}
        />
        <MiniTile
          icon={<MdAccessTime />}
          color={timeClass === "critical" ? "#e74c3c" : timeClass === "warning" ? "#f1c40f" : "#2ecc71"}
          label="Czas"
          value={`${timeLeft} min`}
        />
      </div>
    </div>
  );
}

function MiniTile({ icon, label, value, color }) {
  return (
    <div style={{ background: '#222', padding: '6px', borderRadius: '4px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ color: color, fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>{icon} {value}</div>
      <div style={{ color: '#777', fontSize: '0.7rem', marginTop: '2px' }}>{label}</div>
    </div>
  );
}