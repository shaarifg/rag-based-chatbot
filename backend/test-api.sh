#!/bin/bash

BASE_URL="http://localhost:3000"

echo "🧪 Testing RAG Backend API"
echo "=========================="

# Health check
echo -e "\n1️⃣ Health Check"
curl -s "$BASE_URL/health" | jq '.'

# Create session
echo -e "\n2️⃣ Create Session"
SESSION_RESPONSE=$(curl -s -X POST "$BASE_URL/api/chat/session")
SESSION_ID=$(echo $SESSION_RESPONSE | jq -r '.sessionId')
echo "Session ID: $SESSION_ID"

# Send message
echo -e "\n3️⃣ Send Message"
curl -s -X POST "$BASE_URL/api/chat/message" \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"message\":\"What is the latest news in technology?\"}" | jq '.'

# Get history
echo -e "\n4️⃣ Get History"
curl -s "$BASE_URL/api/chat/history/$SESSION_ID" | jq '.'

# Get all sessions
echo -e "\n5️⃣ Get All Sessions"
curl -s "$BASE_URL/api/chat/sessions" | jq '.'

# Clear session
echo -e "\n6️⃣ Clear Session"
curl -s -X DELETE "$BASE_URL/api/chat/session/$SESSION_ID" | jq '.'

echo -e "\n✅ Tests completed!"
