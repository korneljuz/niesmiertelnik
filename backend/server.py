import asyncio
import json
import ssl
import websockets
import socketio
from fastapi import FastAPI
from datetime import datetime, timedelta
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import math

DATABASE_URL = "sqlite:///./alerts.db"
Base = declarative_base()
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class AlertDB(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    firefighter_id = Column(String, index=True)
    firefighter_name = Column(String)
    type = Column(String)
    floor = Column(Integer, default=0)
    timestamp = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

Base.metadata.create_all(bind=engine)

API_URL = "wss://niesmiertelnik.replit.app/ws"

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=["http://localhost:5173"])
app = FastAPI()
app.mount("/", socketio.ASGIApp(sio))


movement_tracker = {}

def calculate_distance(p1, p2):
    """Oblicza dystans euklidesowy między dwoma punktami 2D"""
    return math.sqrt((p1['x'] - p2['x'])**2 + (p1['y'] - p2['y'])**2)

async def process_telemetry(data):
    ff = data.get("firefighter", {})
    ff_id = ff.get("id")
    ff_name = ff.get("name")
    
    position = data.get("position", {})
    current_x = position.get("x", 0)
    current_y = position.get("y", 0)
    floor = position.get("floor", 0)
    
    device = data.get("device", {})
    scba = data.get("scba", {})
    vitals = data.get("vitals", {})

    alerts_to_send = []
    now = datetime.now()

    if ff_id not in movement_tracker:
        movement_tracker[ff_id] = {
            "last_move_time": now,
            "last_pos": {"x": current_x, "y": current_y}
        }
    else:
        tracker = movement_tracker[ff_id]
        last_pos = tracker["last_pos"]
        
        dist = calculate_distance({"x": current_x, "y": current_y}, last_pos)

        if dist > 1.0:
            tracker["last_move_time"] = now
            tracker["last_pos"] = {"x": current_x, "y": current_y}
        else:
            time_diff = (now - tracker["last_move_time"]).total_seconds()
            
            if time_diff > 30:
                alert = check_and_save_alert(ff_id, ff_name, "NO_MOVEMENT", floor)
                if alert: 
                    alerts_to_send.append(alert)
                    
    if device.get("sos_button_pressed"):
        alert = check_and_save_alert(ff_id, ff_name, "SOS", floor)
        if alert: alerts_to_send.append(alert)

    if vitals.get("stress_level") == "critical":
        alert = check_and_save_alert(ff_id, ff_name, "CRITICAL_VITALS", floor)
        if alert: alerts_to_send.append(alert)

    alarms = scba.get("alarms", {})
    if alarms.get("very_low_pressure"):
         alert = check_and_save_alert(ff_id, ff_name, "LOW_AIR", floor)
         if alert: alerts_to_send.append(alert)

    for alert in alerts_to_send:
        print(f"🚨 [ALERT] {alert['type']} (P:{alert['floor']}) - {alert['firefighter_name']}")
        await sio.emit("new_alert", alert)

def check_and_save_alert(ff_id, ff_name, alert_type, floor):
    db = SessionLocal()
    try:
        cutoff_time = datetime.now() - timedelta(minutes=3)
        
        existing_alert = db.query(AlertDB).filter(
            AlertDB.firefighter_id == ff_id,
            AlertDB.type == alert_type,
            AlertDB.timestamp > cutoff_time 
        ).first()

        if existing_alert:
            return None 

        new_alert = AlertDB(
            firefighter_id=ff_id, 
            firefighter_name=ff_name, 
            type=alert_type,
            floor=floor,
            timestamp=datetime.utcnow()
        )
        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)
        
        return {
            "id": new_alert.id,
            "firefighter_id": ff_id,
            "firefighter_name": ff_name,
            "type": alert_type,
            "floor": floor,
            "timestamp": new_alert.timestamp.isoformat() + "Z"
        }
    finally:
        db.close()

async def process_telemetry(data):
    ff = data.get("firefighter", {})
    ff_id = ff.get("id")
    ff_name = ff.get("name")
    
    position = data.get("position", {})
    floor = position.get("floor", 0)
    
    device = data.get("device", {})
    scba = data.get("scba", {})
    vitals = data.get("vitals", {})

    alerts_to_send = []

    if device.get("sos_button_pressed"):
        alert = check_and_save_alert(ff_id, ff_name, "SOS", floor)
        if alert: alerts_to_send.append(alert)

    if vitals.get("stress_level") == "critical":
        alert = check_and_save_alert(ff_id, ff_name, "CRITICAL_VITALS", floor)
        if alert: alerts_to_send.append(alert)

    alarms = scba.get("alarms", {})
    if alarms.get("very_low_pressure"):
         alert = check_and_save_alert(ff_id, ff_name, "LOW_AIR", floor)
         if alert: alerts_to_send.append(alert)

    for alert in alerts_to_send:
        print(f"🚨 [ALERT] {alert['type']} (P:{alert['floor']}) - {alert['firefighter_name']}")
        await sio.emit("new_alert", alert)


async def forward_api_data():
    ssl_ctx = ssl._create_unverified_context()
    while True:
        try:
            print("🛰️  Łączenie z API...")
            async with websockets.connect(API_URL, ssl=ssl_ctx) as ws:
                print("✅ Połączono")
                async for message in ws:
                    try:
                        data = json.loads(message)
                        msg_type = data.get("type")

                        if msg_type == "tag_telemetry":
                            await sio.emit("telemetry", data)
                            await process_telemetry(data)
                        
                        elif msg_type == "beacons_status":
                            await sio.emit("beacons_data", data)

                    except json.JSONDecodeError:
                        pass
        except Exception as e:
            print(f"⚠️ Błąd: {e}. Retry za 5s...")
            await asyncio.sleep(5)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(forward_api_data())
    print("🚀 Serwer działa z bazą danych alertów.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)