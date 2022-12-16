const express = require('express');
const app =express();

const bodyParser = require('body-parser');
const exhbs = require('express-handlebars');
const dbObj = require('./db');
const ObjectId = dbObj.ObjectId;

app.engine('hbs', exhbs.engine({
    layoutsDir:'views/',
    defaultLayout:'main',
    extname: 'hbs'
}));
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended:true }));

app.get('/', async function(req, res) {
    let database = await dbObj.getDb();
    const collection = database.collection('books');
    const cursor = collection.find({});
    let books = await cursor.toArray();

    let message = '';
    //Update logic
    let edit_id, edit_book;

    if (req.query.edit_id) {
        edit_id = req.query.edit_id;
        edit_book = await collection.findOne({_id: ObjectId(edit_id)})
    }
    // update logic ends

    if (req.query.delete_id) {
        // delete operation
        await collection.deleteOne({
            _id: ObjectId(req.query.delete_id)
        })
        return res.redirect('/?status=3');
    }

    switch(req.query.status) {
        case '1':
            message = 'Inserted successfully'
            break;
        case '2':
            message = 'Updated successfully'
            break;
        case '3':
            message = 'Deleted successfully'
            break;
        default:
            break;
    }
    res.render('main', {
        message, 
        books,
        edit_id,
        edit_book
    })
})

// Create
app.post('/store_book', async function(req, res) {
    let database = await dbObj.getDb();
    const collection = database.collection('books');
    let book = {
        title: req.body.title,
        author: req.body.author
    };
    await collection.insertOne(book);
    return res.redirect('/?status=1');
})

// Update -  form action
app.post('/update_book/:id', async function(req, res) {
    let database = await dbObj.getDb();
    const collection = database.collection('books');
    let book = {
        title: req.body.title,
        author: req.body.author
    };
    let edit_id = req.params.id;
    await collection.updateOne({_id: ObjectId(edit_id)}, {$set: book});
    return res.redirect('/?status=2');
})

app.listen(8000, function(){
    console.log('listening to 8000 port');
})

// nodemon app.js -e hbs,js