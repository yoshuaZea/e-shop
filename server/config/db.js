const mongoose = require('mongoose')
require('dotenv').config({ path: '.env' })

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })

        console.log('Mongo DB connected')

    } catch (error) {
        console.log('Hubo un error')
        console.log(error)
        process.exit(1) // Detener la aplicación
    }
}

module.exports = connectDB