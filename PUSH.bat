@echo off
echo ==============================
echo AUTO PUSH (images + data.js)
echo ==============================

set GIT_BASH="C:\Program Files\Git\bin\bash.exe"

%GIT_BASH% -c "
cd /f/kokosima/kokosimareels || exit 1

# cek perubahan hanya di target
CHANGED=\$(git status --porcelain images data.js)

if [ -z \"\$CHANGED\" ]; then
  echo 'Tidak ada perubahan pada images atau data.js'
  exit 0
fi

git add images data.js

COMMIT_MSG=\"update images & data.js $(date '+%Y-%m-%d %H:%M:%S')\"
git commit -m \"$COMMIT_MSG\"
git push origin main
"

pause
