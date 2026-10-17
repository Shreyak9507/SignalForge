Add-Type -AssemblyName System.Runtime.WindowsRuntime

$publisherType = [Windows.Devices.Bluetooth.Advertisement.BluetoothLEAdvertisementPublisher, Windows, ContentType=WindowsRuntime]
$advertisementType = [Windows.Devices.Bluetooth.Advertisement.BluetoothLEAdvertisement, Windows, ContentType=WindowsRuntime]
$manufacturerType = [Windows.Devices.Bluetooth.Advertisement.BluetoothLEManufacturerData, Windows, ContentType=WindowsRuntime]
$dataWriterType = [Windows.Storage.Streams.DataWriter, Windows.Storage, ContentType=WindowsRuntime]

$advertisement = $advertisementType::new()
$manufacturer = $manufacturerType::new()

# Reserved test identifier; this is only a local experiment.
$manufacturer.CompanyId = 0xFFFE

$writer = $dataWriterType::new()
[byte[]]$payload = @(0x42, 0x4C, 0x45, 0x31)
$writer.WriteBytes($payload)
$manufacturer.Data = $writer.DetachBuffer()

$advertisement.ManufacturerData.Add($manufacturer)
$publisher = $publisherType::new($advertisement)

Write-Host "Starting BLE advertising..."
$publisher.Start()
Start-Sleep -Seconds 2
Write-Host "Publisher status: $($publisher.Status)"
Write-Host "Press Ctrl+C to stop."

try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    $publisher.Stop()
    Write-Host "Advertising stopped."
}