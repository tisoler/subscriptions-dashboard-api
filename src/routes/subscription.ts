import { Request, Response } from 'express'
import { GetSubscriptions, SubscriptionPayload, UpdateSubscription } from '../handlers/subscription'
import { Subscription } from '../models/subscription'

export const RouteGetSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await GetSubscriptions()
    res.status(200).json(subscriptions)
  } catch(e) {
    console.log(e)
    res.status(400).send(e)
  }
}

export const RouteUpdateSubscription = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      res.sendStatus(400)
      return
    }
    const subscriptions = await UpdateSubscription(req.body as SubscriptionPayload)
    res.status(200).json(subscriptions)
  } catch(e) {
    console.log(e)
    res.status(400).send(e)
  }
}
