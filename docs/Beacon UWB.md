## 1. Opis Ogólny i schemat blokowy
Beacon pełni funkcję stacjonarnego węzła referencyjnego (Anchor) w systemie lokalizacji. W przeciwieństwie do nasobnego Taga, priorytetem konstrukcyjnym jest tutaj **stabilność montażu**, **zasięg radiowy** (High-Power LoRa) oraz **ekstremalny czas pracy** na zasilaniu bateryjnym. Urządzenie zaprojektowano jako węzeł infrastruktury "Drop & Forget".

![[diagram-export-6.12.2025-22_36_45.png]]

## 2. Lista Materiałowa (BOM)

Tabela uwzględnia elektronikę, potężny system zasilania oraz elementy mechaniczne klasy "Heavy Duty".

| Gr. | Komponent | Model / Typ | Specyfikacja | Cena (est.) | Uzasadnienie Inżynierskie |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MCU** | Główny SoC | **Nordic nRF52840** | aQFN-73 | $5.20 | Unifikacja z Tagiem (ten sam stack softu), obsługa Mesh. |
| **RF** | LoRa (+PA) | **Semtech SX1262** | +22dBm, TCXO | $7.50 | Wersja High-Power ze wzmacniaczem do penetracji stropów żelbetowych. |
| **RF** | GPS (Precyzja) | **u-blox NEO-M9N** | Multi-GNSS | $12.00 | Pełni rolę węzła referencyjnego (Bramofon) dla całej siatki wewnątrzbudynkowej. |
| **RF** | UWB | **Qorvo DWM3000** | IEEE 802.15.4z | $16.00 | Kotwica nawigacyjna odporna na zakłócenia WiFi (Ch5/Ch9). |
| **PWR** | Bateria (Pakiet) | **3x 21700 LiFePO4** | 12,000 mAh | $15.00 | Pakiet 3S1P. Tydzień ciągłej pracy. Bezpieczna chemia (brak wybuchu przy przebiciu). |
| **PWR** | Ładowarka PD | **TI BQ25792** | Buck-Boost | $4.50 | Obsługa USB-C Power Delivery (szybkie ładowanie 30W dużej baterii). |
| **ANT** | Antena LoRa | **Taoglas TI.19** | SMA, TPE | $8.50 | Zewnętrzna, elastyczna antena "batowa". Materiał TPE odporny na uderzenia i ogień. |
| **ANT** | Antena GPS | **Molex Active Patch** | 25x25mm | $4.00 | Duża aktywna antena ceramiczna dla szybkiego fixa (<30s). |
| **MECH**| Obudowa Główna | **PPA + 30% GF** | IP67, Rugged | $14.00 | Poliftalamid wzmocniony szkłem. Odporna na wysokie temperatury (>260°C) i uderzenia. |
| **MECH**| System "Spider" | **Nogi (Tripod)** | Alu/Kompozyt | $9.00 | Rozkładane nóżki z gumowymi końcówkami. Stabilność na gruzie. |
| **MECH**| Baza Magnetyczna | **Magnes N52** | Udźwig 15kg | $5.50 | Potężny magnes neodymowy w podstawie do montażu na futrynach. |
| **MECH**| Uszczelnienia | **Silikon / Gore** | O-ringi, Vent | $3.00 | Pełna wodoszczelność IP67 + wyrównywanie ciśnienia w pożarze. |
| **PCB** | Płyta Główna | **FR4 4-layer** | 1.6mm | $4.50 | Większa powierzchnia miedzi dla lepszego odprowadzania ciepła z PA. |
| **SUMA** | | | | **~$109** | **Koszt urządzenia klasy Infrastructure** |

---

## 3. Specyfikacja Fizyczna i Środowiskowa

* **Wymiary (Złożony):** $130 \times 85 \times 60$ mm (Format "Cegła").
* **Wymiary (Rozłożony):** Rozstaw nóżek (Tripod) $\varnothing 250$ mm, wysokość robocza $150$ mm.
* **Masa Całkowita:** **~585 g**
    * *Uzasadnienie:* Zwiększona masa jest cechą funkcjonalną – zapewnia stabilność statywu na wietrze/przeciągach oraz dużą pojemność cieplną (wolniejsze nagrzewanie).
* **Zasilanie:** Pakiet 12,000 mAh (LiFePO4).
* **Czas Pracy:**
    * **Tryb Ciągły (Router Mesh):** >7 dni (168h).
    * **Tryb Czuwania:** >2 lata.
