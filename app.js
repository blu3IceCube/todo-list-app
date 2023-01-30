const express = require('express')
const mongoose = require('mongoose')

const app = express()
require('dotenv').config()
const port = process.env.PORT
const uri = process.env.URI

const items = []
const workItems = []

app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

mongoose.connect(uri)

const itemsSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model('Item', itemsSchema)

const item1 = new Item({
    name: "Welcome to your todolist!"
})

const item2 = new Item({
    name: "Hit the + button to add a new item."
})

const item3 = new Item({
    name: "<-- Hit this to delete an item."
})

const defaultItems = [item1, item2, item3]

Item.insertMany(defaultItems, (err) => {
    if(err) {
        console.log(err)
    } else {
        console.log("Successfully saved default items to DB.")
    }
})

app.get('/', (req, res) => {
    
    // const options = {
    //     weekday: 'long',
    //     month: 'long',
    //     day: 'numeric'
    // }
    // const today = new Date()

    // const day = today.toLocaleDateString('en-US', options)

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