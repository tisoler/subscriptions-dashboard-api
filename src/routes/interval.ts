import { Request, Response } from 'express'
import { GetIntervals } from '../handlers/interval'

export const RouteGetIntervals = async (req: Request, res: Response) => {
  try {
    const intervals = await GetIntervals()
    res.status(200).json(intervals)
  } catch(e) {
    console.log(e)
    res.status(400).send(e)
  }
}
