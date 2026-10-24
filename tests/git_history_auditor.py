import subprocess
import re
import json

PATTERNS = {
    "Private Key": r"-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP |)PRIVATE KEY-----",
    "GitHub PAT / Token": r"(?:ghp|gho|ghu|ghs|ghr|github_pat)_[A-Za-z0-9_]{36,}",
    "AWS Access Key": r"(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}",
    "MapTiler API Key": r"(?:maptiler[_-]?key|key=)([a-zA-Z0-9]{20,})",
    "OpenRouteService Key": r"5b3ce3597851110001cf6248[a-zA-Z0-9]{32}",
    "JWT Secret Key": r"JWT_SECRET\s*=\s*['\"]?([^'\"\s\r\n]{8,})",
    "Database Password": r"(?:password|pwd|db_pass)\s*[:=]\s*['\"]([^'\"]+)['\"]",
    "Postgres Connection URL": r"postgres(?:ql)?:\/\/[^:\s]+:([^@\s]+)@",
    "Brazilian CPF (PII)": r"\b\d{3}\.\d{3}\.\d{3}-\d{2}\b",
    "Credit Card Number": r"\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\b"
}

def redact(val):
    if not val:
        return ""
    if len(val) <= 4:
        return "*" * len(val)
    return val[:2] + "*" * (len(val) - 4) + val[-2:]

import os

REPO_DIR = r"C:\Users\winc\.gemini\antigravity\scratch\mobility-platform"

def run_git_log():
    git_cmd = [r"C:\Users\winc\AppData\Local\Programs\mingit\cmd\git.exe", "log", "-p", "--full-history", "--no-textconv", "-U1"]
    res = subprocess.run(git_cmd, cwd=REPO_DIR, capture_output=True, text=True, errors="ignore")
    return res.stdout

def audit():
    raw_log = run_git_log()
    commits = re.split(r'\r?\n(?=commit [0-9a-f]{40})', raw_log)
    
    findings = []
    print(f"Total commits analyzed: {len(commits)}")
    
    for c_idx, c_text in enumerate(commits):
        lines = c_text.splitlines()
        if not lines:
            continue
        m_commit = re.match(r'commit ([0-9a-f]{40})', lines[0])
        commit_hash = m_commit.group(1)[:7] if m_commit else "unknown"
        
        current_file = "unknown"
        for line in lines:
            if line.startswith('diff --git'):
                m_file = re.search(r' b\/(.+)$', line)
                if m_file:
                    current_file = m_file.group(1)
            elif line.startswith('+') and not line.startswith('+++'):
                added_content = line[1:]
                for p_name, p_regex in PATTERNS.items():
                    matches = re.finditer(p_regex, added_content, re.IGNORECASE)
                    for m in matches:
                        raw_val = m.group(1) if m.groups() else m.group(0)
                        # Filter obvious false positives/tests
                        if any(fp in raw_val.lower() for fp in ["your_", "replace_", "placeholder", "xxx", "demo", "example", "testpass"]):
                            continue
                        findings.append({
                            "commit": commit_hash,
                            "file": current_file,
                            "secret_type": p_name,
                            "redacted_value": redact(raw_val),
                            "line_preview": redact(added_content.strip()[:60])
                        })
                        
    print("\n" + "="*70)
    print("DETAILED GIT COMMIT AUDIT REPORT (SANITIZED)")
    print("="*70)
    if not findings:
        print("[SUCCESS] Zero hardcoded secrets, private keys, or exposed tokens found in Git history.")
    else:
        print(f"[ALERT] Found {len(findings)} potential secret occurrence(s) in commit history:")
        for idx, f in enumerate(findings, 1):
            print(f"{idx}. Commit: {f['commit']} | File: {f['file']} | Type: {f['secret_type']} | Match: {f['redacted_value']}")
    print("="*70)

if __name__ == '__main__':
    audit()
