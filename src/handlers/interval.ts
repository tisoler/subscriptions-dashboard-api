
import { Interval, initInterval } from '../models/interval'

export const GetIntervals = async (): Promise<Interval[]> => {
	await initInterval()
	const intervals = await Interval.findAll()

  if (!intervals?.length) {
    console.log(`There are no intervals.`)
    return []
  }

  return intervals
}
