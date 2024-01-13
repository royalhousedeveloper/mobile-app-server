let express = require('express')
let eventRouter = require('./routes/event')
let notificationRouter = require('./routes/notification')
let devotionRouter = require('./routes/devotion')
let pastorRouter = require('./routes/pastor')
let givingRouter = require('./routes/giving')
let adminRouter = require('./routes/admin')
let bookRouter = require('./routes/book')
let galleryRouter = require('./routes/gallery')
let messageRouter = require('./routes/message')
let programRegistrationRouter = require('./routes/program_registration')
let mediaRouter = require('./routes/media')
let ministryRouter = require('./routes/ministry')
let documentRouter = require('./routes/document')
let chapterRouter = require('./routes/chapters')
let sermonRouter = require('./routes/sermon')
let storeRouter = require('./routes/store')
let customerRouter = require('./routes/customer')
let imageSliderRouter = require('./routes/slider')

let app = express()
let port = process.env.PORT

app.use(express.json())
app.use(eventRouter)
app.use(imageSliderRouter)
app.use(messageRouter)
app.use(mediaRouter)
app.use(sermonRouter)
app.use(bookRouter)
app.use(storeRouter)
app.use(chapterRouter)
app.use(ministryRouter)
app.use(galleryRouter)
app.use(notificationRouter)
app.use(devotionRouter)
app.use(pastorRouter)
app.use(adminRouter)
app.use(documentRouter)
app.use(givingRouter)
app.use(programRegistrationRouter)
app.use(customerRouter)

app.listen(port, () => {
    console.log('Server is up and running on port: ' + port)
})