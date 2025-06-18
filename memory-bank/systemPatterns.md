# System Patterns

## Architecture
The system follows a client-server architecture with a decoupled frontend and backend.

- **Frontend (React):** A single-page application (SPA) responsible for rendering the UI and managing user interactions. It fetches data from the Node.js API server and communicates directly with Supabase for real-time updates.
- **Backend (Node.js/Express):** A simple API server that could be used for handling complex business logic or proxying requests to external services.
- **Database (Supabase):** Acts as the primary backend-as-a-service (BaaS), providing database, authentication, and real-time capabilities.
- **Metaverse Connectors:** Modular components responsible for interfacing with specific metaverse platforms (e.g., a Roblox connector, a Spatial connector). These connectors will send data to Supabase.

## Data Flow
1.  **Metaverse to Supabase:** Connectors running within or alongside metaverse environments send player and agent data to Supabase tables via a secure API.
2.  **Supabase to React:** The React frontend subscribes to real-time changes in the Supabase database to keep the dashboard updated automatically.
3.  **React to Node.js API:** The frontend can make requests to the Node.js server for data that requires server-side processing.
