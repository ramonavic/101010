const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

import server from '../../api/index'

describe('Post Endpoints', () => {
    it('should create a new post', async () => {
        const res = await request(server)
            .get('/listen')
        expect(res.statusCode).toEqual(200)
    })
})