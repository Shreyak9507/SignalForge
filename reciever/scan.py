import asyncio
from datetime import datetime
from bleak import BleakScanner

TARGET_NAME = "SignalForge"

# Change this on each laptop: A, B, or C
ANCHOR_ID = "A"

def callback(device, adv):
    name = adv.local_name or device.name

    if name and name.strip().lower() == TARGET_NAME.lower():
        timestamp = datetime.now().astimezone().isoformat(
            timespec="milliseconds"
        )

        print(
            f"{timestamp} | Anchor: {ANCHOR_ID} | "
            f"Address: {device.address} | "
            f"RSSI: {adv.rssi} dBm | {name}"
        )

async def main():
    print(f"Anchor {ANCHOR_ID}: scanning for {TARGET_NAME}...")
    print("Keep the phone advertiser enabled. Press Ctrl+C to stop.")

    scanner = BleakScanner(detection_callback=callback)
    await scanner.start()

    try:
        while True:
            await asyncio.sleep(1)
    finally:
        await scanner.stop()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nScanner stopped.")