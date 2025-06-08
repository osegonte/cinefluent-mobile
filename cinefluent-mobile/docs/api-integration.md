# API Integration Guide

This document explains how the CineFluent frontend integrates with the backend API.

## API Client Setup

The API client is configured in `src/lib/api.ts` with:
- Base URL configuration
- Authentication handling
- Error handling
- TypeScript interfaces

## Authentication Flow

1. User logs in via `POST /api/v1/auth/login`
2. JWT token stored in localStorage
3. Token included in subsequent requests
4. Auto-refresh handling (planned)

## Key Endpoints

- `GET /api/v1/movies` - Movie catalog
- `GET /api/v1/auth/me` - User profile
- `POST /api/v1/progress/update` - Learning progress

## Error Handling

All API calls include proper error handling with user-friendly messages.

## Development

Set `VITE_API_BASE_URL` in `.env.local` to your backend URL.
