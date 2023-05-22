# Coin Funds Backend

This is the REST API of CoinFunds ,a platform where users can create campaigns and fund other campaigns.

## Download and Build on local

Clone the repository

```bash
    git clone https://github.com/Jaybee020/Coin-Funds.git
```

Cd into backend folder

```bash
    cd backend
```

After cloning this repo and installing dependencies. `cd` into this directory

```
cd server
```

### Environment Variables and Config

Set up a local .env file that contains the following configuration variables

```
uri=
MODE=DEV
PORT=8000
REDIS_PASSWORD=
REDIS_HOST=
REDIS_USERNAME=
REDIS_PORT=
MONGO_CONNECTION_STRING=
APP_EMAIL=
APP_EMAIL_PASS=
ACTIVATION_SECRET=
LOGIN_SECRET=
CIRCLE_API_KEY=SAND_API_KEY:
```

### Running the Server

To run the server on your machine, you compile the src files and run the server

```
npm start
```

Install node dependencies

```bash
   npm install
```

Compile Typescript

```bash
   npx tsc
```

To start the express server

```bash
  npm start
```

Open your local browser and verify the server is running with `http://localhost:3000/`

## API Reference

### Login User

```http
POST /auth/logins
```

All parameters are to be in the request body
| Parameter | Type | Description |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. email of user. |
| `password` | `string` | **Required**. password of user |

response.body

```bash
{   success: Boolean,
    message: String,
    active: Boolean,
    _id: String,
}
```

### Create User

```http
POST /auth/register
```

All parameters are to be in URL
| Parameter | Type | Description |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. email of user. |
| `password` | `string` | **Required**. password of user |
| `username` | `string` | **Required**. account address to get loan alerts of|

response.body

```bash
{
    success: Boolean,
    message: String,
    active: Boolean,
    _id: String,
}
```

### Sends Mail to User to help confirm email address

```http
GET /auth/send-verification-email/:email"
```

All parameters are to be in URL
| Parameter | Type | Description |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. email of user. |

This sends a confirmation token/link to the user's mail address.

response.body

```bash
{
    status:true,
    message:string
}
```

### Verifies activation token

```http
POST /auth/verify-email
```

This endpoint is used to verify the token sent to a user's mail
| Parameter | Type | Description |
| :-------- | :------- | :------------------------- |
| `activationToken` | `string` | **Required**. Activation token sent to user's email|

This verifies the token sent and activates the user's account.

response.body

```bash
{
    message:String
}
```

### Logout

```http
POST /auth/logout
```

This endpoint is used to logout a previously logged in user.

response.body

```bash
{message:String}
```

### View authenticated user details

```http
GET /user/auth"
```

Returns details of the authenticated user

response.body

```bash
{
     user: UserDocument,
    payoutRecipientDetails: Object,
    cardDetails: Object
}
```

### View user by id

```http
GET /user/:id
```

Returns details of the specified user
| Parameter | Type | Description |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. id of specified user|

response.body

```bash
{
    success:Boolean,
    data: UserDocument,
}
```

### View user by username

```http
GET /user/:username
```

Returns details of the specified user
| Parameter | Type | Description |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. username of specified user|

response.body

```bash
{
    success:Boolean,
    data: UserDocument,
}
```

### Get all created users

```http
GET /user/allUser
```

This returns all user data

response.body

```bash
{
    success:true,
    data:UserObject[]
}
```

### Add card to user

```http
PUT /user/addCard
```

This endpoint is used to link a new card to the user's profile.All parameters are in request body
| Parameter | Type | Description |
| :-------- | :------- | :------------------------- |
| `encryptedData` | `string` | **Required**. Encrypted card detalis|
| `expMonth` | `string` | **Required**. Two digit number representing the card's expiration month.|
| `expYear` | `string` | **Required**. Four digit number representing the card's expiration year|
| `name` | `string` | **Required**. Full name of the card or bank account holder.|
| `city` | `string` | **Required**. City portion of the address.|
| `country` | `string` | **Required**. Country portion of the address. Formatted as a two-letter country code specified in ISO 3166-1 alpha-2.|
| `line1` | `string` | **Required**. Line one of the street address.|
| `line2` | `string` | **Required**. Line two of the street address|
| `district` | `string` | **Required**. State / County / Province / Region portion of the address|
| `postalcode` | `string` | **Required**. | Postal / ZIP code of the address.
| `ipAddress` | `string` | **Required**. Single IPv4 or IPv6 address of user

This adds a new card to the user account.

response.body

```bash
{   success:Boolean
    data:String
}
```

### Add payout address to user

```http
PUT /user/addPayoutAddr
```

This endpoint is used to link a new card to the user's profile. All parameters are in request body
| Parameter | Type | Description |
| :-------- | :------- | :------------------------- |
| `chain` | `string` | **Required**. A blockchain that a given currency is available on.|
| `addr` | `string` | **Required**. An alphanumeric string representing a blockchain address.|

