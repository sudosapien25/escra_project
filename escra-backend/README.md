# ESCRa Backend - FastAPI Application

A modern FastAPI backend for the ESCRa project, providing RESTful APIs for smart contract management, signature processing, and blockchain analytics.

## 🏗️ Architecture

- **Framework**: FastAPI 0.104.1
- **Python Version**: 3.11+ (Recommended: 3.11.7)
- **Databases**: 
  - PostgreSQL 15 (Primary relational database)
  - MongoDB Latest (Document storage)
- **Containerization**: Docker & Docker Compose
- **API Documentation**: Automatic OpenAPI/Swagger docs

## 📋 Prerequisites

### System Requirements
- **Python**: 3.11+ 
- **Docker**: Latest version
- **Docker Compose**: Latest version
- **Git**: For version control

### Python Environment Setup

#### 1. Install Python 3.11+
```bash
# macOS with Homebrew
brew install python@3.11

# Verify installation
python3 --version
# Should output: Python 3.11.x
```

#### 2. Create Virtual Environment
```bash
# Navigate to backend directory
cd escra-backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Verify activation
which python
# Should show: .../escra-backend/venv/bin/python
```

#### 3. Install Dependencies
```bash
# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

## 🚀 Quick Start

### 1. Environment Configuration

Create a `.env` file in the backend directory:

```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/escra_db
MONGODB_URL=mongodb://localhost:27017

# PostgreSQL Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=escra_db

# Application Configuration
PORT=8000
HOST=0.0.0.0
DEBUG=True
```

### 2. Start Database Services

```bash
# Start PostgreSQL and MongoDB
docker-compose up -d postgres mongodb

# Verify services are running
docker-compose ps

# Check service logs
docker-compose logs postgres
docker-compose logs mongodb
```

### 3. Run the Application

#### Development Mode
```bash
# Activate virtual environment
source venv/bin/activate

# Start development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Production Mode
```bash
# Start with Docker Compose (includes backend)
docker-compose up
```

### 4. Access the Application

- **API Base URL**: http://localhost:8000
- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 📦 Dependencies

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `fastapi` | 0.104.1 | Web framework |
| `uvicorn` | 0.24.0 | ASGI server |
| `pydantic` | 2.5.2 | Data validation |
| `motor` | 3.3.2 | MongoDB async driver |
| `pymongo` | 4.6.1 | MongoDB driver |
| `python-dotenv` | 1.0.0 | Environment management |

### Development Dependencies

```bash
# Install development dependencies
pip install pytest pytest-asyncio httpx
```

## 🗄️ Database Setup

### PostgreSQL Setup

#### Using Docker (Recommended)
```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d escra_db
```

#### Manual Setup
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database
createdb escra_db
```

### MongoDB Setup

#### Using Docker (Recommended)
```bash
# Start MongoDB container
docker-compose up -d mongodb

# Connect to MongoDB
docker-compose exec mongodb mongosh
```

#### Manual Setup
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community
```

## 🔧 Development Commands

### Application Commands
```bash
# Development server with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production server
uvicorn main:app --host 0.0.0.0 --port 8000

# Custom port
uvicorn main:app --port 8080

# Workers (production)
uvicorn main:app --workers 4
```

### Docker Commands
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Start specific services
docker-compose up -d postgres mongodb

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Database Commands
```bash
# PostgreSQL
docker-compose exec postgres psql -U postgres -d escra_db

# MongoDB
docker-compose exec mongodb mongosh

# Backup PostgreSQL
docker-compose exec postgres pg_dump -U postgres escra_db > backup.sql

# Restore PostgreSQL
docker-compose exec -T postgres psql -U postgres -d escra_db < backup.sql
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_main.py

# Run with verbose output
pytest -v
```

### Test Configuration
Create `pytest.ini` in the backend directory:

```ini
[tool:pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --tb=short
```

## 📁 Project Structure

```
escra-backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── docker-compose.yml      # Database services configuration
├── Dockerfile             # Backend container configuration
├── .env                   # Environment variables (create this)
├── .env.example           # Environment variables template
├── README.md              # This file
├── tests/                 # Test files
│   ├── __init__.py
│   ├── test_main.py
│   └── conftest.py
├── app/                   # Application modules (future structure)
│   ├── __init__.py
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── utils/            # Utility functions
└── migrations/           # Database migrations (future)
```

## 🔍 API Endpoints

### Health Check
- `GET /health` - Application health status
- `GET /` - Root endpoint with welcome message

### Future Endpoints (To be implemented)
- `GET /api/signatures` - List signatures
- `POST /api/signatures` - Create signature
- `GET /api/contracts` - List contracts
- `POST /api/contracts` - Create contract
- `GET /api/analytics` - Blockchain analytics

## 🔒 Security

### CORS Configuration
The application is configured with CORS middleware to allow frontend communication:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)
```

### Environment Variables
- Never commit `.env` files to version control
- Use `.env.example` as a template
- Set appropriate permissions: `chmod 600 .env`

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

#### 2. Database Connection Issues
```bash
# Check if databases are running
docker-compose ps

# Restart database services
docker-compose restart postgres mongodb

# Check database logs
docker-compose logs postgres
docker-compose logs mongodb
```

#### 3. Python Environment Issues
```bash
# Recreate virtual environment
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 4. Docker Issues
```bash
# Reset Docker containers
docker-compose down -v
docker-compose up -d

# Clear Docker cache
docker system prune -a
```

### Performance Optimization

#### Database Optimization
- Use connection pooling for database connections
- Implement database indexing strategies
- Monitor query performance

#### Application Optimization
- Enable async operations where possible
- Implement caching strategies
- Monitor API response times

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Uvicorn Documentation](https://www.uvicorn.org/)
- [Pydantic Documentation](https://pydantic-docs.helpmanual.io/)
- [Motor Documentation](https://motor.readthedocs.io/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🤝 Contributing

1. Follow the project's coding standards
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## 📄 License

This project is licensed under the MIT License.

---

**Happy Coding! 🚀** 