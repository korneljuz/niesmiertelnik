## 1.Schemat blokowy

#### Bramka NIB (Network-in-the-Box) to mobilne centrum komunikacyjno-obliczeniowe klasy przemysłowej. Pełni rolę serwera krawędziowego (Edge Computing), zbierając dane od ratowników i udostępniając lokalną sieć dowodzenia (WiFi Hotspot) na miejscu akcji.
![schemat blokowy bramki NIB](bramka_nib_schemat.png)
---
### 2. Lista Materiałowa (BOM) – NIB v4.6

| Grupa | Funkcja | Model (Part Number) | Producent | Cena (est.) | Specyfikacja / Uzasadnienie |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CPU** | Rdzeń Obliczeniowy | **Raspberry Pi CM4 (8GB/32GB eMMC)** | Raspberry Pi | $85 | Moduł z wbudowaną pamięcią eMMC (odporny na wstrząsy). Niskie zużycie mocy (~8W). |
| **MB** | Płyta Nośna | **CM4 Industrial Carrier** | Waveshare/Seeed | $120 | Przemysłowa płyta z gniazdami M.2 (dla dysku i modemu) i złączami Automotive. |
| **PWR** | Bateria UPS | **LiFePO4 12.8V 12Ah** | Green Cell/Victron | $90 | Pakiet 4S. 153Wh. **Gwarantuje 5h+** autonomii pracy systemu. |
| **PWR** | Ładowarka/Logic | **OpenUPS2 / BQ25792 Logic** | Mini-Box / TI | $90 | Kontroler UPS, zarządzający ładowaniem LiFePO4 i bezpiecznym wyłączeniem CM4. |
| **PWR** | Stabilizator DC | **Mean Well DDR-60G-12** | Mean Well | $45 | Przetwornica z izolacją galwaniczną (9-36V input). Chroni Jetsona przed skokami napięcia w instalacji pojazdu. |
| **RF** | LoRa Gateway | **RAK5146 (SX1302)** | RAK Wireless | $120 | Profesjonalny koncentrator 8-kanałowy. Obsługa setek Tagów jednocześnie. |
| **RF** | Modem 5G/LTE | **Quectel RM520N-GL** | Quectel | $250 | Szybki backhaul do chmury / Wide Area Network. |
| **RF** | WiFi 6 Hotspot | **Intel AX210** | Intel | $35 | Moduł M.2 E-Key. Lokalny, szybki hotspot dla tabletu dowódcy. |
| **MEM** | Dysk NVMe | **512GB Industrial** | Samsung/Kioxia | $50 | Optymalizacja: Wystarczający na logi i mapy. Odporny na wstrząsy (brak ruchomych części). |
| **ANT** | Antena Dachowa | **LGMQM-7-27-24-58** | Panorama Antennas | $180 | **"Shark Fin" 5-w-1.** Montaż na dachu wozu. Łączy LTE, WiFi i GNSS. |
| **ANT** | Antena LoRa | **External Whip 8dBi** | Taoglas/Pulse | $45 | Niezależna, wysokozyskowa antena LoRa (przebijanie się przez stropy). |
| **UI** | Wyświetlacz Statusu | **TFT LCD 3.5\" SPI** | - | $25 | **Krytyczny element UI.** Wyświetla status baterii, siłę sygnału i adres IP hotspotu. |
| **MECH**| Obudowa | **Akasa / PPA+GF** | Custom/Akasa | $80 | Obudowa PPA z finami radiatora (fanless/pasywne chłodzenie). |
| **SUMA** | | | | **~$1140 USD** | *(Kompletny koszt bramki z baterią i antenami)* |

---

### 3. Specyfikacja Techniczna i Wymagania Środowiskowe

| Parametr | Wartość | Uzasadnienie |
| :--- | :--- | :--- |
| **Wymiary (Złożony)** | $130 \times 85 \times 60$ mm | Kompaktowy rozmiar, montaż w szafie RACK lub na pulpicie. |
| **Masa Całkowita** | **~1.6 kg** | Wynik zastosowania baterii 12Ah LiFePO4 i aluminiowej obudowy (radiatora). |
| **Zasilanie Wejściowe** | 9V - 36V DC | **Automotive Grade.** Szeroki zakres akceptowanego napięcia (12V/24V wóz strażacki). |
| **Autonomia UPS** | **>5 godzin** (realnie 7h+) | Gwarantowane podtrzymanie pracy przy pełnym obciążeniu. |
| **System Chłodzenia** | Pasywny (Fanless) | Brak wentylatorów – odporność na dym, kurz i awarie mechaniczne w środowisku akcji. |
| **LoRa Gateway** | 8 kanałów (SX1302) | Zdolność do jednoczesnej obsługi kilkudziesięciu Tagów i Beaconów w sieci Mesh. |
| **Pamięć Masowa** | 512GB NVMe SSD | Szybki zapis i odczyt danych. Przechowywanie map offline i logów telemetrycznych. |
| **Stopień Ochrony** | IP54 / IK08 (Obudowa) | Odporność na pył i zachlapania (montaż w kabinie) oraz udary mechaniczne (antena dachowa jest IP67). |

---
## 4. Uzasadnienie Wyborów Komponentów (Rationale)

