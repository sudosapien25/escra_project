#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a directory is a git repository
is_git_repo() {
    git -C "$1" rev-parse --is-inside-work-tree >/dev/null 2>&1
}

# Function to check repository status
check_repo() {
    local repo_path="$1"
    local repo_name=$(basename "$repo_path")
    
    echo -e "\n${YELLOW}Checking repository: ${repo_name}${NC}"
    
    # Check if there are any changes
    if git -C "$repo_path" diff --quiet && git -C "$repo_path" diff --cached --quiet; then
        echo -e "${GREEN}✓ Repository is clean${NC}"
    else
        echo -e "${RED}! Repository has uncommitted changes${NC}"
        
        # Show status
        echo "Status:"
        git -C "$repo_path" status --short
        
        # Ask if user wants to commit changes
        read -p "Do you want to commit these changes? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Commit changes
            git -C "$repo_path" add .
            git -C "$repo_path" commit -m "Auto-commit before system cleanup"
            echo -e "${GREEN}✓ Changes committed${NC}"
        fi
    fi
    
    # Check if there are any unpushed commits
    if git -C "$repo_path" rev-list HEAD --not --remotes >/dev/null 2>&1; then
        echo -e "${YELLOW}! Repository has unpushed commits${NC}"
        
        # Ask if user wants to push changes
        read -p "Do you want to push these commits? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Push changes
            git -C "$repo_path" push
            echo -e "${GREEN}✓ Changes pushed${NC}"
        fi
    else
        echo -e "${GREEN}✓ All commits are pushed${NC}"
    fi
}

# Main script
echo "Starting Git repository check..."

# Find all git repositories in the current directory and subdirectories
find . -type d -name ".git" -exec dirname {} \; | while read -r repo; do
    check_repo "$repo"
done

echo -e "\n${GREEN}Repository check complete!${NC}" 