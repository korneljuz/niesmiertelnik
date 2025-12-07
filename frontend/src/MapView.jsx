import React, { useRef, useEffect, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./styles.css";

import Map3D from "./Map3D"; // Upewnij się, że masz ten plik

// --- KONFIGURACJA GPS ---
const GPS_ORIGIN = { lat: 52.2297, lon: 21.0122 };
const SCALE_LAT = 111320; 
const SCALE_LON = 71695;  

const TILES = {
  satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  standard: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
};

function localToGPS(x, y) {
  return [
    GPS_ORIGIN.lat + y / SCALE_LAT,
    GPS_ORIGIN.lon + x / SCALE_LON,
  ];
}

/**
 * Generuje kolory dla zespołów na podstawie ich nazwy (Hash).
 * Gwarantuje stały kolor dla danej nazwy zespołu.
 * RIT zawsze Czerwony. Reszta unika czerwieni.
 */
function generateTeamColors(firefightersData) {
  const colorMap = {};

  Object.values(firefightersData).forEach(data => {
    // Pobieramy nazwę zespołu (zabezpieczenie przed brakiem danych)
    const teamName = data.firefighter.team || data.firefighter.rota || "Brak Zespołu";
    
    // Jeśli kolor już jest przypisany, pomijamy
    if (colorMap[teamName]) return;

    // 1. ZASADA RIT: Zawsze Czerwony
    if (teamName.toUpperCase().includes("RIT")) {
      colorMap[teamName] = "#FF0000";
    } 
    // 2. RESZTA: Kolor z Hasha nazwy
    else {
      let hash = 0;
      for (let i = 0; i < teamName.length; i++) {
        hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      // Wyciągamy Hue (odcień) z zakresu 0-360
      let hue = Math.abs(hash % 360);

      // ZABEZPIECZENIE: Unikamy czerwieni (zakresy 0-20 i 340-360)
      // Jeśli wylosowało czerwień, przesuwamy o 60 stopni (na żółty/fiolet)
      if (hue < 20 || hue > 340) {
        hue = (hue + 60) % 360;
      }

      // Opcjonalnie: Unikamy też czystego żółtego (45-60), żeby był czytelny na jasnej mapie
      if (hue > 45 && hue < 65) {
         hue = (hue + 40) % 360; // Przesuń na zielony
      }

      // HSL: Saturation 85% (żywy), Lightness 50% (czytelny)
      colorMap[teamName] = `hsl(${hue}, 85%, 50%)`;
    }
  });

  return colorMap;
}

// --- DANE BUDYNKU ---
const BUILDING_DATA = {
  dims: { w: 40, h: 25 }, 
  floors: {
    "-1": {
      name: "Piwnica (-1)",
      entrances: [{ type: "tech", x: 20, y: 25, label: "Tech" }]
    },
    "0": {
      name: "Parter (0)",
      entrances: [
        { type: "main", x: 0, y: 5, label: "Główne" },
        { type: "side", x: 40, y: 20, label: "Boczne" }
      ]
    },
    "1": { name: "I Piętro", entrances: [] },
    "2": { name: "II Piętro", entrances: [] },
  },
  staircase: { x: 35, y: 20 }
};

export default function MapView({ 
  firefighters, 
  beacons = [], 
  setSelectedId,
  selectedId,
  setSelectedBeaconId 
}) {
  const mapRef = useRef(null);
  const ffMarkersRef = useRef({});
  const beaconMarkersRef = useRef({});
  const buildingLayerRef = useRef(null);
  const tileLayerRef = useRef(null);

  const [currentFloor, setCurrentFloor] = useState("0");
  const [mapType, setMapType] = useState("satellite");
  const [viewMode, setViewMode] = useState("2D"); 

  // Obliczamy kolory zespołów (useMemo, żeby nie liczyć przy każdym renderze mapy)
  const teamColors = useMemo(() => generateTeamColors(firefighters), [firefighters]);

  // --- 1. INICJALIZACJA MAPY ---
  useEffect(() => {
    if (!mapRef.current) {
      const center = localToGPS(20, 12.5);
      
      const map = L.map("map", {
        minZoom: 19,
        maxZoom: 22,
        zoomControl: false,
        attributionControl: false
      }).setView(center, 21);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.control.attribution({ position: 'bottomright' }).addTo(map);

      buildingLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // --- 2. ZMIANA WARSTWY TŁA ---
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const layerUrl = TILES[mapType];
    const newTileLayer = L.tileLayer(layerUrl, { maxZoom: 22 });

    newTileLayer.addTo(map);
    newTileLayer.bringToBack(); 
    tileLayerRef.current = newTileLayer;
    
    document.getElementById('map').style.backgroundColor = mapType === 'standard' ? '#ddd' : '#111';
  }, [mapType]); 

  // --- 3. BUDYNEK (KOLORY ZALEŻNE OD TŁA) ---
  useEffect(() => {
    if (!buildingLayerRef.current) return;

    buildingLayerRef.current.clearLayers();
    const layer = buildingLayerRef.current;
    const floorData = BUILDING_DATA.floors[currentFloor];

    let outlineColor, fillColor, doorTextColor;

    if (mapType === 'standard') {
      outlineColor = "#2c3e50"; fillColor = "#bdc3c7"; doorTextColor = "#000";
    } else if (mapType === 'dark') {
      outlineColor = "#5dade2"; fillColor = "#000"; doorTextColor = "#fff";
    } else {
      outlineColor = "#3498db"; fillColor = "#000"; doorTextColor = "#fff";
    }

    const outline = [
      localToGPS(0, 0), localToGPS(40, 0), localToGPS(40, 25), localToGPS(0, 25)
    ];
    
    L.polygon(outline, {
      color: outlineColor, weight: 3, fillColor: fillColor,
      fillOpacity: mapType === 'satellite' ? 0.3 : 0.5,
      dashArray: currentFloor === "-1" ? "5, 10" : null
    }).addTo(layer);

    if (floorData.entrances) {
      floorData.entrances.forEach(ent => {
        const pos = localToGPS(ent.x, ent.y);
        L.marker(pos, {
          icon: L.divIcon({
            className: 'entrance-marker',
            html: `<div class="door-icon">🚪</div><div class="door-label" style="color:${doorTextColor}">${ent.label}</div>`,
            iconSize: [30, 30], iconAnchor: [15, 15]
          })
        }).addTo(layer);
      });
    }

    const stairsPos = localToGPS(BUILDING_DATA.staircase.x, BUILDING_DATA.staircase.y);
    L.marker(stairsPos, {
      icon: L.divIcon({
        className: 'stairs-marker',
        html: `<div class="stairs-box">S</div>`,
        iconSize: [24, 24], iconAnchor: [12, 12]
      })
    }).bindPopup("Klatka schodowa").addTo(layer);

  }, [currentFloor, mapType]); 

  // --- 4. RYSOWANIE STRAŻAKÓW (Z KOLORAMI ZESPOŁÓW) ---
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const markers = ffMarkersRef.current;

    Object.values(firefighters).forEach((data) => {
      const isOnCurrentFloor = data.position.floor.toString() === currentFloor;
      const ff = data.firefighter;
      const pos = data.position;
      const latLng = pos.gps ? [pos.gps.lat, pos.gps.lon] : localToGPS(pos.x, pos.y);
      const key = ff.id;

      const teamName = ff.team || ff.rota || "Brak Zespołu";
      const assignedColor = teamColors[teamName] || "#ffffff";
      const icon = getFirefighterIcon(data, assignedColor);

      if (!markers[key]) {
        // TWORZENIE NOWEGO MARKERA
        const marker = L.marker(latLng, { icon: icon });
        marker.bindPopup(`<b>${ff.name}</b><br>Zespół: ${teamName}`);
        marker.on("click", () => setSelectedId && setSelectedId(ff.id));
        marker.addTo(map); 
        markers[key] = marker;
      } else {
        // AKTUALIZACJA ISTNIEJĄCEGO
        markers[key].setLatLng(latLng);
        markers[key].setIcon(icon);
        
        // --- TU BYŁ BŁĄD (użyto 'marker' zamiast 'markers[key]') ---
        markers[key].setPopupContent(`<b>${ff.name}</b><br>Zespół: ${teamName}`);
      }

      // Zarządzanie widocznością (piętra)
      if (isOnCurrentFloor) {
        markers[key].setOpacity(1); 
        markers[key].setZIndexOffset(1000); 
      } else {
        markers[key].setOpacity(0.3); 
        markers[key].setZIndexOffset(0);
      }
    });
  }, [firefighters, setSelectedId, currentFloor, teamColors]);

  // --- 5. RYSOWANIE BEACONÓW ---
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const markers = beaconMarkersRef.current;
    const list = beacons || [];

    list.forEach((beacon) => {
      const isOnCurrentFloor = beacon.floor.toString() === currentFloor;
      const latLng = beacon.gps ? [beacon.gps.lat, beacon.gps.lon] : localToGPS(beacon.position.x, beacon.position.y);
      const key = beacon.id;

      if (!markers[key]) {
        const marker = L.marker(latLng, { icon: getBeaconDotIcon(beacon) });
        marker.bindPopup(`<b>${beacon.name}</b><br>Bateria: ${beacon.battery_percent}%`);
        marker.on("click", () => { if (setSelectedBeaconId) setSelectedBeaconId(beacon.id); });
        if (isOnCurrentFloor) marker.addTo(map);
        markers[key] = marker;
      } else {
        markers[key].setLatLng(latLng);
        markers[key].setIcon(getBeaconDotIcon(beacon));
        if (isOnCurrentFloor) {
           if (!map.hasLayer(markers[key])) markers[key].addTo(map);
        } else {
           if (map.hasLayer(markers[key])) map.removeLayer(markers[key]);
        }
      }
    });
  }, [beacons, setSelectedBeaconId, currentFloor]);

  return (
    <div className="map-wrapper">
      
      <div 
        id="map" 
        className="map-half" 
        style={{ display: viewMode === '2D' ? 'block' : 'none' }}
      ></div>

      {viewMode === '3D' && (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
           <Map3D 
             firefighters={firefighters} 
             selectedId={selectedId}
             setSelectedId={setSelectedId}
           />
        </div>
      )}
      
      <div className="map-controls">
        
        <div className="control-group">
            <button 
              className={`map-btn ${viewMode === '2D' ? 'active' : ''}`}
              onClick={() => setViewMode('2D')}
            >
              🗺️ 2D
            </button>
            <button 
              className={`map-btn ${viewMode === '3D' ? 'active' : ''}`}
              onClick={() => setViewMode('3D')}
            >
              🧊 3D
            </button>
        </div>

        <div className="control-divider"></div>

        {viewMode === '2D' && (
          <>
            <div className="control-group">
                <button 
                  className={`map-btn ${mapType === 'satellite' ? 'active' : ''}`}
                  onClick={() => setMapType('satellite')}
                >
                  🛰️ Satelita
                </button>
                <button 
                  className={`map-btn ${mapType === 'standard' ? 'active' : ''}`}
                  onClick={() => setMapType('standard')}
                >
                  🗺️ Jasna
                </button>
                <button 
                  className={`map-btn ${mapType === 'dark' ? 'active' : ''}`}
                  onClick={() => setMapType('dark')}
                  style={{color: mapType==='dark' ? '#fff' : '#aaa'}}
                >
                  🌑 Ciemna
                </button>
            </div>

            <div className="control-divider"></div>

            <div className="control-group floor-group">
              <div className="floor-label">PIĘTRO</div>
              {Object.keys(BUILDING_DATA.floors).sort((a,b) => b-a).map(floor => (
                <button 
                  key={floor}
                  className={`floor-btn ${currentFloor === floor ? 'active' : ''}`}
                  onClick={() => setCurrentFloor(floor)}
                >
                  {floor}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- FUNKCJE IKON ---

/**
 * Generuje ikonę strażaka z dynamicznym kolorem zespołu.
 */
function getFirefighterIcon(data, teamColor) {
    const heading = data.heading_deg || 0;
    const nameLabel = data.firefighter.name.split(" ").pop(); 
  
    // Używamy teamColor jako głównego koloru
    return L.divIcon({
      className: "ff-marker-container", 
      html: `
        <div class="ff-circle" style="background-color: ${teamColor}; box-shadow: 0 0 12px ${teamColor}; border: 2px solid white;">
          <span class="ff-icon" style="color: white; font-size: 16px; text-shadow: 0 1px 2px black;">👨‍🚒</span>
        </div>
        <div class="ff-direction-wrapper" style="transform: rotate(${heading}deg)">
          <div class="ff-arrow-tip" style="border-bottom-color: ${teamColor}"></div>
        </div>
        <div class="ff-label" style="background-color: rgba(0,0,0,0.8); color: #fff; padding: 2px 5px; border-radius: 4px; border: 1px solid ${teamColor}; font-weight: bold;">
          ${nameLabel}
        </div>
      `,
      iconSize: [46, 46], iconAnchor: [23, 23],
    });
}
  
function getBeaconDotIcon(beacon) {
    const isOnline = beacon.status === "active";
    const isEntry = beacon.type === "entry";
    let color = isOnline ? "#2ecc71" : "#7f8c8d"; 
    if (isEntry && isOnline) color = "#3498db"; 
    if (!isOnline) color = "#c0392b"; 
    const size = isEntry ? 22 : 16; 
  
    return L.divIcon({
      className: "beacon-dot-marker",
      html: `
        <div style="width: ${size}px; height: ${size}px; background-color: ${color}; border-radius: ${isEntry ? '4px' : '50%'}; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.4);"></div>
      `,
      iconSize: [size, size], iconAnchor: [size/2, size/2],
    });
}