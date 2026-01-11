# Meetdy Chat

## Overview
A React-based chat application built with Vite, TypeScript, and Tailwind CSS v4. The application is a Vietnamese chat platform (similar to Lark/Microsoft Loop) with features for messaging, contacts, video calls, and user management.

## Project Structure
- `src/` - Main source code
  - `api/` - API service layer for backend communication
  - `app/` - Redux store configuration
  - `components/` - Reusable UI components
    - `ui/` - shadcn/ui components (Button, Dialog, Select, etc.)
  - `config/` - Application configuration
  - `constants/` - Constants and enums
  - `customfield/` - Custom form fields (migrated to shadcn)
  - `features/` - Feature modules
    - `Chat/` - Core messaging features
    - `Friend/` - Contact management
    - `Home/` - Landing pages
    - `Account/` - Authentication
    - `Admin/` - Admin panel (still uses antd)
    - `CallVideo/` - WebRTC video calling
  - `hooks/` - Custom React hooks
  - `lib/` - Utility libraries (cn utility for class merging)
  - `models/` - TypeScript interfaces/models
  - `routes/` - Routing configuration
  - `utils/` - Utility functions

## Tech Stack
- React 18 with TypeScript
- Vite 7 as build tool
- Redux Toolkit for state management
- TanStack Query for server state
- Tailwind CSS v4 with modern design system
- shadcn/ui components (migrated from Ant Design)
- Radix UI primitives
- lucide-react for icons
- Socket.io for real-time communication
- PeerJS for WebRTC video calls
- sonner for toast notifications

## UI Migration Status (January 2026)
- Migrated from Ant Design (antd) to shadcn/ui with Tailwind CSS v4
- Applied modern Lark/Loop-inspired design
- All @ant-design/icons replaced with lucide-react in user-facing components
- Admin section still uses antd (lower priority)
- All user-facing components now use shadcn/ui

## Recently Migrated Components
- FileItem, ReplyBlock, InfoTitle, PinItem, ConversationAvatar
- ListReaction, ModalCreateGroup, ModalAddMemberToConver
- CallVideo ActionNavbar (now uses shadcn Button instead of antd Menu)
- ShortMessage (FcBarChart → BarChart3 from Lucide)
- GroupCard (BsThreeDotsVertical → MoreVertical from Lucide, improved card styling)
- UserMessage toast notifications fixed to use sonner pattern

## Development
- Run: `npm run dev` (starts Vite dev server on port 5000)
- Build: `npm run build` (outputs to `dist/`)

## Notes
- This is a frontend-only application that connects to an external backend API
- Backend API URL should be configured via `VITE_API_URL` environment variable
- All UI text is in Vietnamese - maintain language consistency

## User Preferences
- Use shadcn "new-york" style preset
- Prefer lucide-react icons over @ant-design/icons
- Use `--legacy-peer-deps` flag when installing packages due to peer dependency conflicts
- Maintain Vietnamese language throughout the UI
