
## Getting Started

First, install all dependencies:

```bash
yarn install
```

Then, run the development server locally:

```bash
npm run start:dev
# or
yarn start:dev
# or
pnpm start:dev
```

Open [http://localhost:3023](http://localhost:3023) with your browser to see the result (e.g. http://localhost:3023/subscriptions).

## Other scripts:

You can run this one to generate the files to be deployed. Files will be placed in the folder ```dist```
``` bash
yarn build
or
yarn buildWin
```

You can run the app from the built files runnig:
``` bash
yarn start
```

You can also run the app with nodemon (that automatically reflects changes) from the built files runnig:
``` bash
yarn dev
```

This project includes EsLint so you can check for lint errors or warnings running:
``` bash
yarn lint
```
To fix the lint issues automatically please run:
``` bash
yarn format
```

Handler methods include some unit tests to ensure their logic. Tests are implemented with mocha, chai and sinon.
To run all tests you have to execute:
``` bash
yarn test
```

## Environment variables:

You have to include a file called ```.env``` that contains the env variables.
You can take the file content from ```.env.example```, the keys ```API_PORT, FRONTEND_URL, DATA_BASE_HOST, DATA_BASE_PORT, DATA_BASE_USER, DATA_BASE_PASSWORD, DATA_BASE``` are required.

## Data base connection and modeling

This API stores and retrieves data from a mysql database. Connection data should be included in the .env file.
Data model in the server side represented and handled with ```sequelize``` ORM library.

## About the scenario in the documentation (figma)

"Assume there is a background service that charges Subscriptions on the correct date. How do you avoid race conditions creating duplicate Donations when changing the Subscription date to today?"

In both, ```subscription update handler``` and ```background service```, we need to check:
1- if the new ```nextDonation``` value is different to the value in the current entity record (subscription) - if it has been updated to today recently we don't have to proceed with the update, we use ```nextDonation``` field value as timestamp to resolve concurrency (```UpdateSubscription``` handler in ```src\handlers\subscription.ts```),
2- then, check if the new ```nextDonation``` value is today, in this case we should probably process the payment (```processNextDonation``` method in ```src\handlers\subscription.ts```),
3- finally, we have to check if there is an existing donation with ```date = today```. Again, we use donation record dates as timestamps to avoid duplicating donations (```processNextDonation``` method in ```src\handlers\subscription.ts```).
