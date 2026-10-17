
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="SignalForge Central Locator")

# Development CORS: restrict origins before public deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Default anchor configuration.
# Coordinates are examples; replace with your measured layout.
anchors = {
    "A": {
        "anchor_id": "A",
        "name": "Anchor A",
        "x": 0.0,
        "y": 0.0,
        "rssi_at_1m": -70.0,
    },
    "B": {
        "anchor_id": "B",
        "name": "Anchor B",
        "x": 6.0,
        "y": 0.0,
        "rssi_at_1m": -70.0,
    },
    "C": {
        "anchor_id": "C",
        "name": "Anchor C",
        "x": 0.0,
        "y": 4.0,
        "rssi_at_1m": -70.0,
    },
}

# Latest reading per anchor, held in memory.
latest = {}

PATH_LOSS_EXPONENT = 2.0
OFFLINE_AFTER_SECONDS = 10


class Reading(BaseModel):
    anchor_id: str
    device_id: str
    rssi: int
    timestamp: str


class AnchorConfig(BaseModel):
    anchor_id: str
    name: str
    x: float = 0.0
    y: float = 0.0
    rssi_at_1m: float = -70.0


@app.get("/")
def home():
    return {
        "status": "SignalForge central server running"
    }


@app.post("/reading")
def receive_reading(reading: Reading):
    if reading.anchor_id not in anchors:
        raise HTTPException(
            status_code=400,
            detail=f"Anchor {reading.anchor_id} is not configured",
        )

    latest[reading.anchor_id] = {
        **reading.model_dump(),
        "received_at": datetime.now(timezone.utc).isoformat(),
    }

    print(
        f"Anchor {reading.anchor_id} | "
        f"RSSI {reading.rssi} dBm"
    )

    return {"ok": True}


@app.get("/readings")
def get_readings():
    return latest


@app.get("/anchors")
def get_anchors():
    now = datetime.now(timezone.utc)
    results = []

    for anchor_id, config in anchors.items():
        reading = latest.get(anchor_id)
        age_seconds = None

        if reading:
            received_at = datetime.fromisoformat(
                reading["received_at"]
            )
            age_seconds = (
                now - received_at
            ).total_seconds()

        online = (
            age_seconds is not None
            and age_seconds <= OFFLINE_AFTER_SECONDS
        )

        results.append({
            **config,
            "status": (
                "Online" if online
                else "Offline" if reading
                else "Waiting for data"
            ),
            "last_seen": (
                reading["received_at"] if reading else None
            ),
            "rssi_dbm": (
                reading["rssi"] if online else None
            ),
        })

    return results


@app.post("/anchors")
def add_anchor(config: AnchorConfig):
    anchor_id = config.anchor_id.strip()

    if not anchor_id:
        raise HTTPException(
            status_code=400,
            detail="Anchor ID cannot be empty",
        )

    if anchor_id in anchors:
        raise HTTPException(
            status_code=409,
            detail="Anchor ID already exists",
        )

    anchors[anchor_id] = {
        **config.model_dump(),
        "anchor_id": anchor_id,
    }

    return anchors[anchor_id]


@app.put("/anchors/{anchor_id}")
def update_anchor(anchor_id: str, config: AnchorConfig):
    if anchor_id not in anchors:
        raise HTTPException(
            status_code=404,
            detail="Anchor not found",
        )

    if config.anchor_id != anchor_id:
        raise HTTPException(
            status_code=400,
            detail="Anchor ID cannot be changed in this request",
        )

    anchors[anchor_id] = config.model_dump()
    return anchors[anchor_id]


@app.delete("/anchors/{anchor_id}")
def delete_anchor(anchor_id: str):
    if anchor_id not in anchors:
        raise HTTPException(
            status_code=404,
            detail="Anchor not found",
        )

    del anchors[anchor_id]
    latest.pop(anchor_id, None)

    return {
        "ok": True,
        "deleted": anchor_id,
    }


@app.get("/distances")
def get_distances():
    results = {}
    now = datetime.now(timezone.utc)

    for anchor_id, config in anchors.items():
        reading = latest.get(anchor_id)

        if reading is None:
            results[anchor_id] = {
                "status": "no reading"
            }
            continue

        received_at = datetime.fromisoformat(
            reading["received_at"]
        )
        age_seconds = (
            now - received_at
        ).total_seconds()

        if age_seconds > OFFLINE_AFTER_SECONDS:
            results[anchor_id] = {
                "status": "offline",
                "last_rssi_dbm": reading["rssi"],
                "age_seconds": round(age_seconds, 1),
            }
            continue

        reference_rssi = config["rssi_at_1m"]
        rssi = reading["rssi"]

        distance = 10 ** (
            (reference_rssi - rssi)
            / (10 * PATH_LOSS_EXPONENT)
        )

        results[anchor_id] = {
            "rssi_dbm": rssi,
            "estimated_distance_m": round(distance, 2),
            "status": "estimated",
            "age_seconds": round(age_seconds, 1),
        }

    return results
