const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const buildOut = path.join(rootDir, 'SIMBORA_ANDROID_TEST');
const desktop = 'C:\\Users\\winc\\Desktop\\SIMBORA_APKs';
const downloads = 'C:\\Users\\winc\\Downloads';

if (!fs.existsSync(desktop)) {
  fs.mkdirSync(desktop, { recursive: true });
}

const apks = ['SIMBORA-PASSAGEIRO-TEST.apk', 'SIMBORA-MOTORISTA-TEST.apk'];

apks.forEach(apk => {
  const src = path.join(buildOut, apk);
  const destDesktop = path.join(desktop, apk);
  const destDownloads = path.join(downloads, apk);

  fs.copyFileSync(src, destDesktop);
  fs.copyFileSync(src, destDownloads);

  const stat = fs.statSync(src);
  console.log(`Copied ${apk} (${stat.size} bytes) -> Desktop & Downloads`);
});

// Create zip in all 3 locations
const zipPaths = [
  path.join(desktop, 'SIMBORA_ANDROID_TEST.zip'),
  path.join(downloads, 'SIMBORA_ANDROID_TEST.zip'),
  path.join(buildOut, 'SIMBORA_ANDROID_TEST.zip')
];

zipPaths.forEach(zipPath => {
  try {
    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    execSync(`powershell -Command "Compress-Archive -Path '${path.join(buildOut, '*.apk')}' -DestinationPath '${zipPath}' -Force"`);
    const zipStat = fs.statSync(zipPath);
    console.log(`Created ZIP: ${zipPath} (${zipStat.size} bytes)`);
  } catch (e) {
    console.warn(`Error zipping to ${zipPath}:`, e.message);
  }
});

console.log('>>> ALL APK COPIES AND ZIPS COMPLETED SUCCESSFULLY! <<<');
