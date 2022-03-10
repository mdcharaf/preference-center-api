# Preference Center API

CRUD User and Events

 ### Prerequsites
 * Make sure you have postgres database installed 
 * Go to config/database.ts and change the db parameters

 ### Backend API
 * To download all the package dependencies, run the command
     ```bash
     yarn
     ```
 * To run the application locally, run:
     ```bash
     yarn dev

 * To test the application locally, run:
     ```bash
     yarn test

 * Documentation:  (Refere to `docs.yaml` swagger file in project root)
     ```bash
     User@POST: 'http://localhost:8080/api/user/'
     User@GET: 'http://localhost:8080/api/user{"userId}/'
     User@DELETE: 'http://localhost:8080/api/user/{:userId}'
     Event@POST: 'http://localhost:8080/api/event'
