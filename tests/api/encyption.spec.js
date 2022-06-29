// TODO move this to global test config file or smthg
require('dotenv').config()

import { describe, expect, it } from 'vitest'
import encryption from '../../api/encryption'

// NOTE make sure to only test with mocked or local SECRETS and KEYS
describe('encrypt function', () => {

    it('encrypts a string and returns a string', () => {
        const encrypted = encryption.encrypt('test')
        expect(encrypted).toBeTypeOf('string')
    })

    it(`doesn't encrypt when not given a param`, () => {
        const encrypted = encryption.encrypt()
        expect(encrypted).toBeUndefined()
    })

    it(`doesn't encrypt when not given a string param`, () => {
        const encrypted = encryption.encrypt(1)
        expect(encrypted).toBeUndefined()
    })
})

describe('decryption function', () => {

    // NOTE make sure to only test with mocked or local SECRETS and KEYS
    it(`decrypts when given a string that starts with enCRY=`, () => {
        const decrypted = encryption.decrypt('enCRY=b259406bbaf052088fe9039a78faa411-1c450ce50bc79b919e7cef1c302e7675')
        expect(decrypted).toBeTypeOf('string')
        expect(decrypted).toBe('Testman23')
    })

    it(`doesn't decrypt non encrypted strings`, () => {
        const decrypted = encryption.decrypt('bladiebla')
        expect(decrypted).toBeUndefined()
    })

    it(`doesn't decrypt anything else than a string`, () => {
        const decryptedNumber = encryption.decrypt(1)
        expect(decryptedNumber).toBeUndefined()

        const decryptedNothing = encryption.decrypt()
        expect(decryptedNothing).toBeUndefined()
    })
})