
import express, { Router } from 'express'
import { RouteGetSubscriptions } from './subscription'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

export const apiRouter: Router = express.Router()

// --- Swagger ---//
// Documento Swagger dinámico
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

// --- Rutas --- //

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
