import {
	CreationOptional,
	DataTypes,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize'
import DataBaseConnection from '../dataBase/sequelizeSingleton'
import { Subscription } from './subscription'

export class Donation extends Model<
  InferAttributes<Donation>,
  InferCreationAttributes<Donation>
> {
  declare id: CreationOptional<number>
	declare idSubscription: ForeignKey<Subscription['id']>
	declare amount: number
  declare date: Date
}

export const initDonation = async () => {
	const sequelize = await DataBaseConnection.getSequelizeInstance()

	Donation.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true
			},
			amount: {
				type: new DataTypes.NUMBER,
				allowNull: false
			},
			date: {
				type: new DataTypes.DATE,
				allowNull: false
			},
		},
		{
			sequelize,
			tableName: 'donation',
			timestamps: false
		}
	)
}
