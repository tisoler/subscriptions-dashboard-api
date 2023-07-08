import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize'
import DataBaseConnection from '../dataBase/sequelizeSingleton'

export class CreditCardBrand extends Model<
  InferAttributes<CreditCardBrand>,
  InferCreationAttributes<CreditCardBrand>
> {
  declare id: CreationOptional<number>
  declare description: string
}

export const initCreditCardBrand = async () => {
	const sequelize = await DataBaseConnection.getSequelizeInstance()

  CreditCardBrand.init(
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
      tableName: 'creditCardBrand',
			timestamps: false
    }
  )
}
