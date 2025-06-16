from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import asyncio
import logging
from models.contract import Contract
from models.task import Task, Subtask
from models.notification import Notification, NotificationMeta
from typing import List, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# MongoDB connection string (will be set in .env)
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")

# Create MongoDB client with timeout settings
mongodb_client = AsyncIOMotorClient(
    MONGODB_URL,
    serverSelectionTimeoutMS=5000,  # 5 second timeout
    connectTimeoutMS=5000
)

# Get database
db = mongodb_client.escra_db

# Collections
contracts_collection = db.contracts
documents_collection = db.documents
tasks_collection = db.tasks
notifications_collection = db.notifications

async def verify_connection():
    """Verify MongoDB connection"""
    try:
        # Ping the server
        await mongodb_client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
        return True
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        return False

# Contract operations
async def create_contract(contract: Contract) -> Contract:
    """Create a new contract"""
    contract_dict = contract.to_mongo()
    result = await contracts_collection.insert_one(contract_dict)
    contract.id = str(result.inserted_id)
    return contract

async def get_contract(contract_id: str) -> Optional[Contract]:
    """Get a contract by ID"""
    contract_dict = await contracts_collection.find_one({"_id": contract_id})
    return Contract.from_mongo(contract_dict) if contract_dict else None

async def update_contract(contract_id: str, contract: Contract) -> Optional[Contract]:
    """Update a contract"""
    contract_dict = contract.to_mongo()
    result = await contracts_collection.update_one(
        {"_id": contract_id},
        {"$set": contract_dict}
    )
    if result.modified_count:
        return await get_contract(contract_id)
    return None

async def list_contracts() -> List[Contract]:
    """List all contracts"""
    contracts = []
    async for contract_dict in contracts_collection.find():
        contract = Contract.from_mongo(contract_dict)
        if contract:
            contracts.append(contract)
    return contracts

# Task operations
async def create_task(task: Task) -> Task:
    """Create a new task"""
    task_dict = task.to_mongo()
    result = await tasks_collection.insert_one(task_dict)
    task.id = str(result.inserted_id)
    return task

async def get_task(task_id: str) -> Optional[Task]:
    """Get a task by ID"""
    task_dict = await tasks_collection.find_one({"_id": task_id})
    return Task.from_mongo(task_dict) if task_dict else None

async def update_task(task_id: str, task: Task) -> Optional[Task]:
    """Update a task"""
    task_dict = task.to_mongo()
    result = await tasks_collection.update_one(
        {"_id": task_id},
        {"$set": task_dict}
    )
    if result.modified_count:
        return await get_task(task_id)
    return None

async def list_tasks(contract_id: Optional[str] = None) -> List[Task]:
    """List all tasks, optionally filtered by contract_id"""
    query = {"contract_id": contract_id} if contract_id else {}
    tasks = []
    async for task_dict in tasks_collection.find(query):
        task = Task.from_mongo(task_dict)
        if task:
            tasks.append(task)
    return tasks

# Notification operations
async def create_notification(notification: Notification) -> Notification:
    """Create a new notification"""
    notification_dict = notification.to_mongo()
    result = await notifications_collection.insert_one(notification_dict)
    notification.id = str(result.inserted_id)
    return notification

async def get_notification(notification_id: str) -> Optional[Notification]:
    """Get a notification by ID"""
    notification_dict = await notifications_collection.find_one({"_id": notification_id})
    return Notification.from_mongo(notification_dict) if notification_dict else None

async def update_notification(notification_id: str, notification: Notification) -> Optional[Notification]:
    """Update a notification"""
    notification_dict = notification.to_mongo()
    result = await notifications_collection.update_one(
        {"_id": notification_id},
        {"$set": notification_dict}
    )
    if result.modified_count:
        return await get_notification(notification_id)
    return None

async def list_notifications(user_id: Optional[str] = None, unread_only: bool = False) -> List[Notification]:
    """List notifications, optionally filtered by user_id and read status"""
    query = {}
    if user_id:
        query["meta.user_id"] = user_id
    if unread_only:
        query["read"] = False
    
    notifications = []
    async for notification_dict in notifications_collection.find(query).sort("timestamp", -1):
        notification = Notification.from_mongo(notification_dict)
        if notification:
            notifications.append(notification)
    return notifications

# Verify connection on startup
asyncio.create_task(verify_connection()) 