This adds a new card to the user account.

response.body

```bash
{   success:Boolean
    data:String
}
```

### View all Campaigns

```http
GET /campaign/
```

This endpoint is used to get all campaigns. The response is paginated. All parameters are request query params.

| Parameter    | Type     | Description                                           |
| :----------- | :------- | :---------------------------------------------------- |
| `pageLimit`  | `number` | **Required**. Number of data to be returned per page. |
| `pageNumber` | `number` | **Required**. Current page number to fetch            |

```bash
{
    success: Boolean
    data: CampaignDocument[]
}
```

### Get total campaign count

```http
GET /campaign/count
```

This endpoint is used to get total number of campaigns.

```bash
{   success: Boolean
    data: Number
}
```

### View campaign by id

```http
GET /campaign/:id
```

Returns details of the specified campaign
| Parameter | Type | Description |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. id of specified campaign|

response.body

```bash
{
    success:  Boolean,
    data: CampaignDocument,
}
```

```http
GET /campaign/user/
```

Returns details of the campaign of logged in user .

response.body

````bash
{
    success:  Boolean,
    data: CampaignDocument[],
}

```http
GET /campaign/user/:id
````

Returns details of the campaign of specified user od. The response is paginated
| Parameter | Type | Description |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. id of specified user|
| `pageLimit` | `number` | **Required**. Number of data to be returned per page. |
| `pageNumber` | `number` | **Required**. Current page number to fetch

response.body

```bash
{
    success:  Boolean,
    data: CampaignDocument[],
}
```

### Create a new campaign

```http
POST /campaign/
```

This endpoint is used to create a new campaign.

| Parameter       | Type     | Description                                                            |
| :-------------- | :------- | :--------------------------------------------------------------------- |
| `name`          | `string` | **Required**. Name of campaign                                         |
| `description`   | `string` | **Required**. Brief text description of campaign                       |
| `category`      | `string` | **Required**. Category of campaign                                     |
| `target`        | `Number` | **Required**. The amount needed to be raised in USD                    |
| `image`         | `string` | **Required**. Background image link of campaign                        |
| `deadlineDate`  | `string` | **Required**. Date for which funds needs to be gathered                |
| `receiveAlerts` | `string` | **Required**. Alert status for campaign creator on updates of campaign |

```bash
{   success: Boolean
    data: CampaignDocument
}
```

### Comment on a campaign

```http
POST /campaign/:id/comment
```

This endpoint is used to create a new comment on a particular campaign. The campaign id is passed as a URL parameter while the comment text is passed in the request body

| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `id`      | `string` | **Required**. Id of campaign         |
| `text`    | `string` | **Required**. Comment text to create |

```bash
{   success:Boolean
    data:CampaignDocument
}
```

### View all Donations

```http
GET /donation/
```

This endpoint is used to get all donation. The response is paginated. All parameters are request query params.

| Parameter    | Type     | Description                                           |
| :----------- | :------- | :---------------------------------------------------- |
| `pageLimit`  | `number` | **Required**. Number of data to be returned per page. |
| `pageNumber` | `number` | **Required**. Current page number to fetch            |

```bash
{
    success: Boolean
    data: DonationDocument[]
}
```

### Get total donation count

```http
GET /donation/count
```

This endpoint is used to get total number of donation.

```bash
{   success: Boolean
    data: Number
}
```

### View donation by id

```http
GET /donation/:id
```

Returns details of the specified campaign
| Parameter | Type | Description |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. id of specified donation|

response.body

```bash
{
    success:  Boolean,
    data: {DonationDocument,payment,paymentIntent} ,
}
```

### View donation by user(donated)

```http
GET /donation/user/:id/donated

```

This endpoint is used to fetch all the donation payment a user has made to several campaigns.The endpoint is paginated.
| Parameter | Type | Description |
| :----------- | :------- | :---------------------------------------------------- |
| `id` | `string` | **Required**. id of specified user|
| `pageLimit` | `number` | **Required**. Number of data to be returned per page. |
| `pageNumber` | `number` | **Required**. Current page number to fetch

```bash
{
    success:  Boolean,
    data: DonationDocument [],
}

```

### View donation count by user(donated)

```http
GET /donation/user/:id/donated/count

```

This endpoint is used to fetch the total number of donation payment sa user has made to several campaigns.
| Parameter | Type | Description |
| :----------- | :------- | :---------------------------------------------------- |
| `id` | `string` | **Required**. id of specified user|

```bash
{
    success:  Boolean,
    data: Number,
}

```

### View donation sum by user(donated)

```http
GET /donation/user/:id/donated/sum

```

This endpoint is used to fetch the total sum of donation payment sa user has made to several campaigns.
| Parameter | Type | Description |
| :----------- | :------- | :---------------------------------------------------- |
| `id` | `string` | **Required**. id of specified user|

```bash
{
    success:  Boolean,
    data: Number,
}
```

### View donation by user(received)

```http
GET /donation/user/:id/received

