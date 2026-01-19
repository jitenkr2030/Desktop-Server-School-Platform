#!/bin/bash

# Simple GitHub Release Creator
# Usage: ./scripts/github-release.sh v1.0.0

REPO="jitenkr2030/Desktop-Server-School-Platform"
TAG="$1"

if [ -z "$TAG" ]; then
    echo "Usage: $0 <tag-version>"
    echo "Example: $0 v1.0.0"
    exit 1
fi

# Read PAT from environment or prompt
if [ -z "$PAT" ]; then
    echo "Enter your GitHub PAT: "
    read -s PAT
    echo ""
fi

echo "Creating release for $TAG..."

# Create release via GitHub API
curl -X POST \
  -H "Authorization: token $PAT" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$REPO/releases" \
  -d "{
    \"tag_name\": \"$TAG\",
    \"name\": \"INR99 Academy $TAG\",
    \"body\": \"# INR99 Academy $TAG Release Notes\\n\\nSee https://github.com/$REPO/releases/tag/$TAG for details\\n\",
    \"draft\": false,
    \"prerelease\": false
  }"

echo ""
echo "Release created! Check: https://github.com/$REPO/releases/$TAG"
