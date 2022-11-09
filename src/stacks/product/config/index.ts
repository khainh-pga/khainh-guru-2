import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const env = process.env.NODE_ENV || process.env.ENVIRONMENT || 'development'
const state = process.env.STATE || 'dev'
const tableName = process.env.TABLE || `product-${state}`

const configs = {
    base: {
      env,
      state,
      tableName
    },
    test: {
      
    },
    staging: {

    },
    production: {

    }
}

const config = Object.assign(configs.base, configs[env])

export default config