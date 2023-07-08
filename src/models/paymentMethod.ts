import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize'
import DataBaseConnection from '../dataBase/sequelizeSingleton'

export class PaymentMethod extends Model<
  InferAttributes<PaymentMethod>,
  InferCreationAttributes<PaymentMethod>
> {
  declare id: CreationOptional<number>
  declare description: string
}

export const initPaymentMethod = async () => {
	const sequelize = await DataBaseConnection.getSequelizeInstance()

	PaymentMethod.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true
			},
			description: {
				type: new DataTypes.STRING(150),
				allowNull: false
			},
		},
		{
			sequelize,
			tableName: 'paymentMethod',
			timestamps: false
		}
	)
}
