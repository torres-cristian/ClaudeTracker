# Claude Tracker

This is a web application designed to track the usage of Anthropic's Claude AI accounts, specifically focusing on the "Max" subscription tier. It helps users monitor their interactions and manage multiple accounts to stay within the usage limits.

## About Claude AI

Claude is a family of large language models developed by Anthropic. They are designed to be helpful, harmless, and honest AI assistants for a wide range of tasks, from sophisticated dialogue and creative content generation to detailed instruction. The "Max" plan is a premium subscription for individual users with high-volume needs.

## Features

*   **Account Management:** Add, view, and manage multiple Claude Max accounts.
*   **Session Tracking:** Monitor the number of messages sent to keep track of usage limits.
*   **Detailed View:** Get a detailed view of each account's activity.
*   **Secure Access:** Uses Firebase for authentication to protect user data.

## Technologies Used

*   **Frontend:**
    *   React
    *   TypeScript
    *   Vite
    *   React Router
*   **Backend:**
    *   Firebase (for authentication and database)
*   **Styling:**
    *   CSS

## Setup and Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root of the project and add your Firebase configuration.
4.  Start the development server:
    ```bash
    npm run dev
    ```
