const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8mgufzz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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

        const serviceCollection = client.db("serviceDB").collection("services");
        const bookingCollection = client.db("serviceDB").collection("bookedServices");
        const blogsCollection = client.db("serviceDB").collection("blogs");


        // GET or FIND all for all services and popular services
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find()
            const result = await cursor.toArray();
            res.send(result);
        })

        // GET single data for service details
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.findOne(query);
            res.send(result)
        })



        // GET single Data By Use user email for Manage service section
        app.get('/myServices/:email', async (req, res) => {
            const email = req.params.email;
            const query = { providerEmail: email }
            const cursor = serviceCollection.find(query)
            const result = await cursor.toArray();
            res.send(result);
        })

        // GET single data for Edit service page
        app.get('/editService/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('Update', id)
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.findOne(query);
            res.send(result)
        })


        // GET single data for Booking Details page
        app.get('/bookingDetails/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Booking details', id)
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.findOne(query);
            res.send(result)
        })

        // DELETE
        app.delete('/myService/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.deleteOne(query);
            res.send(result);

        })

        // UPDATE 
        app.put('/service/:id', async (req, res) => {
            const id = req.params.id;
            const service = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateService = {
                $set: {
                    serviceName: service.serviceName,
                    serviceImage: service.serviceImage,
                    servicePrice: service.servicePrice,
                    serviceArea: service.serviceArea,
                    description: service.description,
                    providerName: service.providerName,
                    providerEmail: service.providerEmail,
                    providerPhoto: service.providerPhoto
                },
            };


            const result = await serviceCollection.updateOne(filter, updateService, options);
            res.send(result);
        })




        // POST
        app.post('/services', async (req, res) => {
            const service = req.body;
            //    console.log(service);
            const result = await serviceCollection.insertOne(service);
            res.send(result);

        })






        // BOOKING Service Related 
        // POST data from Booking Details page or purchase page
        app.post('/bookedServices', async (req, res) => {
            const service = req.body;
            console.log(service);
            const result = await bookingCollection.insertOne(service);
            res.send(result);
        })

        // GET data from BookedService route
        app.get('/bookedServices/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email }
            const cursor = bookingCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })


        // GET data from ServiceToDo route
        app.get('/servicesToDo/:email', async (req, res) => {
            const email = req.params.email;
            const query = { providerEmail: email }
            const cursor = bookingCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })


        // PATCH
        app.patch('/servicesToDo/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body;
            const query = { _id: new ObjectId(id) }
            const updateStatus = {
                $set: {
                  status
                },
            };
            const result = await bookingCollection.updateOne(query, updateStatus);
            res.send(result);
        })



        // BLOGS OR ARTICLE RELATED METHOD

        // GET or FIND all for all services and popular services
        app.get('/blogs', async (req, res) => {
            const cursor = blogsCollection.find()
            const result = await cursor.toArray();
            res.send(result);
        })





        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('DoctorConsulta server is  running...');
})


app.listen(port, () => {
    console.log(`DoctorConsulta server is running at port:${port}`);
})