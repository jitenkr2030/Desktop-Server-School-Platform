#!/bin/bash
set -e

echo "Current directory: $(pwd)"
echo "Git status:"
git status

echo "Local commits ahead of origin:"
git log --oneline origin/main..HEAD

echo "Pushing to GitHub..."
git push origin main

echo "Push completed!"
echo "Latest commit:"
git log --oneline -1