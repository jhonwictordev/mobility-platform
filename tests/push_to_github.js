const { execSync } = require('child_process');
const cwd = 'C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform';
process.env.PATH = 'C:\\Users\\winc\\AppData\\Local\\Programs\\mingit\\cmd;' + process.env.PATH;

console.log('1. Verificando repositório e adicionando arquivos pendentes...');
execSync('git add .', { cwd, stdio: 'inherit' });
try {
  execSync('git commit -m "chore: finalize release files"', { cwd, stdio: 'inherit' });
} catch (e) {
  console.log('Nenhuma alteração adicional para commit.');
}

console.log('2. Criando repositório no GitHub (jhonwictordev/mobility-platform) e enviando os commits...');
try {
  const res = execSync('gh repo create mobility-platform --public --source=. --remote=origin --push --description "Plataforma de Mobilidade Urbana e Intermunicipal estilo Uber com MapLibre GL JS, OpenStreetMap e Roteamento Rodoviario Real (Alagoas)"', {
    cwd,
    encoding: 'utf8'
  });
  console.log(res);
} catch (err) {
  console.error('Erro no gh repo create:', err.message);
  if (err.stdout) console.log('Stdout:', err.stdout);
  if (err.stderr) console.error('Stderr:', err.stderr);
}

console.log('3. Abrindo o repositório no Brave Browser...');
const repoUrl = 'https://github.com/jhonwictordev/mobility-platform';
const bravePath = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
execSync(`"${bravePath}" "${repoUrl}"`, { stdio: 'ignore' });
console.log(`✅ Sucesso! Repositório aberto no Brave: ${repoUrl}`);
