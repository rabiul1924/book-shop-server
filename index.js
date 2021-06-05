const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
require('dotenv').config()
// console.log(process.env.DB_USER)


const app = express()
const port = process.env.PORT || 5055


app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



//database connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y5f6g.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // console.log("connection error", err)
  const eventCollection = client.db("new-work").collection("events");
//   console.log("Database success")

app.get('/events', (req, res) => {
    eventCollection.find()
    .toArray((err, items) => {
        res.send(items)
    })
})

app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    console.log('adding new event: ', newEvent)
    eventCollection.insertOne(newEvent)
    .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})
  
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})