#!/bin/bash

# test-api.sh - Quick API testing script

echo "🧪 Testing CineFluent Railway API..."

API_BASE="https://cinefluent-api-production-5082.up.railway.app"

echo "1. Testing health endpoint..."
curl -s "$API_BASE/api/v1/health" | jq . || echo "Health check failed"

echo -e "\n2. Testing movies endpoint..."
curl -s "$API_BASE/api/v1/movies" | jq '.movies[0]' || echo "Movies endpoint failed"

echo -e "\n3. Testing categories endpoint..."
curl -s "$API_BASE/api/v1/categories" | jq . || echo "Categories endpoint failed"

echo -e "\n4. Testing languages endpoint..."
curl -s "$API_BASE/api/v1/languages" | jq . || echo "Languages endpoint failed"

echo -e "\n✅ API testing complete!"
