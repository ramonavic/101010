import crypto from 'crypto'

const algorithm = 'aes-256-cbc'
const pepper = process.env.ENCRYPTION_PEPPER
const secretKey = process.env.ENCRYPTION_SECRET

export default {

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
        const encryptedString = `enCRY=${iv.toString('hex')}-${encrypted.toString('hex')}`

        return encryptedString
    },

    decrypt(text) {

        // Constructed as encRY=#{iv}-${encryptedData}
        // enCRY=b259406bbaf052088fe9039a78faa411-1c450ce50bc79b919e7cef1c302e7675
        if (!text || !/^enCRY=/.test(text)) {
            console.log('No text given. Returning from decryption.')
            return
        }

        // Take the iv hex from the string and transform it back to bytes
        let iv = text.match(/enCRY=(.*)-/)[1]
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

            // If the value of the key is not an encrypted string
            if (!/^enCRY=/.test(textObject[key])) {
                decryptedTexts[key] = textObject[key]
                continue
            }

            const decrypted = this.decrypt(textObject[key])
            decryptedTexts[key] = decrypted
        }

        return decryptedTexts

    },

    hash(text) {

        // TODO add salt to hash in the DB so that each hash is unique. Don't feel like storing now atm.
        // Should also hash multiple times. 
        const hash = crypto.createHash('sha256', pepper).update(text).digest('hex')
        return hash
    }
}