* **Ładowanie:** USB-C PD (30W) – pełne naładowanie w <2.5h.
* **Odporność:** IP67, upadek z 2m (złożony).
* **Temperatura pracy:** -20°C do +75°C (chwilowa wytrzymałość do +200°C dzięki izolacji aerożelowej).

---

## 4. System Montażu Hybrydowego ("Spider")

Urządzenie wyposażono w unikalny, dwufunkcyjny system montażu dostosowany do chaosu panującego na miejscu akcji:

1.  **Tryb Magnetyczny (Framuga/Konstrukcja):**
    W podstawie urządzenia wbudowany jest magnes neodymowy klasy **N52** o udźwigu 15 kg. Pozwala to na błyskawiczne "przyklejenie" beacona do metalowych futryn drzwi, barierek schodowych czy konstrukcji hal, zapewniając optymalną wysokość dla propagacji fal radiowych.

2.  **Tryb Statywu (Gruzowisko/Podłoga):**
    W przypadku braku elementów metalowych, strażak rozkłada trzy zintegrowane nóżki (system "Spider"). Nóżki wykonane są z elastycznego kompozytu i zakończone gumą antypoślizgową. Pozwala to na stabilne ustawienie beacona na nierównym gruzie, schodach czy mokrej posadzce.

---

## 5. Analiza Energetyczna (Beacon)

Ze względu na rolę routera sieci Mesh, Beacon nie usypia radia LoRa – nasłuchuje ciągle (Rx Continuous), co generuje stały pobór prądu, nieakceptowalny w małych tagach, ale możliwy tutaj dzięki dużej baterii.

| Komponent | Tryb Pracy | Pobór (mA) |
| :--- | :--- | :--- |
| **LoRa (SX1262)** | RX Continuous (Ciągły nasłuch) | 5.0 mA |
| **LoRa (SX1262)** | TX @ 22dBm (Repeater) | 120.0 mA (Duty Cycle 10%) |
| **UWB (DWM3000)** | Anchor Mode (Response) | 15.0 mA (średnio) |
| **GPS (NEO-M9N)** | Tracking (1Hz) | 25.0 mA |
| **MCU + LED** | Active | 6.0 mA |
| **ŚREDNI POBÓR** | **(Weighted Avg)** | **~65 mA** |

**Obliczenie Czasu Pracy:**
$$T = \frac{12000\ mAh \times 0.9 (efficiency)}{65\ mA} \approx 166\ godzin \approx \mathbf{7\ dni}$$

---

# 6. Uzasadnienie Kluczowych Decyzji Projektowych

Poniższe wybory technologiczne wynikają z analizy specyficznych zagrożeń w środowisku pożarowym (IDLH - *Immediately Dangerous to Life or Health*) oraz wymagań symulatora.

### 6.1. Architektura Obliczeniowa i Zasilanie
* **Dlaczego Nordic nPM1300 zamiast LDO?**
  Standardowe stabilizatory napięcia są tanie, ale nie oferują diagnostyki. Wybór PMIC **nPM1300** zapewnia sprzętowy **Watchdog** oraz **Hard Reset**, który automatycznie restartuje zasilanie w przypadku zawieszenia się procesora – funkcja krytyczna, gdy ratownik nie może zresetować urządzenia ręcznie. Dodatkowo, zintegrowany **Fuel Gauge** pozwala na precyzyjne określenie czasu pracy ("Time-to-Empty") dla baterii o płaskiej charakterystyce rozładowania.

* **Dlaczego Bateria LiFePO4?**
  Priorytetem jest bezpieczeństwo termiczne. Ogniwa Li-Ion przy temperaturze >150°C ulegają gwałtownemu zapłonowi (Thermal Runaway). Chemia **LiFePO4** (EVE IFR18650) jest iskrobezpieczna, nie wydziela tlenu przy rozkładzie i wytrzymuje penetrację mechaniczną, co jest kluczowe dla urządzenia noszonego pod kurtką bojową.

### 6.2. Komunikacja i Lokalizacja
* **Dlaczego Quectel BG77?**
  Jest to najmniejszy na świecie moduł LTE Cat M1/NB2 (14.9×12.9 mm), co pozwoliło na redukcję rozmiaru PCB i zastosowanie większych anten dla UWB/LoRa. Rekordowo niski pobór prądu w trybie uśpienia (PSM: 3.2 µA) idealnie wpisuje się w rolę zapasowego kanału łączności (Fallback).

