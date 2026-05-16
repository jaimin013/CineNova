# CineNova Docker Guide

Necessary commands to manage the CineNova stack using Docker.

## Production Stack (Recommended)
Use this for a fast, optimized, and stable environment.
```powershell
# Build and start all services in detached mode
docker-compose -f docker-compose.prod.yml up --build -d

# Check status of running containers
docker-compose -f docker-compose.prod.yml ps

# View production logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Development Stack
Use this for real-time code changes (hot-reloading).
```powershell
# Start dev environment
docker-compose up --build

# Stop and remove all containers/networks
docker-compose down
```

## Database Utilities
```powershell
# Reset database and run seeds
docker exec -it cinenova-backend-1 npx prisma migrate reset --force
```
