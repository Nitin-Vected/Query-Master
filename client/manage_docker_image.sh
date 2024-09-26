#!/bin/bash

# Variables
IMAGE_NAME="test_1"  # Replace with your image name
DOCKERFILE_PATH="./Dockerfile"  # Replace with your Dockerfile path
NEW_IMAGE_TAG="latest"  # Set the desired tag for the new image
TAR_URL="./test_1.tar"  # Replace with the URL of the tar file
DOWNLOAD_PATH="./test_1.tar"  # Set the desired download path

# Function to check if Docker is running
check_docker() {
    if ! systemctl is-active --quiet docker; then
        echo "Docker is not running."
        return 1
    else
        echo "Docker is running. Stopping Docker..."
        sudo systemctl stop docker
        return 0
    fi
}

# Function to build the new Docker image
build_image() {
    echo "Building new Docker image: $IMAGE_NAME:$NEW_IMAGE_TAG from $DOCKERFILE_PATH"
    docker build -t $IMAGE_NAME:$NEW_IMAGE_TAG -f $DOCKERFILE_PATH .

    if [ $? -ne 0 ]; then
        echo "Failed to build image $IMAGE_NAME:$NEW_IMAGE_TAG."
        exit 1
    else
        echo "Image $IMAGE_NAME:$NEW_IMAGE_TAG built successfully."
    fi
}

# Function to download the tar file
download_tar() {
    echo "Downloading tar file from $TAR_URL"
    curl -o $DOWNLOAD_PATH $TAR_URL

    if [ $? -ne 0 ]; then
        echo "Failed to download $TAR_URL."
        exit 1
    else
        echo "Downloaded tar file to $DOWNLOAD_PATH."
    fi
}

# Main script execution
if check_docker; then
    echo "Docker has been stopped."
fi

build_image
download_tar

# Optional: Start Docker again if you want
echo "Starting Docker..."
sudo systemctl start docker