* **Dlaczego TCXO w module LoRa (SX1262)?**
  W warunkach pożaru występują gwałtowne skoki temperatur. Zwykłe kwarce "pływają" częstotliwościowo, co zrywa łączność wąskopasmową. Wersja z kompensacją temperaturową (TCXO) gwarantuje stabilność łącza.

### 6.3. Sensoryka
* **Dlaczego SGP41 (VOC) zamiast czujnika O2?**
  Zgodnie z wymaganiami symulacji i ograniczeniami fizycznymi (rozmiar sensorów tlenu), zastosowano sensor LZO (VOC) jako wskaźnik pośredni (**Proxy**). Nagły wzrost stężenia lotnych związków organicznych i NOx w pożarze silnie koreluje ze spadkiem tlenu, umożliwiając detekcję zagrożenia bez stosowania dużych i nietrwałych ogniw galwanicznych O2.

* **Dlaczego sensor drukowany (SPEC)?**
  Zastąpienie cylindrycznego sensora TGS5042 płaskim sensorem drukowanym (Screen Printed Electrochemistry) pozwoliło zredukować grubość urządzenia z 25mm do 18mm (w sekcji sensorów), znacznie poprawiając ergonomię pracy strażaka.

---

# 7. Aspekty Praktyczne i Wdrożeniowe

### 7.1. Montaż i Ergonomia
* **Umiejscowienie:** Urządzenie montowane jest na lewym pasie naramiennym uprzęży aparatu oddechowego (SCBA) lub systemie PALS/MOLLE kurtki. Jest to optymalna pozycja dla anten GNSS/LoRa oraz dla słyszalności buzzera alarmowego.
* **Obsługa w rękawicach:** Przycisk SOS posiada wyczuwalny pod palcem "klik" (siła aktywacji 5N) oraz fizyczną ramkę ochronną, zapobiegającą przypadkowemu wciśnięciu podczas czołgania się.
* **Sygnalizacja:** Oprócz diody LED i buzzera, zastosowano silnik wibracyjny **LRA** (Linear Resonant Actuator), który generuje ostry impuls haptyczny, wyczuwalny przez grubą odzież ochronną, co jest kluczowe w hałasie akcji gaśniczej (>90dB).

### 7.2. Ładowanie i Serwis
* **Port ładowania:** Uszczelnione gniazdo USB-C (klasa IP67 internal sealing) niewymagające zatyczki do zachowania wodoszczelności.
* **Stacja dokująca:** Projekt przewiduje zbiorcze ładowarki w wozach bojowych ("Gang Charger"), zasilane z instalacji pojazdu 24V, co gwarantuje gotowość sprzętu przy dojeździe na miejsce.
* **Wymiana baterii:** Ogniwo LiFePO4 zapewnia >2000 cykli (ok. 6 lat pracy), co eliminuje konieczność obsługi baterii przez użytkownika. Wymiana przewidziana tylko w autoryzowanym serwisie.

### 7.3. Certyfikacje (Compliance Roadmap)
Urządzenie projektowane jest zgodnie z wymogami dla sprzętu ratowniczego:
* **ATEX (Strefa 2):** Konstrukcja "iskrobezpieczna" (Ex ib) – ograniczenie pojemności kondensatorów i indukcyjności, zalewanie lakierem konforemnym.
* **IP67:** Pełna pyłoszczelność i odporność na zanurzenie (1m wody).
* **MIL-STD-810G:** Odporność na upadek z 1.5m na beton (zapewniona przez obudowę PC/PBT i wewnętrzną strukturę "żeberkową").
* **RED/ETSI:** Zgodność radiowa dla pasm 868 MHz, 2.4 GHz i UWB 6.5 GHz.

### 7.4. Kosztorys i Produkcja
* **Dostępność:** Wszystkie kluczowe komponenty (Nordic, Quectel, Semtech) posiadają status "Active" w łańcuchu dostaw.
* **Technologia:** PCB 4-warstwowe FR4, standardowy proces montażu SMT.
* **Szacunkowy koszt jednostkowy (BOM):** ~$102 USD przy wolumenie 1000 szt.

---

# 8. Ryzyka i Ograniczenia (Risk Analysis)

