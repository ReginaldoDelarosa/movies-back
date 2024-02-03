import z from 'zod'
const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Title must be a string',
        required_error: 'Title is required'
    }),
    year: z.number().int().min(1900).max(2025),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(0),
    poster: z.string().url({
        message: 'Poster must be a valid URL'
    }),
    genre: z.array(z.enum(['Action',
        'Adventure',
        'Animation',
        'Biography',
        'Comedy',
        'Crime',
        'Documentary',
        'Drama',
        'Family',
        'Fantasy',
        'Film Noir',
        'History',
        'Horror',
        'Music',
        'Musical',
        'Mystery',
        'Romance',
        'Sci-Fi',
        'Short Film',
        'Sport',
        'Superhero',
        'Thriller',
        'War',
        'Western'])).min(1)
})

export function validateMovie (object) {
    return movieSchema.safeParse(object)
}

export function validatePartialMovie (input) {
    return movieSchema.partial().safeParse(input)
}
