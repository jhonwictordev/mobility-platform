$ErrorActionPreference = "Stop"

$env:JAVA_HOME = "C:\Users\winc\jdk-17"
$env:PATH = "C:\Users\winc\jdk-17\bin;C:\Users\winc\android-sdk\build-tools\34.0.0;C:\Users\winc\android-sdk\platform-tools;$env:PATH"

$androidJar = "C:\Users\winc\android-sdk\platforms\android-34\android.jar"
$buildTools = "C:\Users\winc\android-sdk\build-tools\34.0.0"
$jdk = "C:\Users\winc\jdk-17\bin"
$keystore = "C:\Users\winc\android-build\simbora-debug.keystore"
$outDir = "C:\Users\winc\.gemini\antigravity\scratch\mobility-platform\SIMBORA_ANDROID_TEST"

New-Item -ItemType Directory -Path "$outDir" -Force | Out-Null

function Build-Simbora-Apk {
    param (
        [string]$AppName,
        [string]$AppDir,
        [string]$FinalApkName
    )

    Write-Host "=========================================="
    Write-Host "BUILDING $AppName APK..."
    Write-Host "=========================================="

    # 1. Compile Resources
    Write-Host "[1/7] Compiling Android resources with AAPT2..."
    & "$buildTools\aapt2.exe" compile --dir "$AppDir\res" -o "$AppDir\compiled_res.zip"

    # 2. Link Resources & Generate R.java
    Write-Host "[2/7] Linking resources & bundling assets with AAPT2..."
    & "$buildTools\aapt2.exe" link -o "$AppDir\base.apk" `
        -I "$androidJar" `
        --manifest "$AppDir\AndroidManifest.xml" `
        --java "$AppDir\gen" `
        -A "$AppDir\assets" `
        "$AppDir\compiled_res.zip" `
        --auto-add-overlay

    # 3. Compile Java Source Code
    Write-Host "[3/7] Compiling Java code with javac..."
    $javaFiles = Get-ChildItem -Path "$AppDir\gen", "$AppDir\src" -Recurse -Filter "*.java" | ForEach-Object { $_.FullName }
    & "$jdk\javac.exe" -cp "$androidJar" -d "$AppDir\bin" $javaFiles

    # 4. Dex bytecode to Dalvik executable
    Write-Host "[4/7] Converting bytecode to classes.dex with D8..."
    $classFiles = Get-ChildItem -Path "$AppDir\bin" -Recurse -Filter "*.class" | ForEach-Object { $_.FullName }
    New-Item -ItemType Directory -Path "$AppDir\dex_out" -Force | Out-Null
    & "$buildTools\d8.bat" --lib "$androidJar" --output "$AppDir\dex_out" $classFiles

    # 5. Add classes.dex into base.apk
    Write-Host "[5/7] Inserting classes.dex into APK..."
    $origDir = Get-Location
    Set-Location "$AppDir\dex_out"
    & "$jdk\jar.exe" -uf "$AppDir\base.apk" "classes.dex"
    Set-Location $origDir

    # 6. Zipalign APK (4-byte alignment)
    Write-Host "[6/7] Aligning APK with zipalign..."
    & "$buildTools\zipalign.exe" -f -p 4 "$AppDir\base.apk" "$AppDir\aligned.apk"

    # 7. Sign APK with apksigner (v2 + v3 scheme)
    Write-Host "[7/7] Signing APK with apksigner..."
    $finalPath = Join-Path "$outDir" "$FinalApkName"
    & "$buildTools\apksigner.bat" sign `
        --ks "$keystore" `
        --ks-pass pass:android `
        --key-pass pass:android `
        --out "$finalPath" `
        "$AppDir\aligned.apk"

    # Verify APK signature
    Write-Host "Verifying signature for $FinalApkName..."
    & "$buildTools\apksigner.bat" verify -v "$finalPath"

    $fileItem = Get-Item "$finalPath"
    Write-Host "SUCCESS! Generated: $FinalApkName (Size: $($fileItem.Length) bytes)" -ForegroundColor Green
}

# Build Passenger APK
Build-Simbora-Apk -AppName "SIMBORA Passageiro" `
    -AppDir "C:\Users\winc\.gemini\antigravity\scratch\mobility-platform\android-build\passenger" `
    -FinalApkName "SIMBORA-PASSAGEIRO-TEST.apk"

# Build Driver APK
Build-Simbora-Apk -AppName "SIMBORA Motorista" `
    -AppDir "C:\Users\winc\.gemini\antigravity\scratch\mobility-platform\android-build\driver" `
    -FinalApkName "SIMBORA-MOTORISTA-TEST.apk"

Write-Host "All APKs built successfully!"
