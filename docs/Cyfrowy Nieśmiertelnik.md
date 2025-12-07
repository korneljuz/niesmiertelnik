---

---
## Schemat blokowy 
![[diagram-export-6.12.2025-20_47_15.png]]

## 2. Lista materiałów

Tabela uwzględnia kluczowe komponenty aktywne i pasywne. Ceny szacunkowe dla wolumenu 1000 szt.

| **Gr.**  | **Komponent**    | **Model (Part Number)** | **Producent**  | **Obudowa / Wymiary** | **Waga (g)** | **Cena**  | **Dostępność** |
| -------- | ---------------- | ----------------------- | -------------- | --------------------- | ------------ | --------- | -------------- |
| **MCU**  | Główny SoC       | **nRF52840-QIAA**       | Nordic Semi    | aQFN-73 (7x7 mm)      | 0.20         | $5.20     | Wysoka         |
| **PWR**  | PMIC             | **nPM1300**             | Nordic Semi    | QFN-32 (5x5 mm)       | 0.10         | $2.50     | Średnia        |
| **BAT**  | Bateria LiFePO4  | **IFR18650**            | EVE Energy     | Cyl. 18650 (Ø18x65mm) | **45.00**    | $3.50     | Wysoka         |
| **RF**   | LTE-M Modem      | **BG77**                | Quectel        | LGA (14.9x12.9x1.7mm) | 0.73         | $14.50    | Wysoka         |
| **RF**   | LoRa Transceiver | **SX1262**              | Semtech        | QFN-24 (4x4 mm)       | 0.10         | $5.80     | Wysoka         |
| **RF**   | GNSS Receiver    | **MIA-M10Q**            | u-blox         | SiP (4.5x4.5 mm)      | 0.10         | $10.50    | Średnia        |
| **RF**   | UWB Module       | **DWM3000**             | Qorvo          | Moduł (23.0x13.0 mm)  | 1.50         | $16.00    | Wysoka         |
| **SENS** | IMU + ML         | **LSM6DSV16X**          | STMicro        | LGA (2.5x3.0 mm)      | 0.05         | $3.50     | Wysoka         |
| **SENS** | Gaz CO (Thin)    | **3SP_CO_1000**         | SPEC Sensors   | Printed (15x15x3 mm)  | 0.80         | $6.50     | Średnia        |
| **SENS** | VOC / NOx        | **SGP41**               | Sensirion      | DFN (2.4x2.4 mm)      | 0.05         | $4.80     | Wysoka         |
| **SENS** | Barometr         | **BMP581**              | Bosch          | LGA (2.0x2.0 mm)      | 0.02         | $2.80     | Wysoka         |
| **UI**   | Haptic Motor     | **LRA 1030**            | Precision      | Coin (Ø10x3 mm)       | 1.20         | $1.50     | Wysoka         |
| **UI**   | Przycisk SOS     | **KSC4 TE**             | C&K            | Tact (6x6 mm)         | 0.20         | $0.60     | Wysoka         |
| **SEC**  | Crypto Element   | **ATECC608B**           | Microchip      | UDFN-8 (2x3 mm)       | 0.05         | $0.80     | Wysoka         |
| **MEM**  | Flash Memory     | **AT25FF161A**          | Adesto         | SOIC-8 (5x6 mm)       | 0.15         | $1.10     | Wysoka         |
| **PASS** | Reflektor RECCO  | **Reflektor 503**       | RECCO AB       | Strip (50x15x3 mm)    | 3.50         | $15.00    | Specjalna      |
| **MECH** | Izolacja         | **Pyrogel® 2250**       | Aspen Aerogels | Mata (grubość 2mm)    | 2.00         | $2.50     | Przemysłowa    |
| **MECH** | Membrana         | **Gore GA**             | W.L. Gore      | Sticker (Ø6 mm)       | 0.05         | $1.50     | Wysoka         |
| **ANT**  | Zestaw Anten     | **Ceramic/FPC**         | Molex/Taoglas  | Różne                 | 4.00         | $6.00     | Wysoka         |
| **PCB**  | Laminat          | **FR4 4-layer**         | Custom         | 65x45 mm              | 8.00         | $3.00     | -              |
| **CASE** | Obudowa          | **PC/PBT**              | Custom         | 75x50x22 mm           | 25.00        | $3.00     | -              |
| **SUMA** |                  |                         |                |                       | **~93 g**    | **~$102** |                |


