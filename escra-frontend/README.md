# MacBook Development Environment Backup & Restoration

This repository contains scripts to backup and restore your development environment when transitioning to a new MacBook.

## Backup Process

The backup script (`backup_development_env.sh`) creates a comprehensive backup of your development environment in `~/trade-in-backup/`. This includes:

- System and development environment information
- Git repositories and their remote URLs
- Git configuration
- .env files from your projects
- Global npm and Python packages
- Installed applications list

### Running the Backup

```bash
./backup_development_env.sh
```

## Restoration Process

The restoration script (`restore_development_env.sh`) automates the setup of your new MacBook. Before running it, ensure you have:

1. Transferred the `trade-in-backup` directory to your new MacBook
2. Copied the `restore_development_env.sh` script to your new MacBook

### Running the Restoration

1. Make the script executable:
   ```bash
   chmod +x restore_development_env.sh
   ```

2. Run the restoration script:
   ```bash
   ./restore_development_env.sh
   ```

The script will:
- Install essential development tools (Node.js, Python, Git, Homebrew)
- Set up Git configuration
- Create a Development directory
- Clone all your repositories
- Restore .env files
- Install Cursor IDE
- Install global npm and Python packages

### Post-Restoration Steps

1. **Verify GitHub Access**
   - When you first try to pull or push to a repository, you'll be prompted for your GitHub credentials
   - Enter your GitHub username and password (or personal access token)

2. **Check Repository Access**
   - Navigate to your Development directory
   - Try pulling from a repository to verify access

3. **Verify Environment Variables**
   - Check that .env files were restored correctly
   - Verify any necessary environment variables are set

4. **Test Development Tools**
   - Verify Node.js: `node --version`
   - Verify Python: `python3 --version`
   - Verify Git: `git --version`
   - Test Cursor IDE

## Troubleshooting

### Common Issues

1. **Repository Access Issues**
   - If repositories fail to clone:
     - Verify your GitHub credentials
     - Check repository URLs in `git_repositories.txt`

2. **Package Installation Issues**
   - If npm or pip packages fail to install:
     - Check internet connection
     - Try installing packages manually

### Getting Help

If you encounter any issues:
1. Check the restoration summary in `~/Development/restoration_summary.txt`
2. Review the script output for error messages
3. Verify the backup directory contents are complete

## Maintenance

- Keep your backup updated before major system changes
- Regularly commit and push your code to GitHub
- Document any manual changes to your development environment
