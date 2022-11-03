const express = require('express')
const cors = require('cors')
const { json } = require('express')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(express.json())

//!database connection details


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7incky7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const serviceCollection = client.db('geniusCar').collection('services')
        const orderCollection = client.db('geniusCar').collection('orders')

        //service api
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleService = await serviceCollection.findOne(query);
            res.send(singleService)
        })

        //orders api
        app.get('/orders', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = { email: req.query.email };
            }
            const cursor = orderCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.post('/orders', async (req, res) => {
            const order = req.body
            const result = await orderCollection.insertOne(order);
            res.send(result)
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        })
    } catch (error) {

    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Genius Car server is running!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})