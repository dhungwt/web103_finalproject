# Milestone 4 Progress Report

## Milestone 4 Completion
Replace the blank before the percent sign with a number from 0 to 100.
Completion percentage for Milestone 4 - Unit 8: 100%

List each issue you completed this unit and the main file or folder where that work lives, one per line:
- [Frontend] Build home page to view all locations — client/src/pages/HomePage.jsx
- [Frontend] Build add/edit location form — client/src/pages/LocationFormPage.jsx
- [Frontend] Build location detail page — client/src/pages/LocationDetailPage.jsx
- [Frontend] Build edit location page — separate `/locations/:id/edit` route plus an "Edit Location" button on the detail page — client/src/pages/LocationDetailPage.jsx, client/src/App.jsx
- [Frontend] Create the login page — client/src/pages/LoginPage.jsx
- [Frontend] Gate the app behind auth and show the logged-in user (avatar, log out) in the header
- [Backend] User login via GitHub OAuth (Passport.js + Express sessions, serialize/deserialize by user id) — server/config/auth.js, server/routes/auth.js, server/server.js
- [Backend] Logout logic (session destroy + cookie clear) — server/routes/auth.js, client/src/services/authApi.js
- [Backend] Users table + user_locations join table, controllers and routes — server/controllers/controlUsers.js, server/routes/routesUsers.js
- Set up database schema and seed data — server/database/reset.js, server/config/reset.js
- [Frontend] Removed mock data so all pages fetch from the live backend — client/src/services
- Fill out the progress_report_4

Carried over to milestone 5 / not yet completed this unit (still open):
- [Frontend] Add tag selection to add/edit location form
- [Frontend] Add tag filtering on the home page
- [Frontend] Display tags on location card and detail page
- [Frontend] Add delete functionality for locations and items
- [Frontend] Build modal to add/edit a food item
- [Frontend] Build a persistent navigation bar with a link to "Add Location" (currently only reachable from inside the home page)
- [Deploy] Deploy app to Render — only the Postgres database is on Render so far, the app itself isn't deployed yet

## Features Completed This Unit
List each feature you completed and checked off in readme.md this unit, one per line:
- View all locations in bucket list
- Add a place in bucket list (tags not yet included)
- Build add/edit location form
- Build edit location page
- Added login page
- [Frontend] Show the logged-in user (avatar, log out) in the header
- User login via GitHub 
- Logout logic 