module.exports = {
    Host: process.env.DB_HOST,
    USER: process.env.DB_USER,
    Password: process.env.DB_PASSWORD,
    Database: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
    Port: 5432,
    pool: {
      max: 15,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }