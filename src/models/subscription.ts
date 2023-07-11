import {
	CreationOptional,
	DataTypes,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize'
import DataBaseConnection from '../dataBase/sequelizeSingleton'
import { Interval, initInterval } from './interval'
import { PaymentMethod, initPaymentMethod } from './paymentMethod'
import { Donation, initDonation } from './donation'

export class Subscription extends Model<
  InferAttributes<Subscription>,
  InferCreationAttributes<Subscription>
> {
	declare id: CreationOptional<number>
	declare amount: number
	declare idInterval: ForeignKey<Interval['id']>
  declare nextDonation: Date
	declare idPaymentMethod: ForeignKey<PaymentMethod['id']>
  declare endingCardNumber: CreationOptional<number>
}

export const initSubscription = async () => {
	const sequelize = await DataBaseConnection.getSequelizeInstance()

	Subscription.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true
			},
			idInterval: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false
			},
			idPaymentMethod: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false
			},
			amount: {
				type: new DataTypes.NUMBER,
				allowNull: false
			},
			nextDonation: {
				type: new DataTypes.DATE,
				allowNull: false
			},
			endingCardNumber: {
				type: new DataTypes.NUMBER,
				allowNull: false
			},
		},
		{
			sequelize,
			tableName: 'subscription',
			timestamps: false
		}
	)

	await initInterval()
	await initPaymentMethod()
	await initDonation()

	Subscription.hasOne(Interval, {
		foreignKey: 'id', sourceKey: 'idInterval', as: 'interval',
	})
	Subscription.hasOne(PaymentMethod, {
		foreignKey: 'id', sourceKey: 'idPaymentMethod', as: 'paymentMethod',
	})
	Subscription.hasMany(Donation, {
		sourceKey: 'id', foreignKey: 'idSubscription', as: 'donation',
	})
}
