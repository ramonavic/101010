// Steps:
// - Create migrations table with name, type, executed_at 
// - iterate through structure files 
// - check if migration exists in DB and is executed
// - execute migrations
// - add executed at to migrations row

import fs from 'fs/promises'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import * as migrate from './migrate.mjs'


await migrate.validateOrCreateMigrationsTable()

const __dirname = dirname(fileURLToPath(import.meta.url))
const directory = await fs.readdir(`${__dirname}/structure`)

for (const file of directory) {
    if (!/.*\.mjs$/.test(file)) {

        // Only exec MJS files. Since we assume these are the only migrations.
        continue
    }

    const name = file.split('.mjs')[0]
    const result = await migrate.checkIfExecuted('structure', name)

    if (result[0]?.executed_at) {

        // Dont execute file again
        continue
    }

    const { up } = await import(`./structure/${file}`)
    const migrationQuery = await up()

    if (migrationQuery.errno) {

        // Don't insert migration row because query failed. Error will be logged in db.js
        break
    }

    await migrate.updateMigration(name, 'structure')

    console.log('Migrated structure file: ', file)

}

process.exit(0)







