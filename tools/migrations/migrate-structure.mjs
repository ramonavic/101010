// TODO 
// - Create migrations table with name, type, executed (bool)
// - iterate through structure files 
// - check if migration exists in DB and is executed
// - execute migrations
// - add executed at to migrations row

import fs from 'fs/promises'
import { dirname } from 'path'
import { nextTick } from 'process'
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
    console.log('got mjs file', file)

    const result = await migrate.checkIfExecuted('structure', name)
    console.log('is executed', result)
    if (result[0]?.executed_at) {

        // Dont execute file again
        continue
    }
    console.log('going to exec file')
    const { up } = await import(`./structure/${file}`)
    console.log(up)

    const migrationQuery = await up()

    if (migrationQuery.errno) {

        // TODO Break the loop and throw error?
        break
    }

    await migrate.updateMigration(name, 'structure')

    console.log('Migrated structure file: ', file)

}

process.exit(0)







