#!/bin/bash

# Thobe Store Docker Deployment Script
# This script simplifies building and deploying the Thobe Store application on Ubuntu

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CONTAINER_NAME="thobe-store"
IMAGE_NAME="thobe-app"
IMAGE_TAG="latest"
PORT=80
DATA_VOLUME="thobe-data"
APP_DIR="${APP_DIR:-.}"

# Functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed!"
        echo "Visit https://docs.docker.com/install/ to install Docker"
        exit 1
    fi
    print_success "Docker is installed"
    
    # Check if user can access docker without sudo
    if ! docker ps &> /dev/null; then
        print_error "Cannot access Docker daemon!"
        echo ""
        echo "This is usually caused by missing group permissions."
        echo ""
        print_warning "Fix with one of these options:"
        echo ""
        echo "Option 1 (Recommended): Add user to docker group"
        echo "  sudo usermod -aG docker \$USER"
        echo "  newgrp docker"
        echo "  Then exit and re-run: ./deploy.sh"
        echo ""
        echo "Option 2 (Quick): Run with sudo"
        echo "  sudo ./deploy.sh"
        echo ""
        exit 1
    fi
}

check_env_file() {
    if [ ! -f "$APP_DIR/.env" ]; then
        print_error ".env file not found!"
        echo "Creating .env from .env.example..."
        
        if [ -f "$APP_DIR/.env.example" ]; then
            cp "$APP_DIR/.env.example" "$APP_DIR/.env"
            print_warning "Please edit .env with your actual values (SMTP credentials, API keys, etc.)"
            echo "Run: nano $APP_DIR/.env"
            exit 1
        else
            print_error ".env.example not found either!"
            exit 1
        fi
    fi
    print_success ".env file exists"
}

create_data_volume() {
    if ! docker volume inspect "$DATA_VOLUME" &>/dev/null; then
        print_header "Creating Docker volume for database"
        docker volume create "$DATA_VOLUME"
        print_success "Volume created: $DATA_VOLUME"
    else
        print_success "Volume already exists: $DATA_VOLUME"
    fi
}

build_image() {
    print_header "Building Docker image"
    
    if docker build -t "$IMAGE_NAME:$IMAGE_TAG" "$APP_DIR"; then
        print_success "Image built successfully: $IMAGE_NAME:$IMAGE_TAG"
    else
        print_error "Failed to build image"
        exit 1
    fi
}

stop_existing_container() {
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_warning "Stopping existing container..."
        docker stop "$CONTAINER_NAME" 2>/dev/null || true
        docker rm "$CONTAINER_NAME" 2>/dev/null || true
        print_success "Container stopped and removed"
    fi
}

run_container() {
    print_header "Starting Docker container"
    
    docker run -d \
        --name "$CONTAINER_NAME" \
        -p "$PORT:80" \
        -p 3001:3001 \
        -v "$DATA_VOLUME:/app/data" \
        --env-file "$APP_DIR/.env" \
        --restart unless-stopped \
        --health-cmd="curl -f http://localhost:3001/api/health || exit 1" \
        --health-interval=30s \
        --health-timeout=3s \
        --health-retries=3 \
        --health-start-period=10s \
        "$IMAGE_NAME:$IMAGE_TAG"
    
    print_success "Container started: $CONTAINER_NAME"
}

verify_deployment() {
    print_header "Verifying deployment"
    
    # Wait for container to be ready
    echo "Waiting for container to be healthy..."
    sleep 5
    
    # Check if container is running
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_success "Container is running"
    else
        print_error "Container is not running!"
        docker logs "$CONTAINER_NAME"
        exit 1
    fi
    
    # Check health endpoint
    if curl -f http://localhost:3001/api/health &>/dev/null; then
        print_success "Backend API is responding"
    else
        print_warning "Backend API not responding yet (give it a moment)"
    fi
    
    # Check frontend
    if curl -f http://localhost/ &>/dev/null; then
        print_success "Frontend is accessible"
    else
        print_warning "Frontend not yet responding"
    fi
    
    # Check database
    if [ -f "$APP_DIR/data/ecommerce.db" ]; then
        print_success "Database file created"
    else
        print_warning "Database file not yet created (will be created on first API call)"
    fi
}

