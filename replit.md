# Meetdy Chat

## Overview
A React-based chat application built with Vite, TypeScript, and Tailwind CSS. The application appears to be a Vietnamese chat platform with features for messaging, contacts, and user management.

## Project Structure
- `src/` - Main source code
  - `api/` - API service layer for backend communication
  - `app/` - Redux store configuration
  - `components/` - Reusable UI components
  - `config/` - Application configuration
  - `constants/` - Constants and enums
  - `customfield/` - Custom form fields
  - `features/` - Feature modules (Chat, Home, etc.)
  - `hooks/` - Custom React hooks
  - `lib/` - Utility libraries
  - `models/` - TypeScript interfaces/models
  - `routes/` - Routing configuration
  - `utils/` - Utility functions
- `public/` - Static assets

## Tech Stack
- React 18 with TypeScript
- Vite as build tool
- Redux Toolkit for state management
- TanStack Query for server state
- Tailwind CSS v4 with custom styling
- Ant Design and Radix UI components
- Socket.io for real-time communication
- PeerJS for WebRTC video calls

## Development
- Run: `npm run dev` (starts Vite dev server on port 5000)
- Build: `npm run build` (outputs to `dist/`)

## Notes
- This is a frontend-only application that connects to an external backend API
- Backend API URL should be configured via environment variables
