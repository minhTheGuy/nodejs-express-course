const express = require('express')
const session = require('express-session')
const hdb = require('express-handlebars')
const router = require('./routes/userRoute')

const app = express()
app.engine(
    'handlebars',
    hdb.engine({
        defaultLayout: 'main',
        helpers: {
            currency: function (num) {
                return `$${num}`
            },
        },
    }),
)
app.set('view engine', 'handlebars')
app.use(express.static(`${__dirname}/public`))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
    session({ resave: false, saveUninitialized: false, secret: 'my secret' }),
)

app.use('/', router)

app.listen(8000, () => {
    console.log('Server is running on port 8000: http://localhost:8000')
})