### 3. Specyfikacja Techniczna i Parametry Fizyczne
Poniższa specyfikacja wynika z analizy wymiarowej oraz bilansu masy dla wersji produkcyjnej.

* **Wymiary Zewnętrzne:**
    * **Długość × Szerokość:** 75 × 50 mm (Format kompatybilny z uchwytami SCBA).
    * **Grubość:** 18 mm (korpus główny) / 24 mm (w sekcji baterii z izolacją aerożelową).
    * *Komentarz:* Zastosowanie płaskiego sensora elektrochemicznego (SPEC Sensors) pozwoliło na redukcję profilu urządzenia o 30% względem rozwiązań opartych na tradycyjnych sensorach cylindrycznych.

* **Masa Całkowita: ~93 g**
    * W tym bateria LiFePO4: 45.0 g.
    * W tym elektronika i sensory: ~17.5 g.
    * W tym obudowa i elementy pasywne: ~30.5 g.
    * *Wynik:* Urządzenie jest o ok. 40% lżejsze od typowego smartfona, co minimalizuje obciążenie ekwipunku ratownika.

* **Obudowa i Wytrzymałość:**
    * **Materiał:** PC/PBT (np. SABIC Xenoy™) – polimer inżynieryjny o wysokiej udarności w niskich temperaturach.
    * **Klasa Palności:** UL94 V-0 (samogasnące, brak kapiącego tworzywa).
    * **Stopień Ochrony:** **IP67** – pełna pyłoszczelność oraz odporność na zanurzenie w wodzie (1m przez 30 min). Zastosowano membranę ePTFE (Gore Vent) do wyrównywania ciśnienia i doprowadzania gazów do sensorów.

* **System Zasilania:**
    * **Ogniwo:** Wymienne ogniwo przemysłowe LiFePO4 18650 (EVE Energy), 1500 mAh, 3.2V.
    * **Bezpieczeństwo:** Chemia litowo-żelazowo-fosforanowa (LFP) odporna na *Thermal Runaway* (niekontrolowany zapłon) przy uszkodzeniu mechanicznym.
    * **Izolacja Termiczna:** Bateria owinięta matą aerożelową **Aspen Pyrogel® (2mm)**, opóźniającą wzrost temperatury ogniwa w strefie zagrożenia.

* **Czas Pracy (Autonomia):**
    * **Tryb Aktywny (Akcja Ratownicza):** **~72 - 84 h** (przy cyklu: UWB 1Hz, LoRa TX co 30s, ciągły pomiar gazów). Przekracza wymagania dla długotrwałych akcji poszukiwawczych.
    * **Tryb Czuwania (Deep Sleep):** **>12 miesięcy** (dzięki trybowi "Ship Mode" układu nPM1300, pobór <2 µA).

* **Warunki Pracy:**
    * **Temperatura otoczenia:** -20°C do +75°C (praca ciągła).
    * **Odporność na udar termiczny:** Krótkotrwała wytrzymałość do +150°C (dzięki barierze aerożelowej chroniącej ogniwo).


### 4. Szczegółowy Budżet Energetyczny

Analizę przeprowadzono dla ogniwa **LiFePO4 1500 mAh** (EVE IFR18650) przy napięciu nominalnym 3.2V. Uwzględniono sprawność przetwornic Buck w układzie **nPM1300** na poziomie $\eta = 92\%$.

