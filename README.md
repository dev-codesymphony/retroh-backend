# retroh-backend

# How to run this code with your own accounts, handle and tweet id

## 1. git clone https://github.com/dev-codesymphony/retroh-backend.git
## 2. cd retroh-backend
## 3. npm i
## 4. touch .env
## 5. nano .env
## 6. Paste the dummy env file and change your values
## 7. npm run start


### Dummy env File
NODE_ENV = development
PORT = 5000
MONGO_URI = mongodb+srv://username:passwords@clustername.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET = abc123
oauthCallback = "http://localhost:8080"
CONSUMER_SECRET="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
CONSUMER_KEY="XXXXXXXXXXXXXXXXXXXXXX"
REDIRECT = "http://localhost:5000/api/discord/callback"
DISCORD_CLIENT_ID = "XXXXXXXXXXX"
DISCORD_CLIENT_SECRET = "XXXXXXXXXXXXXXXXXXXX"
SERVER = "XXXXXXXXXXXXXXXXXXXXX"
ROLE = "XXXXXXXXXXXXXXXXXX"
BEARER_TOKEN = XXXXXXXXXXXXXXXXXXXXXXXXXX
HANDLE = elonmusk
TWEET = 1048541375577423873
ACCOUNT_OFFICIAL = 44196397
ACCOUNT_FOUNDER = 184890483
