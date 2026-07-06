# Chess Tournament Management System

SvelteKit + PostgreSQL implementation for the assignment.

## Features

- Player CRUD with name, email, and rating
- Tournament CRUD with name, location, and date
- Add or remove players from tournaments
- Randomly pair tournament players and randomly select winners
- Store match results in PostgreSQL
- Display the top three rankings for each tournament

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a PostgreSQL database:

   ```sql
   CREATE DATABASE chess_tournament;
   ```

3. Run the schema:

   ```bash
   psql -d chess_tournament -f schema.sql
   ```

4. Create `.env` from `.env.example` and adjust the connection string:

   ```bash
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/chess_tournament
   ```

5. Start the app:

   ```bash
   npm run dev
   ```

Open the URL printed by Vite, usually `http://127.0.0.1:5173`.
