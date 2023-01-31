const express = require('express')
const mongoose = require('mongoose')
const _ = require('lodash')

const app = express()
require('dotenv').config()
const port = process.env.PORT
const uri = process.env.URI

const workItems = []

app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

mongoose.set({strictQuery: false})
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

const listSchema = mongoose.Schema({
    name: String,
    items: [itemsSchema]
})

const List = mongoose.model('List', listSchema)

app.get('/', (req, res) => {
    
    Item.find({}, (err, foundItems) => {

        if(foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if(err) {
                    console.log(err)
                } else {
                    console.log("Successfully saved default items to DB.")
                }
            })
            res.redirect('/')
        } else {
            res.render("list", { listTitle: "Today", newListItem: foundItems })
        }
    })

})

app.post('/', (req, res) => {
    const itemName = req.body.newItem
    const listName = req.body.list

    const item = new Item({
        name: itemName
    })

    if(listName === "Today") {
        item.save()
        res.redirect('/')
    } else {
        List.findOne({name: listName}, (err, foundList) => {
            foundList.items.push(item)
            foundList.save()
            res.redirect(`/${listName}`)
        })
    }

})

app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox
    const listName = req.body.listName

    if(listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, (err) => {
            if(!err) {
                console.log('Successfully deleted checked item.')
                res.redirect('/')
            }
        })
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
            if(!err) {
                res.redirect(`/${listName}`)
            }
        })
    }

})

app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName)

    List.findOne({name: customListName}, (err, foundList) => {
        if(!err) {
            if(!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save()
                res.redirect(`/${customListName}`)
            } else {
                res.render("list", { listTitle: foundList.name, newListItem: foundList.items })
            }
        }
    })

})

app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})

    // const options = {
    //     weekday: 'long',
    //     month: 'long',
    //     day: 'numeric'
    // }
    // const today = new Date()

    // const day = today.toLocaleDateString('en-US', options)