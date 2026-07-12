# CarbonCopy.ps1
git add .
git commit -m "update: latest changes"
git pull origin CarbonCopy
git push origin CarbonCopy

# powershell -ExecutionPolicy Bypass -File CarbonCopy.ps1
# variable consistency
