require('dotenv').config()

module.exports = serverConfig = {
    ACCESS_TOKEN_SECRET: process.env.TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRE: process.env.TOKEN_EXPIRE,
    ApiHRM: process.env.ApiHRM,
    CAS_BASE_URL: process.env.CAS_BASE_URL,
    CAS_LOGOUT_URL: process.env.CAS_LOGOUT_URL,
    KEY: process.env.KeyHRM,
    URL:  process.env.PRODUCTION === 'http://localhost:4200'
}