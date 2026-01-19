#!/usr/bin/env python3
"""
GitHub Release Creator for INR99 Academy
Usage: python3 scripts/create-github-release.py v1.0.0
"""

import os
import sys
import requests

def create_release(tag, repo_owner, repo_name, token, draft=False, prerelease=False):
    """Create a GitHub release using the API"""
    
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/releases"
    
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    }
    
    data = {
        "tag_name": tag,
        "name": f"INR99 Academy {tag}",
        "body": f"See https://github.com/{repo_owner}/{repo_name}/releases/tag/{tag} for release notes",
        "draft": draft,
        "prerelease": prerelease,
        "generate_release_notes": True
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 201:
        release = response.json()
        print(f"✅ Release created successfully!")
        print(f"   URL: {release['html_url']}")
        print(f"   ID: {release['id']}")
        return release
    else:
        print(f"❌ Failed to create release: {response.status_code}")
        print(response.text)
        return None

def upload_asset(release_id, file_path, repo_owner, repo_name, token):
    """Upload an asset to the release"""
    
    url = f"https://uploads.github.com/repos/{repo_owner}/{repo_name}/releases/{release_id}/assets"
    
    filename = os.path.basename(file_path)
    filesize = os.path.getsize(file_path)
    
    headers = {
        "Authorization": f"token {token}",
        "Content-Type": "application/octet-stream"
    }
    
    print(f"📤 Uploading {filename} ({filesize} bytes)...")
    
    with open(file_path, 'rb') as f:
        response = requests.post(
            url, 
            headers=headers, 
            data=f,
            params={"name": filename}
        )
    
    if response.status_code == 201:
        print(f"✅ Uploaded {filename}")
        return True
    else:
        print(f"❌ Failed to upload {filename}: {response.status_code}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 create-github-release.py <tag>")
        print("Example: python3 create-github-release.py v1.0.0")
        sys.exit(1)
    
    tag = sys.argv[1]
    
    # Configuration
    REPO_OWNER = "jitenkr2030"
    REPO_NAME = "Desktop-Server-School-Platform"
    TOKEN = os.environ.get("GITHUB_TOKEN", os.environ.get("PAT", ""))
    
    if not TOKEN:
        print("❌ GitHub token not set!")
        print("Set GITHUB_TOKEN or PAT environment variable")
        sys.exit(1)
    
    # Create release
    release = create_release(tag, REPO_OWNER, REPO_NAME, TOKEN)
    
    if release:
        print(f"\n🎉 Release {tag} created successfully!")
        print(f"View at: {release['html_url']}")