#### 4.1. Profil Obciążenia: Scenariusz "Indoor Active" (Akcja Ratownicza)
W tym scenariuszu urządzenie znajduje się wewnątrz budynku, bez sygnału GPS. Priorytetem jest ciągła lokalizacja UWB oraz monitoring parametrów życiowych.

| Podsystem | Komponent | Charakterystyka Pracy (Duty Cycle) | Prąd Szczytowy (Peak) | Średni Pobór (Avg)* | Uzasadnienie |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MCU** | nRF52840 | **Active/Idle** (Zarządzanie stosem, przetwarzanie ML) | 6.4 mA | **3.00 mA** | Średnia z cykli wybudzeń przez przerwania sensorów. |
| **UWB** | DWM3000 | **1 Hz TWR** (Ranging co 1s, czas ramki ~10ms) | 65.0 mA | **5.20 mA** | Największy konsument energii. Krótkie, wysokie piki prądowe. |
| **LoRa** | SX1262 | **TX co 30s** (SF7-SF12, moc 14dBm) | 45.0 mA | **2.50 mA** | Telemetria do wozu dowodzenia. |
| **Sensory** | Hub I2C | **Continuous** (Próbkowanie 12-50 Hz) | 1.2 mA | **0.85 mA** | IMU (MLC), Barometr, SGP41 (Proxy), Temp. |
| **Gaz** | SPEC+AFE | **Continuous** (Pomiar analogowy) | 0.5 mA | **0.50 mA** | Wzmacniacz operacyjny AFE pracuje w trybie ciągłym. |
| **PMIC** | nPM1300 | **Quiescent** (Straty własne + konwersja) | - | **0.15 mA** | Prąd spoczynkowy układu zarządzania energią. |
| **SUMA** | | | | **~12.20 mA** | **Typowy prąd pobierany z baterii** |

*\*Wartości uśrednione uwzględniające interwały uśpienia.*

#### 4.2. Obliczenie Teoretycznego Czasu Pracy ($T_{nom}$)

$$T_{nom} = \frac{C_{bat}}{I_{avg}} = \frac{1500\ mAh}{12.2\ mA} \approx \mathbf{122.9\ h}$$

#### 4.3. Korekta Rzeczywista (Worst-Case Analysis)

W warunkach pożarowych (ekstremalne temperatury) oraz przy starzeniu się ogniwa, pojemność efektywna spada. Zastosowano inżynierskie współczynniki bezpieczeństwa:

1.  **Współczynnik Temperaturowy ($k_{temp}$):** 0.85 (Spadek wydajności w skrajnych temp. <0°C lub >60°C).
2.  **Współczynnik Starzenia ($k_{aging}$):** 0.90 (Degradacja ogniwa po cyklach ładowania - End of Life).
3.  **Rezerwa Krytyczna ($k_{safe}$):** 0.90 (System musi zaraportować "Low Battery" zanim padnie).

$$T_{real} = T_{nom} \times k_{temp} \times k_{aging} \times k_{safe}$$
$$T_{real} = 122.9\ h \times 0.85 \times 0.90 \times 0.90 \approx \mathbf{84.6\ h}$$

#### 4.4. Wnioski

* **Gwarantowany czas pracy:** **>72 godziny** (3 doby ciągłej akcji) w najtrudniejszych warunkach.
* **Margines bezpieczeństwa:** Bateria 1500 mAh zapewnia ponad 2-krotny zapas względem typowej zmiany ratowniczej (12h), co eliminuje konieczność ładowania w trakcie działań.
* **Tryb "Deep Sleep":** Po zakończeniu akcji, system przechodzi w tryb uśpienia (pobór <15 µA), co pozwala na składowanie urządzenia w wozie przez **>12 miesięcy** bez konieczności doładowywania.


