
    scanner = BleakScanner(detection_callback=callback)
    await scanner.start()

    try:
        await asyncio.sleep(30)
    finally:
        await scanner.stop()

    print(f"\nUnique devices detected: {len(seen)}")

asyncio.run(main())