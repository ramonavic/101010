import IORedis from 'ioredis'

export default class Redis {

    constructor() {

        this.connection = this.connect()
    }

    connect() {
        return new IORedis({
            port: 6379, // Redis port
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PASSWORD,
        });
    }

    async set(key, value) {
        this.connection.set(key, value)
    }

    async get(key) {
        const result = this.connection.get(key, (err, result) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Got from Redis', result);

                return result
            }
        });
    }

}


