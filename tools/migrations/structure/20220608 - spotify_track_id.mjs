import DB from '../../../api/db.mjs'

const db = new DB()

export const up = () => {
    db.query(`ALTER TABLE \`db\`.\`playlist_tracks\`
    ADD COLUMN \`spotify_id\` varchar(60) NOT NULL AFTER \`duration_ms\``)
}

