const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efkhy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('service');
        //to get all the service
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        //to get individual service
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);

        })

        //to POST/ add new service
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })

        //update a service
        app.put('/service/:id', async (req, res) => {
            const id = req.params.id;
            const updatedService = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedService.name,
                    description: updatedService.description,
                    price: updatedService.price,
                    img: updatedService.img
                }
            };
            const result = await serviceCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        //to delete the service..
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.dir);


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efkhy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// // client.connect(err => {
// //     const collection = client.db("test").collection("devices");
// //     console.log('Genius CarDb connected');
// //     // perform actions on the collection object
// //     client.close();
// // });
// async function run() {
//     try {
//         await client.connect();
//         const serviceCollection = client.db('geniusCar').collection('service');

//         app.get('/service', async (req, res) => {
//             const query = {};
//             const cursor = serviceCollection.find(query);
//             const services = await cursor.toArray();
//             res.send(services);
//         });
//     }
//     finally {

//     }
// }


app.get('/', (req, res) => {
    res.send('Running Genius Server')
})
app.listen(port, () => {
    console.log('Listening to port', port);
})