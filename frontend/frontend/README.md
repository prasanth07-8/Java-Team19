# Campus Resource Management System - Frontend

This is the frontend application for the Campus Resource Management System, built with React, Vite, and Tailwind CSS.

## Tech Stack

- **React (Vite)**: Fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **React Router**: Client-side routing.
- **Axios**: HTTP client for API requests.
- **React Query**: Data fetching and state management.
- **Chart.js**: Data visualization.
- **Context API**: Authentication state management.

## Project Structure

- `src/components`: Reusable UI components.
  - `layout`: Layout components (Sidebar, Navbar).
  - `common`: Generic components (Charts, Buttons).
- `src/context`: React Context providers (AuthContext).
- `src/pages`: Application pages (Dashboard, Login).
- `src/services`: API services and Axios configuration.
- `src/hooks`: Custom React hooks.
- `src/utils`: Utility functions.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Configuration

- **API Base URL**: Configured in `src/services/api.js`. Update `baseURL` to match your backend endpoint.