Szczera analiza potencjalnych punktów awarii i zastosowane środki zaradcze.

| Ryzyko / Ograniczenie     | Opis Problemu                                                                                                    | Środek Zaradczy (Mitigation)                                                                                                                           |
| :------------------------ | :--------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Koegzystencja Radiowa** | Bliskość anten LTE (B20/800MHz) i LoRa (868MHz) może powodować wzajemne zagłuszanie (desensytyzację).            | Programowy **TDM** (Time Division Multiplexing) – LoRa nie nasłuchuje, gdy LTE nadaje. Filtr SAW na wejściu GNSS.                                      |
| **Odbicia sygnału UWB**   | W budynkach o konstrukcji stalowej (hale) sygnał UWB ulega wielokrotnym odbiciom (Multipath), fałszując dystans. | Algorytm **Fuzji Sensorów** (Sensor Fusion): Jeśli UWB pokazuje skok pozycji, a IMU (akcelerometr) nie wykrywa ruchu, system odrzuca pomiar UWB.       |
| **Limit Termiczny**       | Mimo izolacji aerożelowej, długotrwałe przebywanie w temp. >150°C doprowadzi do wyłączenia elektroniki.          | System monitoruje temp. wewnętrzną i przy T > 70°C wysyła priorytetowy alert "High Temp / Retreat" do dowódcy, nakazując wycofanie strażaka.           |
| **Brak pokrycia GSM**     | W piwnicach i garażach podziemnych zasięg LTE-M może być zerowy.                                                 | Automatyczny fallback na sieć **LoRa Mesh** (przekazywanie danych przez Beacony lub innych strażaków) oraz zapis danych do "Czarnej Skrzynki" (Flash). |
| **Zabrudzenie sensora**   | Dym i sadza mogą zatkać membranę sensora gazu.                                                                   | Zastosowanie łatwo wymienialnej zewnętrznej nakładki ochronnej ("Sacrificial Layer") nad membraną ePTFE.                                               |
## 9. Scenariusze pracy: Środowisko izolowane (GPS Denied)
W warunkach ekstremalnych (głębokie podziemia, tunele metra, bunkry) sygnał GNSS może być niedostępny dla żadnego z urządzeń. System działa wtedy w trybie Fully Relative Positioning.

9.1. Scenariusz A: Częściowy brak sygnału (Typical)

Sytuacja: Wejście do budynku.
Działanie: Pierwszy Beacon ("Bramofon") ma jeszcze sygnał GPS. Ustala on pozycję (Lat, Lon) i staje się węzłem referencyjnym (0,0,0) dla całej siatki wewnątrz. Wszystkie pozycje strażaków są przeliczane na koordynaty geograficzne.

9.2. Scenariusz B: Całkowity brak sygnału (Total Blackout)
Sytuacja: Start akcji w tunelu metra, kopalni lub w warunkach zagłuszania (Jamming).

Problem: Nawet pierwszy Beacon nie ma fixa GPS.

Rozwiązanie - Tryb "Relative Grid":

Pierwszy aktywowany Beacon ("Master Anchor") automatycznie przyjmuje arbitralną pozycję (0,0,0).
Wykorzystuje wbudowany kompas magnetometryczny (IMU), aby ustalić orientację Północy.
Kolejne Beacony rozstawiane w głąb tunelu mierzą dystans do Mastera (UWB TWR) i tworzą lokalną mapę wektorową.

Wizualizacja: Na tablecie dowódcy strażacy nie są widoczni na mapie świata (Google Maps), lecz na "czystej kartce" (siatce metrycznej) lub nałożeni na wgrany wcześniej plan budynku (rzut kondygnacji).
Manualne Kotwiczenie: Dowódca może ręcznie "przypiąć" na tablecie pozycję Master Beacona do konkretnego punktu na planie (np. "Wejście A"), co automatycznie kalibruje pozycje wszystkich pozostałych jednostek.

9.3. Łańcuch Danych (Daisy-Chain Mesh)
W długich tunelach bezpośrednia łączność LoRa z wozem jest niemożliwa. Beacony tworzą liniowy łańcuch przekaźnikowy: [Tag Strażaka] -> [Beacon 3] -> [Beacon 2] -> [Beacon 1] -> [Bramka NIB] . Każdy Beacon posiada bufor pamięci, co zapobiega utracie pakietów przy chwilowym zerwaniu łańcucha.