# 5. Analiza Techniczna i Uzasadnienie Doboru Komponentów
Wybory podyktowane były trzema kryteriami: bezpieczeństwo (Safety Integrity), energooszczędność (Low Power) oraz ergonomia (Slim Design).

## 5.1. Jednostka Centralna i Zarządzanie Energią

### MCU: Nordic Semiconductor nRF52840-QIAA
**Uzasadnienie:** Wybrano ten układ SoC (System-on-Chip) ze względu na natywne wsparcie dla **Bluetooth 5.0 Mesh**, co jest kluczowe dla autonomicznej komunikacji między strażakami ("rój"). Rdzeń ARM Cortex-M4F zapewnia wystarczającą moc obliczeniową dla algorytmów fuzji sensorów, a wbudowany akcelerator kryptograficzny **ARM CryptoCell-310** gwarantuje bezpieczeństwo danych medycznych bez obciążania CPU. Pobór prądu w trybie uśpienia wynosi zaledwie 1.5 µA.

### PMIC: Nordic Semiconductor nPM1300
**Uzasadnienie:** Innowacyjny układ zarządzania energią (PMIC), który zastępuje trzy osobne układy (ładowarkę, przetwornicę DC/DC, wskaźnik paliwa). Kluczową funkcją dla systemów ratowniczych jest sprzętowy **Watchdog** oraz **Hard Reset**, który fizycznie restartuje zasilanie w przypadku wykrycia błędu krytycznego oprogramowania. Zintegrowany Fuel Gauge precyzyjnie monitoruje stan baterii LiFePO4, która ma płaską charakterystykę rozładowania.

### Bateria: EVE IFR18650 (LiFePO4)
**Uzasadnienie:** Priorytetem jest bezpieczeństwo termiczne. Standardowe ogniwa Li-Ion (LiCoO2) przy temperaturze >150°C mogą ulec niekontrolowanemu zapłonowi (Thermal Runaway). Wybrano chemię **LiFePO4** (litowo-żelazowo-fosforanowa), która pozostaje stabilna chemicznie nawet przy penetracji mechanicznej i wysokich temperaturach zewnętrznych.

---

## 5.2. Moduły Komunikacji Radiowej (RF Front-End)

### LoRaWAN: Semtech SX1262
**Uzasadnienie:** Nowoczesny transceiver o niższym poborze prądu niż starszy SX1276. Wybrano wersję z **TCXO** (kompensacja temperaturowa kwarcu), co gwarantuje stabilność częstotliwości i utrzymanie łącza nawet przy gwałtownych zmianach temperatury w środowisku pożarowym. Obsługa modulacji LR-FHSS zapewnia kompatybilność z przyszłymi systemami satelitarnymi.

### LTE-M / NB-IoT: Quectel BG77
**Uzasadnienie:** Najmniejszy na świecie zintegrowany modem LTE Cat M1/NB2 (wymiary 14.9×12.9 mm). Wybrany ze względu na miniaturyzację oraz rekordowo niski pobór prądu w trybie oszczędzania energii (PSM: 3.2 µA), co jest wartością o 70% lepszą od konkurencyjnych rozwiązań.

### UWB: Qorvo DWM3000
**Uzasadnienie:** Moduł zgodny ze standardem IEEE 802.15.4z, niezbędny do precyzyjnej lokalizacji wewnątrzbudynkowej (<30 cm). W przeciwieństwie do starszego DWM1000, obsługuje kanały 5 i 9, co zapewnia lepszą odporność na zakłócenia od sieci Wi-Fi, powszechnych w budynkach mieszkalnych.

### GNSS: u-blox MIA-M10Q
**Uzasadnienie:** Najnowsza generacja chipsetu M10 w obudowie SiP (System-in-Package) o wymiarach zaledwie 4.5×4.5 mm. Zużywa poniżej 25 mW w trybie śledzenia ciągłego, co stanowi znaczną oszczędność względem starszych modułów M8 (ok. 65 mW).

---

