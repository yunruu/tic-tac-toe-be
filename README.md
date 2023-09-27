# Tic-Tac-on-the-Toe
A server for a simple game of Tic-Tac-Toe with a unique twist – it's designed to be inclusive and accessible to screen reader users.

# Steps to Run Server (on Docker)
1. Install [Docker and Docker Compose](https://docs.docker.com/get-docker/)
2. Download the docker-compose.yaml file from this repository.
3. Create an .env file in the same directory as the docker-compose.yaml file, and add the following lines (you can change the port numbers accordingly if needed):

   `DB_PORT=27017`
   
   `HOST_PORT=3001`
5. Make sure you are still in this directory, then run the following command in the terminal: `docker compose up`
6. Your server is now up at `localhost:<HOST_PORT>`. If you are using 3001 as the HOST_PORT value, then your server will be running on localhost:3001

# Tech Stack
- NodeJS
- Express
- MongoDB
- Mongoose
- Docker
