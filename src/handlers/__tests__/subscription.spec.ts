import chai from 'chai'
import sinon from 'sinon'
import {
  SubscriptionPayload,
  generateNextDonationDate,
  processNextDonation
} from '../subscription'
import * as SubscriptionModule from '../subscription'
import { Subscription } from '../../models/subscription'
import { Interval } from '../../models/interval'
import chaiAsPromised from 'chai-as-promised'
import { Donation } from '../../models/donation'

chai.use(chaiAsPromised)
const expect = chai.expect;

const TODAY = new Date()
const YESTERDAY = new Date()
YESTERDAY.setDate(TODAY.getDate() - 1)
const TOMORROW = new Date()
TOMORROW.setDate(TODAY.getDate() + 1)

const subscription = {
  id: 1,
  amount: 230,
  idInterval: 2,
  nextDonation: new Date('2023-08-19'),
  idPaymentMethod: 3,
  endingCardNumber: 4567,
} as Subscription

const interval = {
  id: 2,
  description: "Monthly",
  numberOfDays: 30,
} as Interval

const newSubscriptionEntity = {
  id: 1,
  amount: 230,
  nextDonation: new Date('2023-08-21'),
  interval:{ id: 3, description: 'Annual' },
  paymentMethod:{ id: 3, description: 'Visa' },
  endingCardNumber: 7897
} as SubscriptionPayload

describe('subscription handler', () => {
  describe('generateNextDonationDate', () => {
    it('generates NextDonationDate', async () => {
      sinon.stub(Interval, 'findByPk').callsFake(() => Promise.resolve(interval))

      const nexDonationDate = await generateNextDonationDate(subscription)
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() + 30)

      expect(nexDonationDate.toDateString()).to.equal(expectedDate.toDateString())
    })
  })

  describe('processNextDonation', () => {
    afterEach(() => {
      sinon.restore();
    })
  
    it('throws error when nextDonation < today', async () => {
      newSubscriptionEntity.nextDonation = YESTERDAY

      await expect(processNextDonation(newSubscriptionEntity, subscription))
        .to.be.rejectedWith('Next donation date cannot be before today - Subscription id 1')
    })

    it('gets nextDonationDate from newSubscriptionEntity when nextDonation > today', async () => {
      newSubscriptionEntity.nextDonation = TOMORROW
      const nexDonationDate = await processNextDonation(newSubscriptionEntity, subscription)

      expect(nexDonationDate).to.equal(TOMORROW)
    })

    it('generates nextDonationDate according to the interval when nextDonation = today and there already is a donation for today', async () => {
      sinon.stub(Donation, 'findAll').callsFake(
        () => Promise.resolve([{ id: 4, amount: 400, date: new Date() } as Donation])
      )

      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() + 10)
      const generateNextDonationDateStub = sinon.stub(SubscriptionModule, 'generateNextDonationDate')
      generateNextDonationDateStub.callsFake(() => Promise.resolve(expectedDate))

      newSubscriptionEntity.nextDonation = TODAY
      const nexDonationDate = await processNextDonation(newSubscriptionEntity, subscription)

      expect(generateNextDonationDateStub.calledWith(subscription)).to.equal(true)
      expect(nexDonationDate).to.equal(expectedDate)
    })

    it('generates nextDonationDate according to the interval when nextDonation = today and there is not donations for today', async () => {
      sinon.stub(Donation, 'findAll').callsFake(() => Promise.resolve([]))
      const chargeSubscriptionStub = sinon.stub(SubscriptionModule, 'chargeSubscription')
      chargeSubscriptionStub.callsFake(() => Promise.resolve(true))
      const newDontaion = {
        id: 9999,
        idSubscription: subscription.id,
        amount: subscription.amount,
        date: new Date(),
        save: () => {}
      } as Donation
      sinon.stub(Donation, 'create').callsFake(() => Promise.resolve(newDontaion))

      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() + 10)
      sinon.stub(SubscriptionModule, 'generateNextDonationDate').callsFake(() => Promise.resolve(expectedDate))

      newSubscriptionEntity.nextDonation = TODAY
      const nexDonationDate = await processNextDonation(newSubscriptionEntity, subscription)

      expect(chargeSubscriptionStub.calledWith(subscription)).to.equal(true)
      expect(nexDonationDate).to.equal(expectedDate)
    })
  })
})
