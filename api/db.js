import mysql from 'mysql2'
// import util from 'util'

// TODO change to connection pool

module.exports = class DB {
    constructor() {
        this.credentials = {
            host: process.env.MYSQL_HOST,
            database: process.env.MYSQL_DATABASE,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            connectionLimit: 10
        }

        console.log(this.credentials)

        this.pool = mysql.createPool(this.credentials)

        // Make it so that pool can use Promise logic
        this.db = this.pool.promise()
    }
    async query(query, params) {

        try {
            const [results, fields] = await this.db.query(query, params)
            return results
        } catch (err) {
            console.error(err)
            return
        }
    }

    async single(query, params) {
        try {
            const [results, fields] = await this.db.query(query, params)
            return results[0]
        } catch (err) {
            console.error(err)
            return
        }
    }
}