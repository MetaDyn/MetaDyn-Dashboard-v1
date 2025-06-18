# System Patterns

## Architecture
The system follows a client-server architecture with a decoupled frontend and backend.

- **Frontend (React):** A single-page application (SPA) responsible for rendering the UI and managing user interactions. It fetches data from the Node.js API server and communicates directly with Supabase for real-time updates.
- **Backend (Node.js/Express):** A simple API server that could be used for handling complex business logic or proxying requests to external services.
- **Database (Supabase):** Acts as the primary backend-as-a-service (BaaS), providing database, authentication, and real-time capabilities.
- **Game Client (Unity):** Interacts directly with Supabase to send and receive data, ensuring consistency between the game environment and the dashboard.

## Data Flow
1.  **Unity to Supabase:** The Unity client sends user and agent activity data directly to Supabase tables.
2.  **Supabase to React:** The React frontend subscribes to real-time changes in the Supabase database to keep the dashboard updated automatically.
3.  **React to Node.js API:** The frontend can make requests to the Node.js server for data that requires server-side processing.
