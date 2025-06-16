#!/bin/bash

# Configuration
BACKUP_DIR="$HOME/trade-in-backup"
REPOS_DIR="$HOME/Development"  # You can change this to your preferred location

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting development environment restoration...${NC}"

# Check if backup exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo "Error: Backup directory not found at $BACKUP_DIR"
    exit 1
fi

# 1. Install Homebrew if not installed
if ! command -v brew &> /dev/null; then
    echo -e "${BLUE}Installing Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "Homebrew already installed"
fi

# 2. Install essential development tools
echo -e "${BLUE}Installing essential development tools...${NC}"
brew install node python@3.11 git

# 3. Set up Git configuration
echo -e "${BLUE}Restoring Git configuration...${NC}"
if [ -f "$BACKUP_DIR/git_config/.gitconfig" ]; then
    cp "$BACKUP_DIR/git_config/.gitconfig" "$HOME/.gitconfig"
    echo "Git configuration restored"
fi

# 4. Set up SSH keys
echo -e "${BLUE}Setting up SSH keys...${NC}"
if [ -d "$BACKUP_DIR/ssh_keys/.ssh" ]; then
    mkdir -p "$HOME/.ssh"
    cp -r "$BACKUP_DIR/ssh_keys/.ssh/"* "$HOME/.ssh/"
    chmod 700 "$HOME/.ssh"
    chmod 600 "$HOME/.ssh/id_rsa" 2>/dev/null
    chmod 644 "$HOME/.ssh/id_rsa.pub" 2>/dev/null
    echo "SSH keys restored"
fi

# 5. Create Development directory
echo -e "${BLUE}Creating Development directory...${NC}"
mkdir -p "$REPOS_DIR"

# 6. Clone repositories
echo -e "${BLUE}Cloning repositories...${NC}"
if [ -f "$BACKUP_DIR/git_repositories.txt" ]; then
    while IFS= read -r line; do
        if [[ $line == *"Repository:"* ]]; then
            repo_path=$(echo "$line" | cut -d' ' -f2)
            repo_name=$(basename "$repo_path")
            if [[ $line == *"github.com"* ]]; then
                echo "Cloning $repo_name..."
                # Extract the repository URL from the next line
                read -r url_line
                repo_url=$(echo "$url_line" | grep -o 'git@github.com:.*\.git\|https://github.com/.*\.git')
                if [ ! -z "$repo_url" ]; then
                    git clone "$repo_url" "$REPOS_DIR/$repo_name"
                fi
            fi
        fi
    done < "$BACKUP_DIR/git_repositories.txt"
fi

# 7. Restore .env files
echo -e "${BLUE}Restoring .env files...${NC}"
if [ -d "$BACKUP_DIR/env_files" ]; then
    for env_file in "$BACKUP_DIR/env_files"/*; do
        if [ -f "$env_file" ]; then
            # Try to find the corresponding repository
            env_name=$(basename "$env_file")
            find "$REPOS_DIR" -type d -name ".git" -exec dirname {} \; | while read -r repo; do
                if [ -f "$repo/.env.example" ] || [ -f "$repo/.env" ]; then
                    echo "Restoring .env file to $repo"
                    cp "$env_file" "$repo/.env"
                fi
            done
        fi
    done
fi

# 8. Install Cursor
echo -e "${BLUE}Installing Cursor...${NC}"
if ! command -v cursor &> /dev/null; then
    brew install --cask cursor
    echo "Cursor installed"
else
    echo "Cursor already installed"
fi

# 9. Install global npm packages
echo -e "${BLUE}Installing global npm packages...${NC}"
if [ -f "$BACKUP_DIR/environment_info.txt" ]; then
    grep -A 100 "=== Global NPM Packages ===" "$BACKUP_DIR/environment_info.txt" | \
    grep -v "=== Global NPM Packages ===" | \
    grep -v "npm list" | \
    while read -r package; do
        if [[ $package == *"@"* ]]; then
            package_name=$(echo "$package" | awk '{print $2}')
            echo "Installing $package_name..."
            npm install -g "$package_name"
        fi
    done
fi

# 10. Install global Python packages
echo -e "${BLUE}Installing global Python packages...${NC}"
if [ -f "$BACKUP_DIR/environment_info.txt" ]; then
    grep -A 100 "=== Global Python Packages ===" "$BACKUP_DIR/environment_info.txt" | \
    grep -v "=== Global Python Packages ===" | \
    grep -v "pip list" | \
    while read -r package; do
        if [[ $package == *"=="* ]]; then
            package_name=$(echo "$package" | awk '{print $1}')
            echo "Installing $package_name..."
            pip3 install "$package_name"
        fi
    done
fi

# 11. Create a summary of what was done
echo -e "${BLUE}Creating restoration summary...${NC}"
{
    echo "=== Restoration Summary ==="
    echo "Restoration completed at: $(date)"
    echo "Development directory: $REPOS_DIR"
    echo -e "\nWhat was restored:"
    echo "- Essential development tools (Node.js, Python, Git, Homebrew)"
    echo "- Git configuration"
    echo "- SSH keys"
    echo "- Repository clones"
    echo "- .env files"
    echo "- Global npm packages"
    echo "- Global Python packages"
    echo "- Cursor IDE"
} > "$REPOS_DIR/restoration_summary.txt"

echo -e "${GREEN}Development environment restoration completed!${NC}"
echo -e "A summary has been saved to: $REPOS_DIR/restoration_summary.txt"
echo -e "Please review the restoration and make any necessary adjustments." 