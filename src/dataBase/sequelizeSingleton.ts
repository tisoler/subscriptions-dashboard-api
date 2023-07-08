import { Sequelize } from 'sequelize'

export default class DataBaseConnection {
  static sequelize: Sequelize

  static getSequelizeInstance = async (): Promise<Sequelize> => {
    if (!DataBaseConnection.sequelize) {
      const { DATA_BASE_HOST, DATA_BASE_PORT, DATA_BASE_USER, DATA_BASE_PASSWORD, DATA_BASE } = process.env
      if (!DATA_BASE_USER || !DATA_BASE_PASSWORD || !DATA_BASE) {
        console.error('error: some env vars is/are missing (DATA_BASE_USER, DATA_BASE_PASSWORD, DATA_BASE)')
        throw Error('error: some env vars is/are missing (DATA_BASE_USER, DATA_BASE_PASSWORD, DATA_BASE)')
      }

      DataBaseConnection.sequelize = new Sequelize(DATA_BASE, DATA_BASE_USER, DATA_BASE_PASSWORD, {
        host: DATA_BASE_HOST || `localhost`,
        port: DATA_BASE_PORT ? parseInt(DATA_BASE_PORT) : 3306,
        dialect: 'mysql',
        pool: {
          max: 10,
          min: 0,
          idle: 10000
        },
      })
    }

    try {
      await DataBaseConnection.sequelize.authenticate();
      console.log('DB connection has been established successfully.')
    } catch (error) {
      console.error('Unable to connect to the database:', error)
      throw Error(`Unable to connect to the database: ${error}`)
    }

    return DataBaseConnection.sequelize
  }
}