## 5.3. Sensoryka (Sensor Fusion)

### IMU: STMicroelectronics LSM6DSV16X
**Uzasadnienie:** Wybrano ten sensor ze względu na wbudowany rdzeń **Machine Learning Core (MLC)** oraz FSM (Finite State Machine). Pozwala on na detekcję stanu "Man Down" (bezruch/upadek) bezpośrednio w strukturze krzemowej czujnika przy poborze prądu <15 µA, bez konieczności ciągłego wybudzania głównego procesora.

### Barometr: Bosch BMP581
**Uzasadnienie:** Następca popularnego BMP390. Oferuje ekstremalną precyzję względną ±6 Pa (ok. 50 cm wysokości), co pozwala na niezawodne wykrycie zmiany kondygnacji (piętra) oraz odróżnienie postawy stojącej od leżącej. Charakteryzuje się również bardzo niskim szumem własnym.

### Gaz (CO): SPEC Sensors 3SP_CO_1000
**Uzasadnienie:** Zastosowanie technologii drukowanej elektroniki (Screen Printed Electrochemistry) pozwoliło zredukować grubość sensora do 3 mm (vs 15 mm w tradycyjnych sensorach "kubkowych"). Jest to kluczowe dla ergonomii urządzenia noszonego pod kurtką bojową. Sensor nie zużywa energii w spoczynku.

### AFE (Analog Front End): Texas Instruments LMP91000
**Uzasadnienie:** Niezbędny układ kondycjonowania sygnału (potencjostat) do obsługi sensora SPEC. Pozwala na programową regulację napięcia polaryzacji (Bias) przez I2C, co umożliwia precyzyjną kalibrację sensora w trakcie życia produktu.

### Jakość Powietrza (VOC): Sensirion SGP41
**Uzasadnienie:** Zastosowany jako "proxy" do detekcji zagrożeń pożarowych. Sensor MOX wykrywa lotne związki organiczne (VOC) i NOx, które pojawiają się we wczesnej fazie tlenia materiałów, często zanim wzrośnie temperatura.

### Temperatura/Wilgotność: Sensirion SHT40
**Uzasadnienie:** Sensor referencyjny niezbędny do kompensacji dryfu termicznego sensora gazu oraz barometru. Posiada wbudowaną grzałkę, która pozwala na okresowe odparowanie kondensacji (wody) z powierzchni czujnika, co jest częstym problemem w akcjach gaśniczych.

---

## 5.4. Peryferia i Bezpieczeństwo

### Secure Element: Microchip ATECC608B
**Uzasadnienie:** Dedykowany układ kryptograficzny do bezpiecznego przechowywania kluczy prywatnych (Hardware Key Storage). Zapewnia sprzętową odporność na ataki typu side-channel, co jest wymogiem przy przetwarzaniu wrażliwych danych biomedycznych strażaków.

### Pamięć Flash: Adesto (Renesas) AT25FF161A
**Uzasadnienie:** Pamięć typu "Black Box" do zapisu logów z akcji. Wybrano serię "Ultra-Low Energy", która w trybie Deep Power-Down pobiera zaledwie kilkaset nanoamperów, co nie obciąża baterii podczas długiego magazynowania urządzenia.

### Haptic (Wibracja): Precision Microdrives LRA 1030
**Uzasadnienie:** Silnik typu LRA (Linear Resonant Actuator) zapewnia znacznie szybszy czas reakcji i silniejszy impuls ("kopa") niż tradycyjne silniki rotacyjne (ERM). Pozwala to na generowanie wyraźnych, ostrych sygnałów ostrzegawczych wyczuwalnych przez grubą odzież ochronną.

### Przycisk SOS: C&K KSC4 TE
**Uzasadnienie:** Przycisk typu Tactile Switch o podwyższonej sile nacisku (5N) i stopniu ochrony IP67. Wysoka siła aktywacji zapobiega przypadkowym wciśnięciom podczas czołgania się czy uderzeń o przeszkody.