show_next_steps() {
    print_header "Deployment Complete!"
    
    echo -e "${GREEN}Your Thobe Store is now deployed!${NC}\n"
    
    echo "Next steps:"
    echo "  1. View logs:        docker logs -f $CONTAINER_NAME"
    echo "  2. Access frontend:  http://localhost"
    echo "  3. Check API:        curl http://localhost/api/health"
    echo "  4. Test email:       POST http://localhost/api/test-email"
    echo ""
    
    echo "Management commands:"
    echo "  Stop:                docker stop $CONTAINER_NAME"
    echo "  Start:               docker start $CONTAINER_NAME"
    echo "  Restart:             docker restart $CONTAINER_NAME"
    echo "  View logs:           docker logs $CONTAINER_NAME"
    echo "  Full logs (follow):  docker logs -f $CONTAINER_NAME"
    echo ""
    
    echo "Access from another machine:"
    LOCAL_IP=$(hostname -I | awk '{print $1}')
    echo "  http://$LOCAL_IP"
    echo ""
    
    echo -e "${YELLOW}Don't forget to:${NC}"
    echo "  1. Set APP_URL in .env to your actual server address"
    echo "  2. Verify SMTP settings: curl -X POST http://localhost/api/test-email"
    echo "  3. For HTTPS: see DOCKER_DEPLOYMENT.md for SSL setup"
}

# ============================================
# Main execution
# ============================================

case "${1:-deploy}" in
    deploy)
        print_header "Thobe Store Docker Deployment"
        check_docker
        check_env_file
        create_data_volume
        build_image
        stop_existing_container
        run_container
        verify_deployment
        show_next_steps
        ;;
    
    build)
        check_docker
        build_image
        ;;
    
    stop)
        print_header "Stopping container"
        docker stop "$CONTAINER_NAME"
        print_success "Container stopped"
        ;;
    
    start)
        print_header "Starting container"
        docker start "$CONTAINER_NAME"
        print_success "Container started"
        verify_deployment
        ;;
    
    restart)
        print_header "Restarting container"
        docker restart "$CONTAINER_NAME"
        print_success "Container restarted"
        verify_deployment
        ;;
    
    logs)
        echo -e "${BLUE}Showing container logs (Ctrl+C to exit)${NC}\n"
        docker logs -f "$CONTAINER_NAME"
        ;;
    
    status)
        print_header "Container Status"
        if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
            print_success "Container is running"
            echo ""
            docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        else
            print_error "Container is not running"
        fi
        ;;
    
    clean)
        print_header "Cleaning up"
        print_warning "This will remove the container and image (but keep your data)"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker stop "$CONTAINER_NAME" 2>/dev/null || true
            docker rm "$CONTAINER_NAME" 2>/dev/null || true
            docker rmi "$IMAGE_NAME:$IMAGE_TAG" 2>/dev/null || true
            print_success "Cleanup complete (data volume preserved)"
        fi
        ;;
    
    backup)
        print_header "Backing up database"
        BACKUP_DIR="$APP_DIR/backups"
        mkdir -p "$BACKUP_DIR"
        BACKUP_FILE="$BACKUP_DIR/ecommerce.db.$(date +%Y%m%d-%H%M%S).backup"
        
        docker run --rm -v "$DATA_VOLUME:/data" -v "$BACKUP_DIR:/backups" \
            alpine cp /data/ecommerce.db "/backups/$(basename "$BACKUP_FILE")"
        
        print_success "Database backed up: $BACKUP_FILE"
        ;;
    
    help|--help|-h)
        echo "Thobe Store Docker Deployment Script"
        echo ""
        echo "Usage: ./deploy.sh [command]"
        echo ""
        echo "Commands:"
        echo "  deploy   - Full deployment (build, stop old, start new) - DEFAULT"
        echo "  build    - Only build the Docker image"
        echo "  start    - Start the container"
        echo "  stop     - Stop the container"
        echo "  restart  - Restart the running container"
        echo "  status   - Show container status"
        echo "  logs     - Show container logs (follow mode)"
        echo "  clean    - Remove container and image (keeps data)"
        echo "  backup   - Backup the database"
        echo "  help     - Show this help message"
        ;;
    
    *)
        print_error "Unknown command: $1"
        echo "Run './deploy.sh help' for usage information"
        exit 1
        ;;
esac
