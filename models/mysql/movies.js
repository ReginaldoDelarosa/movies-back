import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    user: 'root1',
    port: '3307',
    password: '',
    database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
    static async getAll ({ genre }) {
        if (genre) {
            // eslint-disable-next-line no-use-before-define
            const lowerCaseGenre = genre.toLowerCase()
            const [genre] = await connection.execute('SELECT id, name FROM genre WHERE LOWER(name) = ?;', [lowerCaseGenre]
            )

            if (genre.length === 0) {
                return []
            }

            const [{ id }] = genre
            const [movies] = await connection.query(
                'SELECT m.title, m.year, m.director, m.duration, m.poster, m.rate, BIN_TO_UUID(m.id) as id, g.name as genre FROM movie m JOIN movie_genre mg ON m.id = mg.movie_id JOIN genre g ON g.id = mg.genre_id WHERE mg.genre_id = ?;',
                [id]
            )

            return movies
        }
        const [movies] = await connection.query(
            'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;'
        )
        return movies
    }

    static async getById ({ id }) {
        const [movies] = await connection.query(
            'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);',
            [id]
        )

        if (movies.length === 0) {
            return null
        }

        return movies
    }

    static async create ({ input }) {
        const {
            // eslint-disable-next-line no-unused-vars
            genre: genreInput, // genre is an array
            title,
            year,
            director,
            duration,
            rate,
            poster

        } = input
        const [uuidResult] = await connection.query('SELECT UUID() uuid;')
        const [{ uuid }] = uuidResult
        try {
            await connection.query('INSERT INTO movie (id, title, year, director, duration, rate, poster) VALUES (UUID_TO_BIN(?),?, ?, ?, ?, ?, ?);',
                [uuid, title, year, director, duration, rate, poster]

            )
        } catch (error) {
            console.error(error)
            throw new Error('Error creating movie')
        }

        const [movies] = await connection.query(
            'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);',
            [uuid]
        )

        return movies[0]
    }

    static async delete ({ id }) {

    }

    static async update ({ id, input }) {

    }
}