---

## 5.5. Elementy Pasywne (Safety)

### Reflektor RECCO 503
**Uzasadnienie:** Pasywny element rezonansowy (dioda harmoniczna), który nie wymaga zasilania. Zapewnia "ostatnią linię obrony" – możliwość zlokalizowania strażaka przez radar ratowniczy nawet w przypadku całkowitego zniszczenia elektroniki lub wyczerpania baterii.

### Membrana ePTFE (Gore Vent)
**Uzasadnienie:** Zapewnia klasę szczelności IP67 (ochrona przed wodą i pyłem), jednocześnie umożliwiając swobodny przepływ gazów do sensorów oraz wyrównywanie ciśnienia wewnątrz obudowy (zapobiega zassaniu uszczelek przy zmianie temperatur).


### 6. Aspekty Praktyczne i Wdrożeniowe

#### 6.1. Montaż i Ergonomia Użytkowania

- **Lokalizacja urządzenia:** Urządzenie montowane jest na **klatce piersiowej strażaka** (na pasie naramiennym uprzęży aparatu powietrznego SCBA lub systemie MOLLE kurtki bojowej).    
	- _Uzasadnienie:_ Jest to optymalna pozycja dla anten (GNSS/LoRa), zapewnia najlepszą słyszalność buzzera oraz precyzję detekcji upadku przez sensor IMU (rozróżnienie pozycji stojącej/leżącej).

- **System mocowania:** Zintegrowany, wzmocniony klips sprężynowy (Heavy-Duty Spring Clip) wykonany ze stali nierdzewnej, zapewniający pewne trzymanie nawet podczas czołgania się czy uderzeń mechanicznych.

- **Obsługa w rękawicach:** Przycisk SOS (Tactile Switch o sile nacisku 5N) został zaprojektowany z fizycznym pierścieniem ochronnym ("collar"), który zapobiega przypadkowemu wciśnięciu, ale umożliwia łatwą aktywację w grubych rękawicach b

#### 6.2. Zasilanie i Obsługa Baterii

- **Ładowanie:** Odbywa się poprzez **uszczelnione gniazdo USB-C (klasa IP67)** umieszczone na dolnej krawędzi obudowy. Gniazdo nie wymaga gumowej zaślepki do zachowania szczelności (zastosowano gniazdo zalewane żywicą).

- **Infrastruktura:** Projekt zakłada wykorzystanie zbiorczych stacji dokujących ("Gang Chargers") montowanych w kabinie wozu bojowego, co gwarantuje 100% naładowania urządzenia w momencie dojazdu na miejsce akcji.

