# Cyfrowy Nieśmiertelnik 3.0 🚒

**Cyfrowy bliźniak akcji ratunkowej.** Innowacyjny system dowodzenia łączący wizualizację 3D budynku z telemetrią w czasie rzeczywistym. Daje dowódcy pełny wgląd w sytuację: od dokładnej pozycji strażaków na piętrach, przez parametry życiowe, aż po natychmiastowe alerty o zagrożeniu życia.

[Dokumentacja Cyfrowego Nieśmiertelnika](docs/cyfrowy_niesmiertelnik.md)
[Dokumentacja Beacona](docs/beacon_UWB.md)
[Dokumentacja Bramki NIB](docs/Bramka_NIB.md)

## 🚀 Główne Funkcjonalności

* **Wizualizacja 3D:** Pełny model 3D budynku (Three.js/R3F) z pozycjami ratowników w czasie rzeczywistym.
* **Mapa Taktyczna 2D:** Integracja z mapami satelitarnymi i technicznymi (Leaflet), obsługa pięter i wejść.
* **Monitoring Telemetrii:** Podgląd na żywo tętna, poziomu stresu, zapasu powietrza (SCBA) i baterii.
* **Inteligentne Alerty:**
    * Wykrywanie bezruchu (Man-Down > 30s).
    * Obsługa przycisku SOS.
    * System deduplikacji powiadomień ("Sticky Alerts") – alert znika dopiero po zatwierdzeniu.
* **Centrum Powiadomień:** Sortowanie alertów według priorytetu (zagrożenie życia > sprzęt) i czasu wystąpienia.

## 🛠️ Tech Stack

### Frontend
* **React 18** (Vite)
* **React Three Fiber / Drei** (Wizualizacja 3D)
* **Leaflet / React-Leaflet** (Mapy 2D)
* **Socket.io-client** (Komunikacja Real-time)
* **Chart.js** (Wykresy medyczne)

### Backend
* **Python 3.10+**
* **FastAPI** (Serwer asynchroniczny)
* **Python-Socketio** (Obsługa WebSocket)
* **SQLAlchemy + SQLite** (Baza danych alertów i logów)

## ⚙️ Instalacja i Uruchomienie

### 1. Backend (Serwer)
Wymaga Pythona. Zainstaluj zależności i uruchom serwer:

```bash
cd backend
pip install fastapi uvicorn python-socketio websockets sqlalchemy httpx
python server.py
```

Uruchom serwer (domyślnie port 8000):

```bash
python server.py
```

Serwer rozpocznie nasłuchiwanie danych i wystawi endpoint WebSocket.

### 2. Uruchomienie Frontendu

W nowym oknie terminala przejdź do folderu aplikacji i zainstaluj pakiety NPM:

```bash
cd frontend
npm install three @react-three/fiber @react-three/drei leaflet react-leaflet chart.js react-chartjs-2 socket.io-client react-icons
```

Uruchom wersję deweloperską:

```bash
npm run dev
```
Aplikacja będzie dostępna pod adresem: http://localhost:5173 (lub podobnym wskazanym przez Vite).

###📂 Struktura Projektu
```plaintext
/
├── backend/
│   ├── server.py           # Główna logika, WebSocket, Baza Danych
│   └── alerts.db           # Plik bazy danych SQLite (generowany automatycznie)
│
└── frontend/src/
    ├── api/
    │   └── socket.js       # Konfiguracja połączenia Socket.IO
    ├── components/
    │   ├── MapView.js      # Wrapper mapy (przełącznik 2D/3D)
    │   ├── Map3D.js        # Scena 3D (Three.js)
    │   ├── InfoPanel.js    # Panel boczny (listy, filtry, alerty)
    │   ├── FirefighterPanel/
    │   │   ├── FirefighterCard.js   # Karta na liście (mini dashboard)
    │   │   └── FirefighterDetail.js # Pełny widok szczegółowy
    │   └── AlertsPanel/
    │   |   └── AlertCard.js         # Komponent pojedynczego alertu
    |   ── BeaconCard/
    │   |   └── BeaconCard.js         # Komponent pojedynczego alertu
    |   ── BeaconDetail/
    │       └── BeaconDetail.js         # Komponent pojedynczego alertu
    ├── App.jsx             # Główny stan aplikacji, buforowanie alertów
    └── styles.css          # Globalne style, Dark Mode, Animacje
```

# 📸 Status Projektu
Projekt jest w fazie MVP (Minimum Viable Product). System jest w pełni funkcjonalny w środowisku symulowanym i gotowy do integracji z fizycznymi sensorami UWB/LoRa oraz API systemów pozycjonowania.
