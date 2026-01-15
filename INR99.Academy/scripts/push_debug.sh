#!/bin/bash
cd /workspace

echo "=== Git Status ==="
git status --porcelain

echo "=== Local vs Remote ==="
git log --oneline origin/main..HEAD

echo "=== Pushing to GitHub ==="
git push origin main

echo "=== Push completed ==="
git log --oneline -1