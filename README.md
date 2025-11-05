# 🍔 Tasty Food

This is the server of the tasty-food app. You can find the frontend part of this project in here [here](https://github.com/token-hub/tasty-food).

## 🚀 Getting Started

```bash
git clone https://github.com/token-hub/tasty-food-api.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. create a .env file

add the following:

PORT=3001  
CLIENT_URL=http://localhost:5174 // or where the tasty-food client is running  
SERVER_URL=http://localhost:3001

### 4. configure mongodb

#### creating a database

access mongosh first

```bash
mongosh
```

then create a database

```bash
use tastyfood
```

next is creating a user for the database

```bash
db.createUser({ user: <username>, pwd: passwordPrompt(), roles: [{role: "dbOwner", db: "tastyfood"}] })
```

enable the authorization next so that you are the only one can access it.

updating the mongodb.conf file

```bash
sudo nano /etc/mongod.conf
```

scroll down and look for the security and update it with this.

```bash
security:
    authorization: enabled
```

restart mongodb and test your credentials.

```bash
mongosh --port 27017 -u <username> -p --authenticationDatabase tastyfood
```

while we are still configuring mongodb, I also enable replica set for this project. let's do that next.

#### Enable replica set

updating the mongodb.conf file

```bash
sudo nano /etc/mongod.conf
```

scroll down until you see "replication" and replace it with this.

```bash
replication:
		replSetName: rs0
```

If you enable authorization do the following:  
in the terminal type this to create a keyfile.

```bash
openssl rand -base64 756 > ~/mongodb-keyfile
```

this will create a keyfile instead of plain password, next is updating the keyfile permission

```bash
chmod 600 ~/mongodb-keyfile
sudo chown mongodb:mongodb ~/mongodb-keyfile
```

move the file to /etc/next

```bash
sudo mv ~/mongodb-keyfile /etc/mongodb-keyfile
```

then update the mongodb .conf file

```bash
  security:
    authorization: enabled
    keyFile: /etc/mongodb-keyfile   # Linux/macOS path
```

Restart mongodb after

```bash
   sudo systemctl restart mongod
```

Next we need to initialize the replica set, do to that, login to mongosh

```bash
mongosh --port 27017 -u <username> -p --authenticationDatabase tasty
```

when authenticated, your the following command.

```bash
rs.initiate()
```

If you dont encounter any errors, well done :D to check the replica set type the following command

```bash
rs.status()
```

OKEY! after the long mongodb configuration, you will need to update the .env and add the following:

#### Database credentials

MONGODB_DATABASE=tastyfood  
MONGODB_USERNAME=<username>  
MONGODB_REPLICA_SET=rs0  
MONGODB_PASSWORD=<yourpassword>  
MONGODB_PORT=27017

### 5. configuring STMP

I am using google stmp for this project. it is use for send email verification. to use your own gmail account, you can follow this [instructions](https://nodemailer.com/usage/using-gmail).

once you have done that, open the .env file again and add the following:

SMTP_USER=<youremail>
SMTP_PASS=<yourpassword>

## 🚀 Usage

after all the configuration, you can just type the following command to start the server. enjoy!

```bash
npm run start
```
