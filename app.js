const { log } = require('console');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const path = require('path');
const port = 8000;
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Connecting to the mongo database 
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/contactDance');
}

//Defining mongoose schema
const contactSchema = new mongoose.Schema({
    name: String,
    phone : String,
    email: String,
    address: String,
    desc: String
  });

//Defining mongoose model
const Contact = mongoose.model('Contact', contactSchema);


//EXPRESS SPECEFIC STUFF
app.use('/static', express.static('static')) //serving static files

//PUG SPECIFIC STUFF
app.set('view engine', 'pug') //set the template as pug
app.set('views', path.join(__dirname, 'views')); //set the views directory

//ENDPOINTS
app.get('/', (req, res)=>{
    const params = {}
    res.status(200).render('home.pug', params);
});

//Handling contact page get request
app.get('/contact', (req, res)=>{
    const params = {}
    res.status(200).render('contact.pug', params);
});


//Handling contact page post request
app.post('/contact', (req, res)=>{
    var myData = new Contact(req.body);
    myData.save().then(()=>{
        res.send('This item has been saved to the database')
    }).catch(()=>{
        res.status(400).send('Item was not saved to the database')
    });
});


//START THE SERVER
app.listen(port, ()=>{
    console.log(`The application started sucessfully on port : ${port}`);
})