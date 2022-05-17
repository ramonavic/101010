import mysql from 'mysql2'

const credentials = {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    connectionLimit: 10,
    multipleStatements: true
}

let pool

export const initConnection = () => {
    pool = mysql.createPool(credentials)
    pool = pool.promise()

    console.log('creating new connection pool')
    return pool
}


export default class DB {
    constructor() {
        this.db = this.getConnection()
    }

    getConnection() {
        if (pool) {
            return pool
        }
        return initConnection()
    }

    async query(query, params) {
        console.log(query)
        console.log(params)
        try {
            const [results, fields] = await this.db.query(query, params)
            return results
        } catch (err) {
            console.error(err)
            return err
        }
    }

    async single(query, params) {
        try {
            const [results, fields] = await this.db.query(query, params)
            return results[0]
        } catch (err) {
            console.error(err)
            return err
        }
    }
}