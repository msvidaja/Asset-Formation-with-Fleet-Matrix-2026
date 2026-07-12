# CarbonCopy.ps1
$time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git add .
git commit -m "update: latest changes"
git pull origin CarbonCopy
git push origin CarbonCopy

# powershell -ExecutionPolicy Bypass -File CarbonCopy.ps1
# Default Branch: Main
# Working Directory: CarbonCopy
# Documentation Work: Draft001.ps1
