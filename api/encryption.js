import crypto from 'crypto'

const algorithm = 'aes-256-cbc'

// const iv = Buffer.from(crypto.randomBytes(16), "hex")

const secretKey = process.env.ENCRYPTION_SECRET
const salt = process.env.ENCRYPTION_SALT

export default {

    // TODO: nice to prepend something like 'enCRY=' to the encrypted string. 
    // Would make it easier to create a decryptMultiple function and to recognize encrypted fields in DB. 

    encrypt(text) {

        if (!text) {

            console.log('No text given. Returning from encryption.')
            return
        }

        const iv = crypto.randomBytes(16)

        // Creating cipher object
        let cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);

        // Encrypt and create a Buffer as output
        let encrypted = cipher.update(text);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        // Add IV to encrypted string and change to hex 
        // Example: enCRY=b259406bbaf052088fe9039a78faa411-1c450ce50bc79b919e7cef1c302e7675
        const encryptedString = `ehCRY=${iv.toString('hex')}-${encrypted.toString('hex')}`

        return encryptedString
    },

    decrypt(text) {

        // Constructed as encRY=#{iv}-${encryptedData}
        // enCRY=b259406bbaf052088fe9039a78faa411-1c450ce50bc79b919e7cef1c302e7675
        if (!text || !/^ehCRY=/.test(text)) {
            console.log('No text given. Returning from decryption.')
            return
        }

        // Take the iv hex from the string and transform it back to bytes
        let iv = text.match(/ehCRY=(.*)-/)[1]
        iv = Buffer.from(iv, 'hex')

        // Do the same with the encrypted string
        let encrypted = text.match(/-(.*)/)[1]
        encrypted = Buffer.from(encrypted, 'hex')

        // Create decipher object
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);

        let decrypted = decipher.update(encrypted)
        decrypted = Buffer.concat([decrypted, decipher.final()])

        return decrypted.toString();
    },


    /**
     * Loop through Object to decrypt encrypted strings.
     * 
     * @param  {} textObject=Object that can hold different data types. Typically retrieved from DB.
     * @returns {} Similar object as text object but with decrypted strings. 
     */
    decryptMultiple(textObject = {}) {
        const decryptedTexts = {}

        for (const key in textObject) {
            if (!textObject.hasOwnProperty(key)) {
                // Key must be inherited 
                continue
            }

            if (!textObject[key] || !/^ehCRY=/.test(textObject[key])) {
                decryptedTexts[key] = textObject[key]
                continue
            }

            const decrypted = this.decrypt(textObject[key])
            decryptedTexts[key] = decrypted
        }

        return decryptedTexts

    },

    hash(text) {
        const hash = crypto.createHash('sha256', salt).update(text).digest('hex')

        console.log('hashed ', text, 'to ', hash)

        return hash
    }
}