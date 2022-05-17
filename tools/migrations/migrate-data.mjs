// Steps:
// - iterate through data folder and look for mjs files 
// - check if migration exists in DB and is executed
// - execute migrations
// - add row to db_migrations

import fs from 'fs/promises'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import * as migrate from './migrate.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const directory = await fs.readdir(`${__dirname}/data`)

for (const file of directory) {
    if (!/.*\.mjs$/.test(file)) {

        // Only exec MJS files. Since we assume these are the only migrations.
        continue
    }

    const name = file.split('.mjs')[0]
    const result = await migrate.checkIfExecuted('data', name)

    if (result[0]?.executed_at) {

        // Dont execute file again
        continue
    }
    const { up } = await import(`./data/${file}`)

    const migrationQuery = await up()
    if (migrationQuery.errno) {

        // Don't insert migration row because query failed. Error will be logged in db.js
        break
    }

    await migrate.updateMigration(name, 'data')

    console.log('Migrated data file: ', file)

}

process.exit(0)







