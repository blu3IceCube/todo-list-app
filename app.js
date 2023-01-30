const express = require('express')

const app = express()
require('dotenv').config()
const port = process.env.PORT

const items = []
const workItems = []

app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
    
    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }
    const today = new Date()

    const day = today.toLocaleDateString('en-US', options)

    res.render("list", { listTitle: day, newListItem: items })
})

app.post('/', (req, res) => {
    const item = req.body.newItem

    console.log(req.body)

    if(req.body.list === "Work") {
        workItems.push(item)
        res.redirect('/work')
    } else if (item) {
        items.push(item)
        res.redirect('/')
    }
})

app.get('/work', (req, res) => {
    res.render("list", { listTitle: "Work List", newListItem: workItems })
})


app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})