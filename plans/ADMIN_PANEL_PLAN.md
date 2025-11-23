# Admin Panel Implementation Plan

## Overview
The Admin Panel will serve as the central control hub for the Mardi Studio application. It will handle content management, user administration, analytics, and system configuration.

## Key Features

### 1. Content Management (CMS)
- **Inspiration Library Management**
  - Bulk upload handling (Drag & drop multiple files)
  - Automatic metadata extraction (AI tagging)
  - Artist attribution management
  - Categorization (Styles, Elements, Templates)
  - Moderation queue for user submissions

- **Template Management**
  - Featured template curation
  - Template versioning
  - Tag management

### 2. User Management
- User listing and search
- Role management (Admin, Editor, User)
- Subscription status monitoring
- Account suspension/deletion

### 3. Analytics Dashboard
- **Usage Metrics**: Daily active users, generations per day
- **Content Performance**: Top used templates, popular inspiration tags
- **System Health**: API latency, error rates (AI generation failures)

### 4. System Configuration
- Feature flags (enable/disable beta features)
- AI Model configuration (Prompt adjustments, model selection)
- Announcement banner management

## Technical Architecture

### Route Structure
- `/admin` - Dashboard overview
- `/admin/inspiration` - Inspiration CRUD
- `/admin/users` - User management
- `/admin/settings` - System config

### Security
- **Middleware Protection**: Strict role-based access control (RBAC)
- **Audit Logs**: Track all admin actions (who deleted what)

### Database Schema Updates (Proposed)
- `User` table: Add `role` (enum: 'user', 'admin', 'moderator')
- `Inspiration` table: Add `status` (enum: 'pending', 'approved', 'rejected')
- `AuditLog` table: `userId`, `action`, `targetId`, `timestamp`

## Phased Implementation

### Phase 1: Foundation & Content
1. Setup `/admin` route and layout with auth guard.
2. Implement **Inspiration Manager** (Grid view, Bulk Upload, Delete).
   - *Priority*: High (Requests for bulk import are pending).

### Phase 2: User & Analytics
1. User list view.
2. Basic analytics charts (Generations count).

### Phase 3: Advanced Config
1. Feature flags.
2. AI prompt tuning UI.

## Immediate Next Steps
1. Create `/app/admin` layout.
2. Implement `AdminGuard` component.
3. Build the **Bulk Inspiration Uploader** in the admin route to support the immediate need.

