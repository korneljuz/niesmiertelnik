Next-Gen Commander Dashboard 🚒
Cyfrowy bliźniak akcji ratunkowej. Innowacyjny system dowodzenia łączący wizualizację 3D budynku z telemetrią w czasie rzeczywistym. Daje dowódcy pełny wgląd w sytuację: od dokładnej pozycji strażaków na piętrach, przez parametry życiowe, aż po natychmiastowe alerty o zagrożeniu życia.

🚀 Główne Funkcjonalności
Wizualizacja 3D (Digital Twin): Pełny model 3D budynku (Three.js/R3F) z pozycjami ratowników w czasie rzeczywistym.

Mapa Taktyczna 2D: Integracja z mapami satelitarnymi i technicznymi (Leaflet), obsługa pięter i wejść.

Monitoring Telemetrii: Podgląd na żywo tętna, poziomu stresu, zapasu powietrza (SCBA) i baterii.

Inteligentne Alerty:

Wykrywanie bezruchu (Man-Down > 30s).

Obsługa przycisku SOS.

System deduplikacji powiadomień ("Sticky Alerts") – alert znika dopiero po zatwierdzeniu.

Centrum Powiadomień: Sortowanie alertów według priorytetu (zagrożenie życia > sprzęt) i czasu wystąpienia.

Tryb Ciemny: Interfejs zoptymalizowany do pracy w trudnych warunkach oświetleniowych.

🛠️ Tech Stack
Frontend

React 18 (Vite)

React Three Fiber / Drei (Wizualizacja 3D)

Leaflet / React-Leaflet (Mapy 2D)

Socket.io-client (Komunikacja Real-time)

Chart.js (Wykresy medyczne)

Backend

Python 3.10+

FastAPI (Serwer asynchroniczny)

Python-Socketio (Obsługa WebSocket)

SQLAlchemy + SQLite (Baza danych alertów i logów)

⚙️ Instalacja i Uruchomienie
1. Backend (Serwer)

Wymaga Pythona. Zainstaluj zależności i uruchom serwer:

Bash
cd backend
pip install fastapi uvicorn python-socketio websockets sqlalchemy httpx
python server.py
Serwer wystartuje na porcie 8000 i zacznie nasłuchiwać danych z symulatora/API.

2. Frontend (Aplikacja)

Wymaga Node.js. W nowym terminalu:

Bash
cd frontend
npm install
npm install three @react-three/fiber @react-three/drei leaflet react-leaflet chart.js react-chartjs-2 socket.io-client react-icons
npm run dev
Aplikacja dostępna pod adresem http://localhost:5173 (lub podobnym).

📂 Struktura Projektu
src/components/MapView.js – Główny widok mapy (logika przełączania 2D/3D).

src/components/Map3D.js – Implementacja sceny 3D w Three.js.

src/components/InfoPanel.js – Boczny panel z listą strażaków, filtrami i alertami.

src/components/FirefighterPanel/ – Karty strażaków i widok szczegółowy.

src/App.jsx – Główna logika buforowania alertów i obsługa Socket.IO.

server.py – Backend: proxy danych, detekcja bezruchu i baza danych.

📸 Status Projektu
Projekt w fazie MVP. Gotowy do integracji z fizycznymi sensorami UWB/LoRa.