# Nodejs FES Template

# Environment vars
This project uses the following environment variables:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|NODE_ENV | enviroment | development|
|PORT | On which port to import | 5000|
|MONGO_URI | database Uri | mongodb+srv://aman:kNqfN0zfP0uOTEvm@cluster0.38n08.mongodb.net/retroh?retryWrites=true&w=majority|
|JWT_SECRET | random string | abc123
|oauthCallback | where to redirect after oauth succesfull | "http://54.176.83.139:8080"|
|CONSUMER_SECRET | consumer secret which is obtained after registering app on twitter developer portal|"4HpAyBDGstsC7D8zaXFFXSvibRJVrtFybFsgjDIKf1vfjQJ9G1"|
|CONSUMER_KEY | consumer key which is obtained after registering app on twitter developer portal|"FgewuYt89IB7lsVVqkmZfCUmJ"|
|REDIRECT | endpoint to redirect after oauth of discord| "http://54.176.83.139:5000/api/discord/callback"|
|DISCORD_CLIENT_ID | client id which is obtained after registering app on discord developer portal | "975998220314476556"|
|DISCORD_CLIENT_SECRET | client secret which is obtained after registering app on discord developer portal | "tbOg8fGQUH5cOoXNlS0LURtCtmsuqXuW"|
|SERVER | server id which is obtained after enabling developer mode in discord app | "844635266009268254"|
|ROLE | | role id which is obtained after enabling developer mode in discord app |
|BEARER_TOKEN | bearer token which is obtained after registering app on twitter developer portal | AAAAAAAAAAAAAAAAAAAAHYmcwEAAAAA90cSem8vDSYo%2Bq1oEQriqLZPkZE%3DIlEEy6p7i2n8p5Var3sD1B4YqLOw6y33Wq8k38Gu5Xet8jnhXK|
|HANDLE | which account you want user to mention | elonmusk|
|TWEET | which tweet id you want user to retweet | 1048541375577423873|
|ACCOUNT_OFFICIAL | which account you want user to follow | 44196397|
|ACCOUNT_FOUNDER | which account you want user to follow | 184890483|


# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version 8.0.0


# Getting started
- Clone the repository
```
git clone  <git hub template url> <project_name>
```
- Install dependencies
```
cd <project_name>
npm install
```
- Build and run the project
```
npm start
```
  Navigate to `http://localhost:8080`