```

This endpoint is used to fetch all the donation payment a user has received from several campaigns.The endpoint is paginated.
| Parameter | Type | Description |
| :----------- | :------- | :---------------------------------------------------- |
| `id` | `string` | **Required**. id of specified user|
| `pageLimit` | `number` | **Required**. Number of data to be returned per page. |
| `pageNumber` | `number` | **Required**. Current page number to fetch

```bash
{
    success:  Boolean,
    data: DonationDocument [],
}

```

### View donation count by user(received)

```http
GET /donation/user/:id/received/count

```

This endpoint is used to fetch the total number of donation payment sa user has received from several campaigns.
| Parameter | Type | Description |
| :----------- | :------- | :---------------------------------------------------- |
| `id` | `string` | **Required**. id of specified user|

```bash
{
    success:  Boolean,
    data: Number,
}

```

### View donation sum by user(received)

```http
GET /donation/user/:id/donated/sum

```

This endpoint is used to fetch the total sum of donation payment sa user has received from several campaigns.
| Parameter | Type | Description |
| :----------- | :------- | :---------------------------------------------------- |
| `id` | `string` | **Required**. id of specified user|

```bash
{
    success:  Boolean,
    data: Number,
}
```

### Make a new donation via crypto

```http
POST /donation/crypto

```

This endpoint is used to make a new donation via crypto.
| Parameter | Type | Description |
| :----------- | :------- | :---------------------------------------------------- |
| `currency` | `string` | **Required**. Desired currency for the payments("ETH","BTC","USD") |
| `chain` | `string` | **Required**.Chain for payment|
| `amount` | `string` | **Required**.Amount of currency to be paid|

```bash
{
    success:  Boolean,
    data: {donationDocument,paymentIntent},
}
```

```http
POST /donation/:id/withdraw

```

This endpoint is used to withdraw an already made donation to a campaign.
| Parameter | Type | Description |
| :----------- | :------- | :---------------------------------------------------- |
| `id` | `string` | **Required**. Id of the specified donation |

```bash
{
    success:  Boolean,
    data: {withdrawalDoc},
}
```

### View all Payout

```http
GET /payout/
```

This endpoint is used to get all payout. The response is paginated. All parameters are request query params.

| Parameter    | Type     | Description                                           |
| :----------- | :------- | :---------------------------------------------------- |
| `pageLimit`  | `number` | **Required**. Number of data to be returned per page. |
| `pageNumber` | `number` | **Required**. Current page number to fetch            |

```bash
{
    success: Boolean
    data: PayoutDocument[]
}
```

### Get total payout count

```http
GET /payout/count
```

This endpoint is used to get total number of payout.

```bash
{   success: Boolean
    data: Number
}
```

### View payout by id

```http
GET /payout/:id
```

Returns details of the specified payout
| Parameter | Type | Description |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. id of specified payout|

response.body

```bash
{
    success:  Boolean,
    data: {PayoutDocument,payout} ,
}
```

### View payout by user

```http
GET /payout/user/:id

```

This endpoint is used to fetch all the donation payout a user has made to several campaigns.The endpoint is paginated.
| Parameter | Type | Description |
| :----------- | :------- | :---------------------------------------------------- |
| `id` | `string` | **Required**. id of specified user|
| `pageLimit` | `number` | **Required**. Number of data to be returned per page. |
| `pageNumber` | `number` | **Required**. Current page number to fetch

```bash
{
    success:  Boolean,
    data: PayoutDocument [],
}

```

### View payout count by user

```http
GET /payout/user/:id/count

```

This endpoint is used to fetch the total number of payouts a user has made to several campaigns.
| Parameter | Type | Description |
| :----------- | :------- | :---------------------------------------------------- |
| `id` | `string` | **Required**. id of specified user|

```bash
{
    success:  Boolean,
    data: Number,
}

```

### View payout sum by user

```http
GET /payout/user/:id/sum

```

This endpoint is used to fetch the total sum of donation payment sa user has made to several campaigns.
| Parameter | Type | Description |
| :----------- | :------- | :---------------------------------------------------- |
| `id` | `string` | **Required**. id of specified user|

```bash
{
    success:  Boolean,
    data: Number,
}
```

### Make a new payout via crypto

```http
POST /payout/

```

This endpoint is used to make a new payout via crypto.
| Parameter | Type | Description |
| :----------- | :------- | :---------------------------------------------------- |
| `currency` | `string` | **Required**. Desired currency for the payments("ETH","BTC","USD") |
| `campaignId` | `string` | **Required**.specific campaignId to make payout for|

```bash
{
    success:  Boolean,
    data: {PayoutDoc,payoutDetails},
}
```

## Demo

Working link at https://coin-funds.fly.dev/
