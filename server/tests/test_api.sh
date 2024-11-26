#!/bin/bash

# Base URL of the API
BASE_URL="http://localhost:5000/api"

# Test Data
IMAGE_TITLE="Test Image"
IMAGE_ALT_TEXT="This is a test image"
IMAGE_PATH="server/tests/testimg.webp"
COLLECTION_NAME="Test Collection"
COLLECTION_DESCRIPTION="This is a test collection"

# Function to check the HTTP status and validate response content
check_status_and_content() {
    HTTP_STATUS=$1
    RESPONSE_CONTENT=$2
    STEP_DESCRIPTION=$3

    if [[ $HTTP_STATUS -eq 200 || $HTTP_STATUS -eq 201 || $HTTP_STATUS -eq 204 ]]; then
        echo "[PASS] $STEP_DESCRIPTION"
        if [[ -n "$RESPONSE_CONTENT" ]]; then
            echo "Response: $RESPONSE_CONTENT"
        fi
    else
        echo "[FAIL] $STEP_DESCRIPTION (HTTP Status: $HTTP_STATUS)"
        echo "Response: $RESPONSE_CONTENT"
        exit 1
    fi
}

# Step 1: Add a new image
echo "Adding a new image..."
RESPONSE=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/images" \
    -H "Content-Type: multipart/form-data" \
    -F "image=@$IMAGE_PATH;type=image/webp" \
    -F "title=$IMAGE_TITLE" \
    -F "altText=$IMAGE_ALT_TEXT")
HTTP_STATUS=$(echo "$RESPONSE" | tail -c 4)
IMAGE_ID=$(echo "$RESPONSE" | jq -r '.id')
check_status_and_content "$HTTP_STATUS" "$RESPONSE" "Add a new image"
echo "Added Image ID: $IMAGE_ID"

# Step 2: Create a new collection
echo "Creating a new collection..."
RESPONSE=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/collections" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "'"$COLLECTION_NAME"'",
        "description": "'"$COLLECTION_DESCRIPTION"'"
    }')
HTTP_STATUS=$(echo "$RESPONSE" | tail -c 4)
COLLECTION_ID=$(echo "$RESPONSE" | jq -r '.id')
check_status_and_content "$HTTP_STATUS" "$RESPONSE" "Create a new collection"
echo "Created Collection ID: $COLLECTION_ID"

# Step 3: Add the image to the collection
echo "Adding image to the collection..."
RESPONSE=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/collections/$COLLECTION_ID/images/$IMAGE_ID" \
    -H "Content-Type: application/json")
HTTP_STATUS=$(echo "$RESPONSE" | tail -c 4)
check_status_and_content "$HTTP_STATUS" "$RESPONSE" "Add the image to the collection"

# Step 4: Retrieve all images
echo "Retrieving all images..."
RESPONSE=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/images" \
    -H "Content-Type: application/json")
HTTP_STATUS=$(echo "$RESPONSE" | tail -c 4)
check_status_and_content "$HTTP_STATUS" "$RESPONSE" "Retrieve all images"

# Step 5: Retrieve all collections
echo "Retrieving all collections..."
RESPONSE=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/collections" \
    -H "Content-Type: application/json")
HTTP_STATUS=$(echo "$RESPONSE" | tail -c 4)
check_status_and_content "$HTTP_STATUS" "$RESPONSE" "Retrieve all collections"

# Step 6: Reorder images in the collection
echo "Reordering images in the collection..."
RESPONSE=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/collections/$COLLECTION_ID/reorder" \
    -H "Content-Type: application/json" \
    -d '{
        "orderData": [
            { "imageId": '"$IMAGE_ID"', "order": 1 }
        ]
    }')
HTTP_STATUS=$(echo "$RESPONSE" | tail -c 4)
check_status_and_content "$HTTP_STATUS" "$RESPONSE" "Reorder images in the collection"

# Step 7: Remove the image from the collection
echo "Removing the image from the collection..."
RESPONSE=$(curl -s -w "%{http_code}" -X DELETE "$BASE_URL/collections/$COLLECTION_ID/images/$IMAGE_ID" \
    -H "Content-Type: application/json")
HTTP_STATUS=$(echo "$RESPONSE" | tail -c 4)
check_status_and_content "$HTTP_STATUS" "$RESPONSE" "Remove the image from the collection"

# Step 8: Delete the image
echo "Deleting the image..."
RESPONSE=$(curl -s -w "%{http_code}" -X DELETE "$BASE_URL/images/$IMAGE_ID" \
    -H "Content-Type: application/json")
HTTP_STATUS=$(echo "$RESPONSE" | tail -c 4)
check_status_and_content "$HTTP_STATUS" "$RESPONSE" "Delete the image"

# Step 9: Delete the collection
echo "Deleting the collection..."
RESPONSE=$(curl -s -w "%{http_code}" -X DELETE "$BASE_URL/collections/$COLLECTION_ID" \
    -H "Content-Type: application/json")
HTTP_STATUS=$(echo "$RESPONSE" | tail -c 4)
check_status_and_content "$HTTP_STATUS" "$RESPONSE" "Delete the collection"

echo "API testing completed!"
