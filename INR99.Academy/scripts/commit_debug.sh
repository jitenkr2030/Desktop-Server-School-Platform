#!/bin/bash
cd /workspace
echo "Adding files to git..."
git add src/app/dashboard/student/page.tsx src/app/instructor/page.tsx src/app/admin/page.tsx
echo "Committing debug changes..."
git commit -m "debug: Add console logging to dashboard tab clicks for troubleshooting"
echo "Pushing to GitHub..."
git push origin main
echo "Debug changes pushed successfully!"