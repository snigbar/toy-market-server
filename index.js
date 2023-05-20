const express = require("express");
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()

const toysData = require('./toys.json')

// akbarmhbc
//sOLY0F2ujG5Y3tyd

//middlewares
app.use(cors());
app.use(express.json())





const uri = "mongodb+srv://akbarmhbc:sOLY0F2ujG5Y3tyd@cluster0.ldn2wkd.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("toymarket").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const toysData = client.db('toymarket').collection('toys-data');

    app.get('/', (req,res) =>{
        res.send("running beta...")
    })

    app.get('/allToys', async(req,res)=>{
        const data = toysData.find();
        const result = await data.toArray();
        res.send(result);
    })


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// listen
app.listen(port)