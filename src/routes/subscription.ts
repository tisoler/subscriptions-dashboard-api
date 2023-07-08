import { Request, Response } from 'express'
import { GetSubscriptions } from '../handlers/subscription'

export const RouteGetSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await GetSubscriptions()
    res.status(200).json(subscriptions)
  } catch(e) {
    console.log(e)
    res.status(400).send(e)
  }
}
