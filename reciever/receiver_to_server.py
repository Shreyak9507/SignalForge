
import asyncio
from datetime import datetime

import httpx
from bleak import BleakScanner

# CHANGE THESE TWO SETTINGS ON EACH LAPTOP
ANCHOR_ID = "A"
SERVER_URL = "http://127.0.0.1:8000/reading"

TARGET_NAME = "SignalForge"

queue = asyncio.Queue()


def detection_callback(device, advertisement_data):
    name = advertisement_data.local_name or device.name or ""

    if name.strip().lower() != TARGET_NAME.lower():
        return

    reading = {
        "anchor_id": ANCHOR_ID,
        "device_id": device.address,
        "rssi": advertisement_data.rssi,
        "timestamp": datetime.now().astimezone().isoformat(),
    }

    try:
        queue.put_nowait(reading)
    except asyncio.QueueFull:
        pass


async def send_readings():
    async with httpx.AsyncClient(timeout=2.0) as client:
        while True:
            reading = await queue.get()

            try:
                response = await client.post(
                    SERVER_URL,
                    json=reading
                )
                response.raise_for_status()

                print(
                    f"Sent | Anchor {ANCHOR_ID} | "
                    f"RSSI {reading['rssi']} dBm | "
                    f"Server: OK"
                )

            except httpx.HTTPError as error:
                print(f"Server error: {error}")

            finally:
                queue.task_done()


async def main():
    print(f"Starting SignalForge receiver: Anchor {ANCHOR_ID}")
    print(f"Sending readings to: {SERVER_URL}")
    print("Waiting for phone advertisement... Ctrl+C to stop")

    sender_task = asyncio.create_task(send_readings())

    try:
        async with BleakScanner(
            detection_callback=detection_callback
        ):
            await asyncio.Event().wait()
    finally:
        sender_task.cancel()
        await asyncio.gather(sender_task, return_exceptions=True)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nReceiver stopped.")
