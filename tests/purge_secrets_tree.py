import os
import re

REPLACEMENTS = [
    (re.compile(r'5b3ce3597851110001cf6248[a-zA-Z0-9]{32}'), 'your_openrouteservice_api_key_here'),
    (re.compile(r'simbora-secure-jwt-token-production-2026'), 'replace_with_secure_random_jwt_secret_minimum_32_characters'),
    (re.compile(r'mobility_dev_secret'), 'replace_with_db_password'),
    (re.compile(r'mobility_jwt_secret_dev_key_super_secure'), 'replace_with_jwt_secret'),
    (re.compile(r'simbora_default_jwt_secret_change_in_prod'), 'replace_with_jwt_secret'),
    (re.compile(r'StrongPassword123!'), 'TestPassword123!'),
    (re.compile(r'SecurePass123!'), 'TestPassword123!'),
]

# Sensitive env files that must not exist in any commit
SENSITIVE_FILES = ['.env', '.env.local', '.env.production', '.env.staging', '.env.development']

for root, dirs, files in os.walk('.'):
    # Skip .git
    if '.git' in dirs:
        dirs.remove('.git')
    if 'node_modules' in dirs:
        dirs.remove('node_modules')
        
    for f in files:
        if f in SENSITIVE_FILES:
            try:
                os.remove(os.path.join(root, f))
            except Exception:
                pass
            continue
            
        # Only process text files
        if f.endswith(('.md', '.yml', '.yaml', '.json', '.ts', '.js', '.html', '.env.example', '.sql', '.txt')):
            fpath = os.path.join(root, f)
            try:
                with open(fpath, 'r', encoding='utf-8', errors='ignore') as fp:
                    content = fp.read()
                
                modified = False
                for pattern, repl in REPLACEMENTS:
                    if pattern.search(content):
                        content = pattern.sub(repl, content)
                        modified = True
                        
                if modified:
                    with open(fpath, 'w', encoding='utf-8') as fp:
                        fp.write(content)
            except Exception as e:
                pass
