const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const cwd = path.resolve(__dirname, '..');
process.env.PATH = 'C:\\Users\\winc\\AppData\\Local\\Programs\\mingit\\cmd;' + process.env.PATH;

const sensitivePatterns = [
  { name: 'Private Key', regex: /-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----/ },
  { name: 'GitHub Token', regex: /(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{36,}/ },
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/ },
  { name: 'MapTiler Key Pattern', regex: /key=[a-zA-Z0-9]{15,}/ },
  { name: 'OpenRouteService Key Pattern', regex: /replace_with_openrouteservice_api_key[a-zA-Z0-9]{32}/ },
  { name: 'Hardcoded JWT Secret', regex: /secret\s*:\s*['"][^'"]+['"]/i },
  { name: 'Database Password', regex: /password\s*:\s*['"][^'"]+['"]/i }
];

console.log('=== AUDITORIA 1: VERIFICANDO HISTÓRICO COMPLETO DO GIT ===');
try {
  const diff = execSync('git log -p', { cwd, encoding: 'utf8', maxBuffer: 100 * 1024 * 1024 });

  sensitivePatterns.forEach(p => {
    const matches = diff.match(new RegExp(p.regex, 'g'));
    if (matches) {
      console.log(`⚠️ [ALERTA] Padrão "${p.name}" detectado no git log (${matches.length} ocorrências)`);
      matches.slice(0, 5).forEach(m => {
        const masked = m.substring(0, Math.min(10, m.length)) + '...[REDACTED]';
        console.log(`   - Encontrado: ${masked}`);
      });
    } else {
      console.log(`✅ [OK] Limpo: ${p.name}`);
    }
  });
} catch (e) {
  console.error('Erro ao ler git log:', e.message);
}

console.log('\n=== AUDITORIA 2: DEPENDÊNCIAS (NPM AUDIT) ===');
function runAudit(dirName) {
  const targetDir = path.join(cwd, dirName);
  if (!fs.existsSync(targetDir)) return;
  console.log(`\nVerificando ${dirName || 'Root'}...`);
  try {
    const res = execSync('npm audit --json', { cwd: targetDir, encoding: 'utf8' });
    const auditData = JSON.parse(res);
    const vulns = auditData.metadata ? auditData.metadata.vulnerabilities : {};
    console.log(`Vulnerabilidades em ${dirName || 'Root'}:`, vulns);
  } catch (err) {
    if (err.stdout) {
      try {
        const auditData = JSON.parse(err.stdout);
        const vulns = auditData.metadata ? auditData.metadata.vulnerabilities : {};
        console.log(`Vulnerabilidades encontradas em ${dirName || 'Root'}:`, vulns);
      } catch (parseErr) {
        console.log(`Resultado do audit em ${dirName || 'Root'}:`, err.stdout.split('\n').slice(0, 5).join('\n'));
      }
    } else {
      console.log(`Erro no npm audit para ${dirName}:`, err.message);
    }
  }
}

runAudit('');
runAudit('services/api');
runAudit('apps/admin');
