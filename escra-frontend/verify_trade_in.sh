#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="$HOME/trade-in-backup"
VERIFICATION_DIR="$HOME/trade-in-verification"
mkdir -p "$VERIFICATION_DIR"

echo -e "${BLUE}Starting trade-in verification process...${NC}\n"

# Function to check if a command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
        return 0
    else
        echo -e "${RED}✗ $1${NC}"
        return 1
    fi
}

# 1. Check Git Repositories
echo -e "${BLUE}Checking Git repositories...${NC}"
{
    echo "=== Git Repository Status ==="
    echo "Checked at: $(date)"
    echo
} > "$VERIFICATION_DIR/git_status.txt"

find "$HOME" -name ".git" -type d -not -path "*/node_modules/*" 2>/dev/null | while read -r git_dir; do
    repo_dir=$(dirname "$git_dir")
    repo_name=$(basename "$repo_dir")
    
    echo -e "\nChecking repository: $repo_name"
    
    # Change to repository directory
    cd "$repo_dir" || continue
    
    # Check for uncommitted changes
    if git diff --quiet && git diff --cached --quiet; then
        echo -e "${GREEN}✓ No uncommitted changes${NC}"
        echo "$repo_name: No uncommitted changes" >> "$VERIFICATION_DIR/git_status.txt"
    else
        echo -e "${RED}✗ Has uncommitted changes${NC}"
        echo "$repo_name: HAS UNCOMMITTED CHANGES" >> "$VERIFICATION_DIR/git_status.txt"
        git status --short >> "$VERIFICATION_DIR/git_status.txt"
    fi
    
    # Check for unpushed commits
    if git diff --quiet @{upstream} 2>/dev/null; then
        echo -e "${GREEN}✓ All commits pushed${NC}"
        echo "$repo_name: All commits pushed" >> "$VERIFICATION_DIR/git_status.txt"
    else
        echo -e "${RED}✗ Has unpushed commits${NC}"
        echo "$repo_name: HAS UNPUSHED COMMITS" >> "$VERIFICATION_DIR/git_status.txt"
        git log @{upstream}..HEAD --oneline >> "$VERIFICATION_DIR/git_status.txt"
    fi
done

# 2. Verify Backup Contents
echo -e "\n${BLUE}Verifying backup contents...${NC}"
{
    echo "=== Backup Contents Verification ==="
    echo "Checked at: $(date)"
    echo
} > "$VERIFICATION_DIR/backup_verification.txt"

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}✗ Backup directory not found at $BACKUP_DIR${NC}"
    echo "ERROR: Backup directory not found" >> "$VERIFICATION_DIR/backup_verification.txt"
else
    echo -e "${GREEN}✓ Backup directory found${NC}"
    echo "Backup directory found at: $BACKUP_DIR" >> "$VERIFICATION_DIR/backup_verification.txt"
    
    # List all backup contents
    echo -e "\nBackup contents:"
    echo "Backup contents:" >> "$VERIFICATION_DIR/backup_verification.txt"
    ls -R "$BACKUP_DIR" >> "$VERIFICATION_DIR/backup_verification.txt"
    
    # Check for essential backup components
    essential_files=(
        "environment_info.txt"
        "git_config/git_config.txt"
        "git_repositories.txt"
        "installed_apps.txt"
        "README.txt"
    )
    
    echo -e "\nChecking essential backup components:"
    echo "Checking essential backup components:" >> "$VERIFICATION_DIR/backup_verification.txt"
    
    for file in "${essential_files[@]}"; do
        if [ -f "$BACKUP_DIR/$file" ]; then
            echo -e "${GREEN}✓ $file exists${NC}"
            echo "$file: Found" >> "$VERIFICATION_DIR/backup_verification.txt"
        else
            echo -e "${RED}✗ $file missing${NC}"
            echo "$file: MISSING" >> "$VERIFICATION_DIR/backup_verification.txt"
        fi
    done
fi

# 3. Create Manual Checklist
echo -e "\n${BLUE}Creating manual checklist...${NC}"
{
    echo "=== Manual Trade-in Checklist ==="
    echo "Generated at: $(date)"
    echo
    echo "1. Pre-Trade-in Steps:"
    echo "   [ ] Review git_status.txt and commit/push any pending changes"
    echo "   [ ] Verify all .env files are backed up"
    echo "   [ ] Export any browser bookmarks"
    echo "   [ ] Export any important application settings"
    echo "   [ ] Take screenshots of important application configurations"
    echo
    echo "2. Backup Verification:"
    echo "   [ ] Verify backup_verification.txt shows all components present"
    echo "   [ ] Test backup restoration on a temporary directory"
    echo "   [ ] Verify all repository URLs are correct"
    echo
    echo "3. Data Transfer:"
    echo "   [ ] Copy trade-in-backup to external drive"
    echo "   [ ] Copy trade-in-verification to external drive"
    echo "   [ ] Verify backup integrity on external drive"
    echo
    echo "4. Final Steps:"
    echo "   [ ] Sign out of all applications"
    echo "   [ ] Clear browser data (if not already backed up)"
    echo "   [ ] Remove any sensitive data"
    echo "   [ ] Perform final backup"
    echo
    echo "5. New Machine Setup:"
    echo "   [ ] Transfer backup to new machine"
    echo "   [ ] Run restore_development_env.sh"
    echo "   [ ] Verify all repositories clone successfully"
    echo "   [ ] Test development environment"
} > "$VERIFICATION_DIR/manual_checklist.txt"

# 4. Create Summary
echo -e "\n${BLUE}Creating verification summary...${NC}"
{
    echo "=== Trade-in Verification Summary ==="
    echo "Generated at: $(date)"
    echo
    echo "Verification files location: $VERIFICATION_DIR"
    echo
    echo "1. Git Status:"
    echo "   - Check git_status.txt for repository status"
    echo "   - Review any uncommitted changes or unpushed commits"
    echo
    echo "2. Backup Verification:"
    echo "   - Check backup_verification.txt for backup contents"
    echo "   - Verify all essential components are present"
    echo
    echo "3. Manual Checklist:"
    echo "   - Review manual_checklist.txt for required steps"
    echo "   - Complete all checklist items before trade-in"
    echo
    echo "Next Steps:"
    echo "1. Review all verification files in $VERIFICATION_DIR"
    echo "2. Complete the manual checklist"
    echo "3. Address any issues found during verification"
    echo "4. Perform final backup before trade-in"
} > "$VERIFICATION_DIR/verification_summary.txt"

echo -e "\n${GREEN}Verification complete!${NC}"
echo -e "All verification files have been saved to: $VERIFICATION_DIR"
echo -e "Please review the verification_summary.txt file for next steps." 