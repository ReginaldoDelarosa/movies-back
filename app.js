import express, { json } from 'express'
import { createMoviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

// ES Modules experimental feature import JSON
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('movies.json', 'utf8'))

// import JSON ES Modules

export const createApp = ({ movieModel }) => {
    const app = express()

    app.use(json())
    app.use('/movies', createMoviesRouter({ movieModel }))
    app.use(corsMiddleware())
    app.disable('x-powered-by')

    app.get('/', (req, res) => {
        res.json({ message: 'Bienvenido a mi pagina web' })
    })

    const PORT = process.env.PORT ?? 3000

    app.listen(PORT, () => {
        console.log(`server listening on port http://localhost:${PORT}`)
    })
}