| Grupa   | Komponent / Model               | Dlaczego ten, a nie inny?                                                                                                                                                                            |
| :------ | :------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CPU** | **Raspberry Pi CM4 (8GB eMMC)** | Raspberry Pi jest lepsze od Jetsona w tym wypadku ze względu na niższy pobór mocy (~8W vs 15-20W) i mniejsze obciążenie cieplne. Wbudowane **eMMC** jest odporne na wibracje (brak awarii karty SD). |
| **PWR** | **LiFePO4 12Ah**                | **Autonomia.** Przewymiarowana bateria, która gwarantuje ponad 7 godzin pracy w trybie pełnej gotowości. Bezpieczna chemia (brak ryzyka Thermal Runaway).                                            |
| **PWR** | **Stabilizator (9-36V)**        | **Automotive Grade.** Izoluje CM4 i UPS od "brudnej" instalacji elektrycznej wozu (skoki napięcia przy rozruchu), zapewniając stabilne 12V.                                                          |
| **RF**  | **LoRaWAN Conc. RAK5146**       | Profesjonalny koncentrator (8-kanałowy, SX1302) niezbędny do **jednoczesnego** odbioru pakietów od wszystkich strażaków w sieci Mesh.                                                                |
| **RF**  | **Anteny Dachowe**              | **Niezawodność RF.** Antena typu "Shark Fin" (LTE/WiFi/GNSS) + LoRa Whip (8dBi) są jedynym sposobem na osiągnięcie wymaganego zasięgu w warunkach "Klatki Faradaya" (metalowy wóz).                  |
| **MEM** | **SSD NVMe 512GB**              | **Optymalna pojemność.** Wystarczający na logi i mapy offline. Wyeliminowanie podatnych na uszkodzenia nośników SATA.                                                                                |
| **UI**  | **TFT LCD 3.5\"**               | **Ergonomia.** Wyświetla krytyczny status (Bateria/LTE/IP) bezpośrednio na obudowie, redukując potrzebę użycia tabletu do diagnostyki.                                                               |

---

## 5. Analiza Energetyczna i Czas Pracy (5h+)

Obliczenia dla scenariusza "Aktywna Służba" (ciągły nasłuch LoRa, aktywny Hotspot WiFi, logowanie danych na SSD).

| Komponent | Tryb Pracy | Moc (W) | Pobór (A) @ 12V |
| :--- | :--- | :--- | :--- |
| **CM4 (8GB)** | Active/Routing | 8.0 W | 0.67 A |
| **LoRa Conc. RAK5146** | RX Continuous | 2.5 W | 0.21 A |
| **Modem 5G (Avg)** | Tracking + Comm | 5.0 W | 0.42 A |
| **SSD NVMe + Misc** | Logowanie + Cooling | 2.5 W | 0.21 A |
| **STRATY PM/DC** | Konwersja (10%) | 2.0 W | 0.17 A |
| **SUMA (Obciążenie Średnie)** | | **20.0 W** | **1.68 A** |

**Bateria:** LiFePO4 12.8V / 12Ah. **Energia całkowita:** $12.8 V \times 12 Ah = 153.6\ Wh$.

$$
Czas\ Pracy\ (T) = \frac{Energia\ Baterii\ (Wh)}{Moc\ Całkowita\ (W)} = \frac{153.6\ Wh}{20.0\ W} \approx \mathbf{7.68\ godziny}
$$

* **Werdykt:** Gwarantowany czas pracy w pełnej gotowości wynosi **ponad 7 godzin**, co z nawiązką pokrywa wymóg 5 godzin autonomii.

---

## 6. Aspekty Praktyczne i Wdrożeniowe

* **Montaż:** System montażu VESA 100x100mm lub RACK 19" (1U), ułatwiający instalację w standardowych szafach sprzętowych pojazdu.
* **Zasilanie:** Wtyczka M12 lub uszczelniony D-Sub (klasa Automotive) zamiast USB. Wejście akceptuje niestabilne 9-36V DC.
* **Obudowa:** Aluminium lotnicze (pasywne chłodzenie), złącza antenowe SMA/N-Type wyprowadzone na jeden panel (clean panel design).
* **Certyfikacje :**
    * **Automotive:** Zgodność z ISO 7637-2 (testy odporności na zakłócenia w instalacji pojazdu).
    * **IP54/IK08:** Odporność na pył/zachlapania i uderzenia (IK08 dla obudowy).

---

## 7. Ryzyka i Ograniczenia

| Ryzyko / Ograniczenie | Opis Problemu | Środek Zaradczy (Mitigacja) |
| :--- | :--- | :--- |
| **Awaria Dysku/OS** | Wibracje w wozie strażackim uszkadzają system operacyjny (OS). | **CM4 z eMMC + SSD NVMe:** Dysk systemowy (eMMC) jest wlutowany, a dysk danych (SSD) jest przykręcony w gnieździe M.2, co eliminuje ruchome części i wstrząsy. |
| **Tłumienie Sygnału** | Tłumienie kabla koncentrycznego (Cable Loss) na odcinku 5m (zwłaszcza w paśmie 5G). | Zastosowano wysokiej klasy kable LMR-400 (niskostratne) oraz kompensację programową. Modem RM520N charakteryzuje się wysoką mocą wyjściową. |
| **Przegrzanie (Thermal Throttling)** | Wysokie obciążenie CM4 i modem 5G w zamkniętej obudowie bez wentylacji. | Obudowa bramki jest wielkim, pasywnym radiatorem (Fanless Design), co eliminuje konieczność stosowania wentylatorów podatnych na awarie i zanieczyszczenie. |
| **Brak Zasięgu (Backhaul)** | Wóz znajduje się w "białej plamie" GSM/5G. | **Architektura Lokalna:** System przechodzi w tryb autonomiczny. Wszystkie dane są zapisywane lokalnie (512GB SSD) i przesyłane do tabletu dowódcy przez lokalny WiFi 6 Hotspot. |
| **Koszty (TCO)** | Wysoki koszt BOM (~$1140 USD) ze względu na profesjonalne komponenty. | Długi cykl życia LiFePO4 (ponad 2000 cykli) oraz brak części ruchomych (fanless, eMMC) obniżają całkowity koszt posiadania (TCO) w perspektywie 10 lat. |
