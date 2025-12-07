import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Text, Grid } from "@react-three/drei";
import * as THREE from "three";

// Konfiguracja wymiarów (z Twoich danych)
const BUILDING_W = 40; // szerokość (oś X)
const BUILDING_D = 25; // głębokość (oś Z)
const FLOOR_HEIGHT = 4; // wysokość jednego piętra w metrach 3D

// Kolory pięter dla odróżnienia
const FLOOR_COLORS = {
  "-1": "#2c3e50", // Piwnica ciemna
  "0": "#7f8c8d",  // Parter szary
  "1": "#95a5a6",  // I piętro jasne
  "2": "#bdc3c7"   // II piętro najjaśniejsze
};

// --- KOMPONENT: POJEDYNCZY STRAŻAK ---
const Firefighter3D = ({ data, isSelected, onClick }) => {
  const { position, firefighter, vitals } = data;
  
  // Konwersja pozycji:
  // X = data.x (przesuwamy o połowę budynku, by środek był w 0,0)
  // Y = floor * wysokość piętra
  // Z = data.y
  const x = position.x - (BUILDING_W / 2);
  const z = position.y - (BUILDING_D / 2);
  const y = (position.floor * FLOOR_HEIGHT) + 1; // +1 żeby stał na podłodze

  const color = vitals.stress_level === "critical" ? "#ff4d4d" : "#37f58c";

  return (
    <group position={[x, y, z]} onClick={(e) => { e.stopPropagation(); onClick(firefighter.id); }}>
      {/* Ciało strażaka (Kapsuła) */}
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.4, 1, 4, 8]} />
        <meshStandardMaterial color={isSelected ? "#3498db" : color} />
      </mesh>

      {/* Etykieta HTML nad głową (zawsze przodem do kamery) */}
      <Html position={[0, 2.5, 0]} center distanceFactor={15}>
        <div style={{
          background: "rgba(0,0,0,0.8)", 
          padding: "2px 6px", 
          borderRadius: "4px", 
          color: "white", 
          fontSize: "12px",
          whiteSpace: "nowrap",
          border: isSelected ? "1px solid #3498db" : "none"
        }}>
          {firefighter.name}
        </div>
      </Html>
    </group>
  );
};

// --- KOMPONENT: PIĘTRO ---
const Floor3D = ({ level, color }) => {
  const y = level * FLOOR_HEIGHT;
  
  return (
    <group position={[0, y, 0]}>
      {/* Podłoga */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[BUILDING_W, BUILDING_D]} />
        <meshStandardMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Krawędzie (Ściany - obrys) */}
      <lineSegments position={[0, 0.1, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(BUILDING_W, 0.2, BUILDING_D)]} />
        <lineBasicMaterial color="#ffffff" opacity={0.3} transparent />
      </lineSegments>

      {/* Numer piętra (Tekst 3D) */}
      <Text 
        position={[-BUILDING_W/2 - 2, 0.5, 0]} 
        fontSize={1.5} 
        color="white" 
        rotation={[0, Math.PI/2, 0]}
      >
        Piętro {level}
      </Text>
    </group>
  );
};

export default function Map3D({ firefighters, selectedId, setSelectedId }) {
  const floors = [-1, 0, 1, 2]; // Twoje piętra

  return (
    <div style={{ width: "100%", height: "100%", background: "#111" }}>
      <Canvas camera={{ position: [30, 20, 30], fov: 50 }}>
        {/* Oświetlenie */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 20, 10]} intensity={1} />
        <directionalLight position={[-10, 30, 20]} intensity={1.5} />

        {/* Kontrola kamery (obracanie, zoom) */}
        <OrbitControls 
          target={[0, 5, 0]} 
          maxPolarAngle={Math.PI / 2} // Blokada, żeby nie wejść pod podłogę
        />

        {/* Budynek - Piętra */}
        {floors.map(f => (
          <Floor3D key={f} level={f} color={FLOOR_COLORS[f] || "#555"} />
        ))}

        {/* Klatka schodowa (Szyb) - Przezroczysty słup */}
        <mesh position={[35 - (BUILDING_W/2), 5, 20 - (BUILDING_D/2)]}>
            <boxGeometry args={[4, FLOOR_HEIGHT * 4, 4]} />
            <meshStandardMaterial color="yellow" transparent opacity={0.2} wireframe />
        </mesh>

        {/* Strażacy */}
        {Object.values(firefighters).map(data => (
          <Firefighter3D 
            key={data.firefighter.id} 
            data={data} 
            isSelected={data.firefighter.id === selectedId}
            onClick={setSelectedId}
          />
        ))}

        {/* Siatka pomocnicza na poziomie 0 */}
        <Grid position={[0, -4.1, 0]} args={[100, 100]} cellColor="#333" sectionColor="#555" />
      </Canvas>
      
      {/* Legenda/Info */}
      <div style={{position: 'absolute', bottom: 10, left: 10, color: '#777', fontSize: '0.8rem', pointerEvents: 'none'}}>
        LPM: Obrót | PPM: Przesuwanie | Scroll: Zoom
      </div>
    </div>
  );
}