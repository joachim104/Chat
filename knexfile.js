const config = require("./mysql_config/mysql_credentials_local");

module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      database: config.database,
      user:     config.user,
      password: config.password
    }
  }
};