# Family Diary - Codebase Overview

## Project Structure
- **index.html** (976 lines) - Family Diary (Multi-family deployable)
- **kingsland.html** (734 lines) - Derek's Activity Notepad (Original)
- **alerts.html** (660 lines) - Derek's Alerts (Original)

## Technology Stack
- **Frontend**: HTML5, Vanilla JavaScript
- **Backend**: Firebase Realtime Database
- **Fonts**: Google Fonts (Lora, Nunito)

## Key Features (from code analysis)
- Message/note creation with timestamps
- Deleted items tracking
- Expired/time-limited notes
- Date and time selection
- Font size preferences (localStorage)
- Print functionality with custom documents
- Tab-based navigation
- Drag/touch support
- HTML escaping for security
- Local storage for settings

## Main Functions (kingsland.html - Activity Notepad)
- `sg(k)` / `ss(k,v)` - localStorage get/set with try-catch
- `el(id)` - getElementById shortcut
- `cap(s)` - Capitalize strings
- `sf(s)` - Sanitize strings
- `today()` - Get current date in ISO format
- `ts(t)` / `ds(t)` - Format time/date for display
- `esc(s)` - HTML escape strings
- `fmtD(iso)` / `fmtTime(t)` - Format date/time with locales
- `buildBadge()` - Create timestamp badge
- `loadFontSizes()` / `saveFontSizes()` - Font size persistence
- `setUser(u)` / `setTab(t)` - UI state management
- `toggleDatePicker()` - Date selection UI
- `sendMessage()` - Save new messages
- `listen()` - Start Firebase listener
- `expireOldDated()` / `migrateExpiredItems()` - Handle time-expired notes
- `sortedMessages()` - Sort messages by date
- `renderMsgs()` / `msgHTML()` - Render messages to UI
- `openEdit(k)` / `saveEdit(k)` / `cancelEdit(k)` - Edit UI flow
- `delMsg(k)` / `restore(k)` / `purge(k)` - Message lifecycle
- `printTab()` - Print functionality
- Drag/swipe handlers: `sd()`, `md()`, `ad()`, `ed()`, `fd()`

## Firebase References
Uses Firebase Realtime Database at these paths:
- `messages` - Active messages
- `deleted` - Deleted messages (recoverable)
- `expired` - Time-expired messages
- Structured by ISO date and unique keys

## To Understand Better
1. Find Firebase configuration (API key, project ID)
2. Understand the main HTML structure and body elements
3. Review the actual custom JavaScript code (after Firebase bundle)
4. Understand the schema of messages in Firebase
