import { FindAttributeOptions, Sequelize } from 'sequelize'
import { Interval } from '../models/interval'
import { PaymentMethod } from '../models/paymentMethod'
import { Subscription, initSubscription } from '../models/subscription'
import { Donation } from '../models/donation'

export type SubscriptionPayload = {
	id: number,
	amount: number,
	nextDonation: Date,
	endingCardNumber: number,
	interval: {
		id: number,
		description: string,
	},
	paymentMethod: {
		id: number,
		description: string,
	},
}

const SUBSCRIPTION_FIND_OPTIONS = {
	attributes: [
		'id',
		'amount',
		'nextDonation',
		'endingCardNumber',
		[ Sequelize.fn('SUM', Sequelize.col('donation.amount')), 'totalDonated' ],
		[ Sequelize.fn('MIN', Sequelize.col('donation.date')), 'firstDonationDate' ],
	] as FindAttributeOptions | undefined,
	include: [
		{
			model: Interval,
			attributes: ['id', 'description'],
			as: 'interval',
		},{
			model: PaymentMethod,
			attributes: ['id', 'description'],
			as: 'paymentMethod',
		}, { 
			model: Donation,
			attributes: [],
			as: 'donation',
		},
	],
	group: ['Subscription.id'],
}

export const GetSubscriptions = async (): Promise<Subscription[]> => {
	try {
		await initSubscription()
		const subscriptions = await Subscription.findAll(SUBSCRIPTION_FIND_OPTIONS)

		if (!subscriptions?.length) {
			console.log(`There are no subscriptions.`)
			return []
		}

		return subscriptions
	} catch (e) {
		throw e
	}
}

export const chargeSubscription = async (subscription: Subscription): Promise<boolean> => {
	return new Promise<boolean>((resolve) => {
		// process payment emulation
		setTimeout(() => {
			console.log(`Payment charge for subscription id: ${subscription.id}`)
			resolve(true)
		}, 1500)
	})
}

export const generateNextDonationDate = async (subscription: Subscription): Promise<Date> => {
	const interval = await Interval.findByPk(subscription.idInterval)
	if (!interval) {
		console.log(`Unexisting intervalfor subscription id: ${subscription.id}`)
		throw new Error (`Unexisting intervalfor subscription id: ${subscription.id}`)
	}

	const nextDonationDate = new Date()
	nextDonationDate.setDate(nextDonationDate.getDate() + interval.numberOfDays)
	return nextDonationDate
}

export const processNextDonation = async (
	newSubscriptionEntity: SubscriptionPayload,
	currentSubscriptionEntity: Subscription,
): Promise<Date> => {
	const nextDonationDateString = new Date(newSubscriptionEntity.nextDonation).toDateString()
	const todayString = new Date().toDateString()

	if (new Date(nextDonationDateString) < new Date(todayString)) {
		console.log(`Next donation date cannot be before today - Subscription id ${currentSubscriptionEntity.id}`)
		throw new Error(`Next donation date cannot be before today - Subscription id ${currentSubscriptionEntity.id}`)
	}
	// If next donation date was changed to today, evaluate donation payment
	if (nextDonationDateString === todayString) {
		// Verify if there is an existing donation for today, in this case the payment has already been charged
		const subscriptionDonations = await Donation.findAll({
			where: { idSubscription: newSubscriptionEntity.id, date: Sequelize.literal('DATE(date) = CURRENT_DATE()') }
		})

		if (!subscriptionDonations?.length) {
			// Payment has not already been charged, charge payment
			await chargeSubscription(currentSubscriptionEntity)
				.then(async () => {
					// Add donation record
					const newSubscriptionDonation = await Donation.create({
						idSubscription: currentSubscriptionEntity.id,
						amount: currentSubscriptionEntity.amount,
						date: new Date(),
					})
					await newSubscriptionDonation.save()
				})
				.catch(e => { 
					console.log(`Processing payment failure for subscription id ${currentSubscriptionEntity.id}`)
					console.log(`Error: ${e}`)
					throw new Error(e)
				})
		}

		// calculate next donation date
		return await generateNextDonationDate(currentSubscriptionEntity)
	}
	
	// keep same next donation date
	return newSubscriptionEntity.nextDonation
}

export const UpdateSubscription = async (payload: SubscriptionPayload): Promise<Subscription> => {
	try {
		const newSubscriptionEntity = { ...payload }
		const subscriptionToUpdate = await Subscription.findByPk(newSubscriptionEntity.id)
		if (subscriptionToUpdate) {
			// When nextDonationDate is updated it verifies if a payment/donation should be process
			if (new Date(subscriptionToUpdate.nextDonation).toDateString() != new Date(newSubscriptionEntity.nextDonation).toDateString()) {
				newSubscriptionEntity.nextDonation = await processNextDonation(newSubscriptionEntity, subscriptionToUpdate)
			}

			subscriptionToUpdate.idInterval = newSubscriptionEntity.interval?.id
			subscriptionToUpdate.idPaymentMethod = newSubscriptionEntity.paymentMethod?.id
			subscriptionToUpdate.amount = newSubscriptionEntity.amount
			subscriptionToUpdate.nextDonation = newSubscriptionEntity.nextDonation
			subscriptionToUpdate.endingCardNumber = newSubscriptionEntity.endingCardNumber
			
			await subscriptionToUpdate.save()

			// Get subscription again using find options to get totalDonated and firstDonationDate
			const updatedSubscription = await Subscription.findOne({
				...SUBSCRIPTION_FIND_OPTIONS,
				where: { id: subscriptionToUpdate.id },
			})
			if (!updatedSubscription) throw new Error('Error updating subscription')
			return updatedSubscription
		}

		console.log(`Subscription not found (id: ${payload.id}).`)
		throw new Error(`Subscription not found (id: ${payload.id}).`)
	} catch (e) {
		throw e
	}
}
