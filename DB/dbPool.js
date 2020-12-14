// DB Connection Pool
//
const config = require('config');

// Get needed settings
const dbConfig = config.get('Settings.dbConfig')
const sql = require('mssql')

const poolPromise = new sql.ConnectionPool(dbConfig.dbConnection)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
  sql, poolPromise
}
 