- **Cykl życia baterii:** Zastosowane ogniwo **LiFePO4** (EVE IFR18650) charakteryzuje się żywotnością >2000 cykli (ok. 5-7 lat codziennego ładowania). Eliminuje to konieczność częstej wymiany baterii przez użytkownika końcowego. Wymiana ogniwa przewidziana jest tylko w ramach okresowego przeglądu serwisowego (co 3 lat

#### 6.3. Wytrzymałość i Środowisko

- **Obudowa:** Wykonana z tworzywa inżynieryjnego **PC/PBT (np. SABIC Xenoy™)**. Materiał ten jest odporny na uderzenia w niskich temperaturach (-30°C) oraz na działanie chemikaliów (piany gaśnicze, paliwa).

- **Klasa palności:** Materiał obudowy spełnia normę **UL94 V-0** (samogasnący, niekapiący), co jest krytyczne w strefie ognia.

- **Szczelność (IP67):** Urządzenie jest w pełni pyłoszczelne i wytrzymuje zanurzenie w wodzie (1m przez 30 min).

- _Rozwiązanie techniczne:_ Zastosowano membranę **ePTFE (Gore Vent)**, którablokuje wodę, ale przepuszcza powietrze i gazy do sensorów (SGP41, SPEC)oraz dźwięk z buzzera.    

#### 6.4. Certyfikacje (Compliance Roadmap)

Projekt został przygotowany z myślą o spełnieniu następujących norm:

1. **RED (Radio Equipment Directive):** Zgodność modułów radiowych (nRF52, SX1262, BG77, DWM3000) z normami ETSI dla pasm ISM 868MHz, 2.4GHz oraz UWB.

2. **ATEX (Strefa 2):** Konstrukcja "Iskrobezpieczna" (_Intrinsically Safe_ - Ex ib). Użycie baterii LiFePO4 (bezpieczna chemia), niskich napięć (3.3V) oraz zalewanie obwodów wysokoprądowych lakierem konforemnym.

3. **MIL-STD-810G (Metoda 516.6):** Odporność na wstrząsy i upadek z wysokości 1.5m na beton (zapewniona przez wewnętrzną strukturę "żeberkową" obudowy i lekką elektronikę).

#### 6.5. Analiza Produkcyjna i Kosztowa

**Dostępność Komponentów (Supply Chain 2025):** Wszystkie kluczowe układy (Nordic nRF52/nPM1300, Semtech SX1262, Quectel BG77) znajdują się w fazie "Active" u głównych dystrybutorów (Mouser, DigiKey, TME) i nie są zagrożone wycofaniem (EOL). Uniknięto komponentów niszowych.

**Wykonalność PCB:** Projekt wykorzystuje standardowy laminat **FR4 (4-warstwowy)** o grubości 1.6mm. Nie wymaga drogich technologii (jak HDI czy Blind Vias), co pozwala na produkcję w dowolnej fabryce PCB w Europie czy Azji.

**Szacunkowy koszt jednostkowy (BOM Cost) przy skalowaniu:**

|Wolumen Produkcji|Koszt BOM (USD)|Koszt Produkcji (Montaż + Testy)|Szacowany Koszt Całkowity|
|---|---|---|---|
|**Prototyp (10 szt.)**|~$140|~$50|**~$190**|
|**Pilot (100 szt.)**|~$115|~$25|**~$140**|
|**Seria (1000+ szt.)**|~$92|~$15|**~$107**|


# 7. Potencjał Wdrożeniowy: Adaptacja dla Innych Służb (Cross-Domain Scalability)

Architektura "Cyfrowego Nieśmiertelnika v3.0" jest modułowa, co pozwala na jej szybką adaptację do specyficznych wymagań innych formacji ratowniczych. Poniżej przedstawiono analizę różnic środowiskowych i wymaganych modyfikacji dla ratownictwa górskiego i górniczego.

## 7.1. Ratownictwo Górskie (GOPR / TOPR)

Środowisko górskie różni się od pożarowego drastycznie większym obszarem działań i mniejszym zagęszczeniem infrastruktury.

### Różnice w środowisku pracy:
1. **Skala terenu:** Akcje toczą się na obszarze dziesiątek kilometrów kwadratowych, a nie w obrębie jednego budynku.
2. **Topografia:** Głębokie doliny i ściany skalne skutecznie blokują sygnał GPS i GSM.
3. **Temperatura:** Długotrwała ekspozycja na mróz (do -30°C), co jest zabójcze dla standardowych baterii Li-Po.
4. **Zagrożenie:** Lawiny (zasypanie śniegiem) zamiast zawaleń stropów.

### Wymagane modyfikacje (Wariant "Alpine"):

- **Łączność (LoRa dalekiego zasięgu):**
    - Zmiana anteny na **helikalną 169 MHz** (VHF) lub optymalizacja pasma 868 MHz pod kątem dyfrakcji na graniach.
    - Wykorzystanie modulacji **LR-FHSS** (obsługiwanej przez nasz chip SX1262) do łączności bezpośredniej z satelitami LEO (wspomniany wcześniej "Satellite Backup"), aby wezwać pomoc z dna doliny.
- **Zasilanie (Cold-Resistant):**
    - Zastosowana w naszym projekcie chemia **LiFePO4** świetnie radzi sobie na mrozie (w przeciwieństwie do Li-Ion, które "umierają" przy -10°C).
- **Sensoryka:**
    - Barometr (BMP581) jest tu kluczowy do określenia głębokości zasypania w lawinie (pomiar ciśnienia w pęcherzu powietrznym).
- **Pasywne:**
    - Nasz system już posiada reflektor **RECCO**, który jest standardem w GOPR/TOPR. To ogromna zaleta wdrożeniowa.
---

## 7.2. Ratownictwo Górnicze (CSRG / KGHM)
To najtrudniejsze środowisko technologiczne na Ziemi. Setki kilometrów chodników, strefy wybuchowe i absolutny brak fal radiowych z zewnątrz.

### Różnice w środowisku pracy:

1. **Propagacja fal:** Tunel działa jak falowód. Fale 868 MHz niosą się daleko w linii prostej, ale giną natychmiast za zakrętem (brak odbić od nieba).
2. **Zagrożenie wybuchem:** Strefy "Metanowe" (Methane Zone). Wymogi **ATEX Ex ia** (iskrobezpieczeństwo poziomu "a") są znacznie bardziej rygorystyczne niż dla straży pożarnej.
3. **Brak GPS:** Absolutnie zerowy sygnał GNSS. Lokalizacja musi opierać się w 100% na Beaconach i IMU.

### Wymagane modyfikacje (Wariant "Mine"):

- **Obudowa Antystatyczna:**
    - Obudowa musi być wykonana z tworzywa domieszkowanego węglem (przewodzącego), aby zapobiec gromadzeniu się ładunków elektrostatycznych, które mogłyby wywołać iskrę.
- **Sensor Metanu (CH4):**
    - Wymiana sensora VOC (SGP41) na dedykowany sensor **Pellistorowy lub NDIR** do wykrywania metanu (dolnej granicy wybuchowości).
- **Strategia "Breadcrumbs" (Okruszki):**
    - Ratownicy górniczy muszą zostawiać Beacony (nasze "Spidery") znacznie gęściej – na każdym skrzyżowaniu chodników, aby utrzymać ciągłość sieci Mesh.
- **Ograniczenie Mocy:**
    - Moc nadawania radia musi zostać programowo ograniczona, aby energia fali radiowej nie zainicjowała zapłonu zapalników elektrycznych (jeśli są używane w kopalni).
---

## 7.3. Tabela Porównawcza Wymagań

| Cecha Systemu               | Straż Pożarna (PSP)   | GOPR / TOPR (Góry)       | Ratownictwo Górnicze           |     |
| --------------------------- | --------------------- | ------------------------ | ------------------------------ | --- |
| **Priorytet Lokalizacji**   | 3D (Piętro budynku)   | 2D (Mapa terenu)         | 1D (Dystans w tunelu)          |     |
| **Główne Zagrożenie**       | Temperatura / Ogień   | Zimno / Lawina           | Wybuch (Metan) / Zawał         |     |
| **Łączność Podstawowa**     | LoRaWAN + UWB         | LoRa (Long Range)        | Mesh (Multi-hop)               |     |
| **Wymóg GPS**               | Backup (Outdoor)      | Krytyczny (Outdoor)      | Brak (Niemożliwy)              |     |
| **Wymóg ATEX**              | Strefa 2 (Podstawowy) | Brak                     | **Strefa 0/1 (Rygorystyczny)** |     |
| **Kluczowy Sensor**         | Tlenek Węgla (CO)     | Barometr (Wysokość)      | **Metan (CH4)**                |     |
| **Status naszego projektu** | **100% Zgodności**    | **100%** (Wbudowany SAT) | **70%** (Wymiana sensora)      |     |
