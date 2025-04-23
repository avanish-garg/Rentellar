# Clean up root directory
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package.json -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Clean up frontend
Set-Location frontend
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item src/App.css -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force src/contexts -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force src/translations -ErrorAction SilentlyContinue
Rename-Item src/App.jsx src/App.tsx -ErrorAction SilentlyContinue
Rename-Item src/main.jsx src/main.tsx -ErrorAction SilentlyContinue

# Clean up backend
Set-Location ../backend
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force backend -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force middleware -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force routes -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force models -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force controllers -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force config -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force utils -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force scripts -ErrorAction SilentlyContinue

# Return to root
Set-Location .. 