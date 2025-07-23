# ESCRa - Enhanced Smart Contract Repository & Analytics

A full-stack web application for managing smart contracts, signatures, and blockchain analytics with a modern React frontend and FastAPI backend.

## 🏗️ Architecture

This project consists of two main components:

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and React
- **Backend**: FastAPI with Python, MongoDB, and PostgreSQL
- **Databases**: MongoDB (NoSQL) and PostgreSQL (SQL) running in Docker containers

## 📋 Prerequisites

### System Requirements

- **macOS**: 10.15+ (Catalina or later)
- **RAM**: Minimum 8GB, Recommended 16GB+
- **Storage**: At least 5GB free space
- **Network**: Stable internet connection for package downloads

### Required Software

#### 1. Homebrew (macOS Package Manager)
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Update Homebrew
brew update
```

#### 2. Python 3.11+ (Recommended: 3.11.7)
```bash
# Install Python via Homebrew
brew install python@3.11

# Verify installation
python3 --version
# Should output: Python 3.11.x

# Add Python to PATH (if needed)
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

#### 3. Node.js 18+ (Recommended: 18.19.0)
```bash
# Install Node.js via Homebrew
brew install node@18

# Verify installation
node --version
# Should output: v18.x.x

npm --version
# Should output: 8.x.x or higher
```

#### 4. Docker & Docker Compose
```bash
# Install Docker Desktop for Mac
brew install --cask docker

# Start Docker Desktop
open /Applications/Docker.app

# Verify installation
docker --version
docker-compose --version
```

#### 5. Git
```bash
# Install Git (usually pre-installed on macOS)
brew install git

# Verify installation
git --version
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/baaiello08/escra-pitchcompetition.git
cd escra-pitchcompetition
```

### 2. Backend Setup

Navigate to the backend directory and follow the detailed setup instructions:

```bash
cd escra-backend
```

**📖 See [Backend README](./escra-backend/README.md) for complete backend setup instructions**

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../escra-frontend

# Install dependencies
npm install

# Create environment file (if needed)
cp .env.example .env.local

# Start development server
npm run dev
```

The frontend will be available at: http://localhost:3000

### 4. Database Setup

```bash
# Navigate to backend directory
cd ../escra-backend

# Start database services
docker-compose up -d postgres mongodb

# Verify services are running
docker-compose ps
```

## 📦 Dependencies

### Frontend Dependencies

#### Core Framework
- **Next.js**: 14.1.0
- **React**: 18.2.0
- **TypeScript**: 5.3.3

#### UI & Styling
- **Tailwind CSS**: 3.4.17
- **Framer Motion**: 12.18.1
- **Lucide React**: 0.511.0
- **React Icons**: 5.5.0
- **Headless UI**: 2.2.4

#### State Management & Data
- **Zustand**: 5.0.5
- **React Query**: 5.20.5
- **React Hook Form**: 7.50.1
- **Zod**: 3.22.4

#### Utilities
- **Axios**: 1.6.7
- **Date-fns**: 3.6.0
- **Clsx**: 2.1.1
- **Tailwind Merge**: 2.6.0

### Backend Dependencies

#### Core Framework
- **FastAPI**: 0.104.1
- **Uvicorn**: 0.24.0
- **Pydantic**: 2.5.2

#### Database
- **Motor**: 3.3.2 (MongoDB async driver)
- **PyMongo**: 4.6.1
- **Python-dotenv**: 1.0.0

### Database Services
- **PostgreSQL**: 15 (via Docker)
- **MongoDB**: Latest (via Docker)

## 🔧 Development Setup

### Environment Variables

#### Frontend (.env.local)
```bash
# Create in escra-frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTH0_DOMAIN=your-auth0-domain
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-auth0-client-id
```

#### Backend (.env)
```bash
# Create in escra-backend/.env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/escra_db
MONGODB_URL=mongodb://localhost:27017
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=escra_db
```

### Development Commands

#### Frontend
```bash
cd escra-frontend

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

#### Backend
```bash
cd escra-backend

# Start development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Start with Docker Compose
docker-compose up
```

#### Database
```bash
cd escra-backend

# Start databases only
docker-compose up -d postgres mongodb

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

## 🏃‍♂️ Running the Application

### 1. Start Databases
```bash
cd escra-backend
docker-compose up -d postgres mongodb
```

### 2. Start Backend
```bash
cd escra-backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Start Frontend
```bash
cd escra-frontend
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🧪 Testing

### Frontend Testing
```bash
cd escra-frontend
npm test
```

### Backend Testing
```bash
cd escra-backend
python -m pytest
```

## 📁 Project Structure

```
escra_project/
├── escra-frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Next.js 14 app directory
│   │   ├── components/     # React components
│   │   ├── lib/           # Utility functions
│   │   └── data/          # Mock data and types
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── escra-backend/          # FastAPI backend application
│   ├── main.py            # FastAPI application entry point
│   ├── requirements.txt   # Python dependencies
│   ├── docker-compose.yml # Database services
│   └── README.md          # Backend setup instructions
└── README.md              # This file
```

## 🔍 Key Features

### Frontend Features
- **Modern UI**: Built with Tailwind CSS and Framer Motion
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Built-in dark/light theme support
- **Real-time Updates**: WebSocket integration
- **Form Validation**: React Hook Form with Zod schemas

### Backend Features
- **RESTful API**: FastAPI with automatic documentation
- **Database Integration**: MongoDB and PostgreSQL support
- **Async Operations**: Non-blocking database operations
- **CORS Support**: Configured for frontend communication
- **Environment Configuration**: Flexible environment setup

### Database Features
- **Dual Database**: PostgreSQL for relational data, MongoDB for document storage
- **Docker Integration**: Easy local development setup
- **Health Checks**: Automated service monitoring
- **Data Persistence**: Volume mounting for data retention

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

#### 2. Docker Issues
```bash
# Reset Docker containers
docker-compose down -v
docker-compose up -d

# Clear Docker cache
docker system prune -a
```

#### 3. Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Python Environment Issues
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Performance Optimization

#### Frontend
- Use Next.js Image component for optimized images
- Implement code splitting with dynamic imports
- Enable Tailwind CSS purging in production

#### Backend
- Use connection pooling for database connections
- Implement caching strategies
- Monitor API response times

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Docker Documentation](https://docs.docker.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the backend README for specific backend issues

---

**Happy Coding! 🚀**
