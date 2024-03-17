# GotBot Coding Challenge

This project has a frontend and backend folder. Follow these steps to run the project locally:

## Setup

### Clone the repo:

```
git clone https://github.com/Ndohjapan/gotbot-challenge.git
```

### Navigate to the frontend folder and create a .env file with:

```
VITE_BACKEND_URL="http://localhost:5001/api/1.0"
VITE_FRONTEND_URL="http://localhost:5173"
```

### Navigate to the backend folder and create a .env file with:

```
CLIENT_URL=http://localhost:5173/verify/
CLOUDINARY_API_KEY=183515467334351
CLOUDINARY_API_SECRET=an5k38ts6Qt2keTXcMrXQ9LM_Ik
CLOUDINARY_CLOUD_NAME=lcu-feeding
DB_URL=mongodb://mongodb:27017/kota
JWT_SECRET=ewinfewnjifiewjbnfiewenwinfewinjewew
REDISCLOUD_URL=redis
ZEPTOMAIL_API_KEY=yA6KbHtS7Q2iwj8FQEM81pOD84o1/6gxjH/ktS7jfcEkLtm33KFtgRRodIe5JjbeiofZta5Za9gYdYC4udAKesYzYdYAepTGTuv4P2uV48xh8ciEYNYmhZSsALIWGqRMchsiCSo2RPEjWA==
ZEPTOMAIL_DOMAIN=noreply@geelgeworden.nl
```

## Run the Project

### Build the docker compose file:

```
docker compose -f 'docker-compose.dev.yml' build
```

### Start the containers:

```
docker compose -f 'docker-compose.dev.yml' up -d
```

The frontend should now be running on [http://localhost:5173](http://localhost:5173) and the backend should run on [http://localhost:5001](http://localhost:5001)
