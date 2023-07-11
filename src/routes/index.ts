
import express, { Router } from 'express'
import { RouteGetSubscriptions, RouteUpdateSubscription } from './subscription'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { RouteGetIntervals } from './interval'

export const apiRouter: Router = express.Router()

// --- Swagger ---//
// Dynamic Swagger documentation
const options = {
	definition: {
	  openapi: '3.0.0',
	  info: {
			title: 'Subscriptions API',
			version: '1.0.0',
			license: {
				name: "MIT"
			}
	  },
	},
	apis: ['./src/routes/index.ts', './routes/index.js'],
}

const openapiSpecification = swaggerJsdoc(options)

apiRouter.use('/api-docs', swaggerUi.serve);
apiRouter.get('/api-docs', swaggerUi.setup(openapiSpecification))

// --- Routes --- //

/**
 * @openapi
 * /subscriptions:
 *    get:
 *     description: List of subscriptions
 *     tags:
 *       - subscriptions
 *     responses:
 *       200:
 *         description: Retrieves a list with all subscriptions.
*/

apiRouter.get('/subscriptions', RouteGetSubscriptions)


/**
 * @openapi
 * /subscriptions:
 *    put:
 *     description: Update subscription
 *     tags:
 *       - subscriptions
 *     requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *              idInterval:
 *                type: integer
 *              idPaymentMethod:
 *                type: integer
 *              amount:
 *                type: number
 *              nextDonation:
 *                type: date
 *              endingCardNumber:
 *                type: integer
 *            required:
 *              - id
 *    responses:
 *      200:
 *        description: Update subscription.
*/

apiRouter.put('/subscriptions', RouteUpdateSubscription)


/**
 * @openapi
 * /intervals:
 *    get:
 *     description: List of intervals
 *     tags:
 *       - intervals
 *     responses:
 *       200:
 *         description: Retrieves a list with all intervals.
*/

apiRouter.get('/intervals', RouteGetIntervals)
