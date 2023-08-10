const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.scmnlyp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        //gallery data
        const galleryCollection = client.db('toyStore').collection('gallery');

        app.get('/gallery', async (req, res) => {
            const cursor = galleryCollection.find();
            const gallery = await cursor.toArray();
            res.send(gallery);
        })

        //All Toys data
        const allToysCollection = client.db('toyStore').collection('allToys');

        app.get('/alltoys', async (req, res) => {
            const cursor = allToysCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        //View Details
        app.get('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const toy = await allToysCollection.findOne(query);
            res.send(toy);
        })

        //Add A Toy
        const aToyCollection = client.db('toyStore').collection('atoy');

        //data get from mongodb
        app.get('/atoy', async (req, res) => {
            const cursor = aToyCollection.find();
            const a_toy = await cursor.toArray();
            res.send(a_toy);
        })

        app.get('/atoy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const a_toy = await aToyCollection.findOne(query);
            res.send(a_toy);
        })

        //data send to mongodb
        app.post('/atoy', async (req, res) => {
            const newToy = req.body;
            console.log(newToy);
            const a_toy = await aToyCollection.insertOne(newToy);
            res.send(a_toy);
        })

        //update data from My Toys

        app.put('/atoy/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedToy = req.body;
            const toy = {
                $set: {
                    price: updatedToy.price,
                    quantity: updatedToy.quantity,
                    description: updatedToy.description
                }
            }
            const a_toy = await aToyCollection.updateOne(filter, toy, options);
            res.send(a_toy);
        })

        //delete data from My Toys
        app.delete('/atoy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const a_toy = await aToyCollection.deleteOne(query);
            res.send(a_toy);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Toy Store is running')
})

app.listen(port, () => {
    console.log(`Toy Store server is running on port ${port}`)
})