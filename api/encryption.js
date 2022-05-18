import crypto from 'crypto'

const algorithm = 'aes-256-ctr'

const iv = Buffer.from(crypto.randomBytes(16), "hex")
const secretKey = process.env.ENCRYPTION_SECRET
const salt = process.env.ENCRYPTION_SALT

export default {
    encrypt(text) {
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
        let encryptedData = cipher.update(text, "utf-8", "hex");
        encryptedData += cipher.final("hex");

        console.log('decrypted', text, 'encrypted', encryptedData)
        return encryptedData;
    },

    decrypt(text) {
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
        let decryptedData = decipher.update(text, "hex", "utf-8");
        decryptedData += decipher.final("utf8");

        console.log('encrypted', text, 'decrypted', decryptedData)

        return decryptedData;
    },

    hash(text) {
        const hash = crypto.createHash('sha256', salt).update(text).digest('hex')

        console.log('hashed ', text, 'to ', hash)

        return hash
    }
}