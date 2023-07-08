import { Sequelize } from 'sequelize'
import { CreditCardBrand } from '../models/creditCardBrand'
import { Interval } from '../models/interval'
import { PaymentMethod } from '../models/paymentMethod'
import { Subscription, initSubscription } from '../models/subscription'
import { Donation } from '../models/donation'

export const GetSubscriptions = async (): Promise<Subscription[]> => {
	await initSubscription()
	const subscriptions = await Subscription.findAll({
		attributes: [
			'id',
			'amount',
			'nextDonation',
			'endingCardNumber',
			[ Sequelize.fn('SUM', Sequelize.col('donation.amount')), 'totalDonated' ]
		],
		include: [
			{
				model: Interval,
				attributes: ['id', 'description'],
				as: 'interval',
			},{
				model: PaymentMethod,
				attributes: ['id', 'description'],
				as: 'paymentMethod',
			},{
				model: CreditCardBrand,
				attributes: ['id', 'description'],
				as: 'creditCardBrand',
			}, { 
				model: Donation,
				attributes: [],
				as: 'donation',
			},
		],
		group: ['Subscription.id'],
	})

	// @ts-ignore
	subscriptions.forEach(sub => sub.totalDonated = sub['donation.totalDonated'])

  if (!subscriptions?.length) {
    console.log(`There are no subscriptions.`)
    return []
  }

  return subscriptions
}
