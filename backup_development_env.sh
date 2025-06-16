#!/bin/bash

# Create backup directory
BACKUP_DIR="$HOME/trade-in-backup"
mkdir -p "$BACKUP_DIR"
mkdir -p "$BACKUP_DIR/env_files"
mkdir -p "$BACKUP_DIR/ssh_keys"
mkdir -p "$BACKUP_DIR/git_config"

echo "Starting development environment backup..."
echo "Backup directory: $BACKUP_DIR"

# 1. System and Development Environment Information
echo "Collecting system and development environment information..."
{
    echo "=== System Information ==="
    sw_vers
    echo -e "\n=== Node.js Information ==="
    node --version
    npm --version
    echo -e "\n=== Python Information ==="
    python3 --version
    pip3 --version
    echo -e "\n=== Global NPM Packages ==="
    npm list -g --depth=0
    echo -e "\n=== Global Python Packages ==="
    pip3 list
    echo -e "\n=== Homebrew Packages ==="
    brew list
    echo -e "\n=== Installed Applications ==="
    ls /Applications
} > "$BACKUP_DIR/environment_info.txt"

# 2. Find and backup .env files
echo "Searching for .env files..."
find "$HOME" -name ".env" -type f -not -path "*/node_modules/*" -not -path "*/\.*" 2>/dev/null | while read -r env_file; do
    echo "Found .env file: $env_file"
    cp "$env_file" "$BACKUP_DIR/env_files/"
done

# 3. Backup SSH keys
echo "Backing up SSH keys..."
if [ -d "$HOME/.ssh" ]; then
    cp -r "$HOME/.ssh" "$BACKUP_DIR/ssh_keys/"
    echo "SSH keys backed up to $BACKUP_DIR/ssh_keys/"
else
    echo "No SSH keys found"
fi

# 4. Save git configuration
echo "Saving git configuration..."
git config --list > "$BACKUP_DIR/git_config/git_config.txt"
cp "$HOME/.gitconfig" "$BACKUP_DIR/git_config/" 2>/dev/null || echo "No .gitconfig file found"

# 5. Find and document all git repositories
echo "Finding git repositories..."
{
    echo "=== Git Repositories ==="
    find "$HOME" -name ".git" -type d -not -path "*/node_modules/*" 2>/dev/null | while read -r git_dir; do
        repo_dir=$(dirname "$git_dir")
        echo -e "\nRepository: $repo_dir"
        cd "$repo_dir" || continue
        git remote -v
    done
} > "$BACKUP_DIR/git_repositories.txt"

# 6. Export information about installed applications
echo "Exporting information about installed applications..."
{
    echo "=== Installed Applications ==="
    ls /Applications
    echo -e "\n=== Homebrew Applications ==="
    brew list
    echo -e "\n=== VS Code Extensions ==="
    code --list-extensions
} > "$BACKUP_DIR/installed_apps.txt"

# 7. Create a summary file
echo "Creating summary file..."
{
    echo "=== Backup Summary ==="
    echo "Backup completed at: $(date)"
    echo "Backup location: $BACKUP_DIR"
    echo -e "\nContents:"
    echo "- environment_info.txt: System and development environment information"
    echo "- env_files/: Backup of .env files"
    echo "- ssh_keys/: Backup of SSH keys"
    echo "- git_config/: Git configuration files"
    echo "- git_repositories.txt: List of git repositories and their remotes"
    echo "- installed_apps.txt: List of installed applications and tools"
} > "$BACKUP_DIR/README.txt"

echo "Backup completed successfully!"
echo "All information has been saved to: $BACKUP_DIR"
echo "Please review the contents before transferring to your new machine." 