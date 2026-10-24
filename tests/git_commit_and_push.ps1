Set-Location 'C:\Users\winc\.gemini\antigravity\scratch\mobility-platform'
$git = 'C:\Users\winc\AppData\Local\Programs\mingit\cmd\git.exe'

Write-Host "Criando commit inicial da versão 2.0..."
& $git commit -m "feat: release Mobility Platform 2.0 - Alagoas Intermunicipal Simulation (Piacabucu -> Penedo)"

Write-Host "Criando repositorio no GitHub via GitHub CLI..."
gh repo create mobility-platform --public --source=. --remote=origin --push --description "Plataforma de Mobilidade Urbana e Intermunicipal estilo Uber com MapLibre GL JS, OpenStreetMap e Roteamento Rodoviario Real (Alagoas)"

Write-Host "Abrindo o repositorio no Brave Browser..."
$brave = 'C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe'
Start-Process $brave -ArgumentList 'https://github.com/jhonwictordev/mobility-platform'
Write-Host "Concluido com sucesso!"
