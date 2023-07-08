import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize'
import DataBaseConnection from '../dataBase/sequelizeSingleton'

export class Interval extends Model<
  InferAttributes<Interval>,
  InferCreationAttributes<Interval>
> {
  declare id: CreationOptional<number>
  declare description: string
}

export const initInterval = async () => {
	const sequelize = await DataBaseConnection.getSequelizeInstance()

	Interval.init(
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
			tableName: 'interval',
			timestamps: false
		}
	)
}
