const express = require("express");
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()


// akbarmhbc
//sOLY0F2ujG5Y3tyd

//middlewares
const corsConfig = {
    credentials:true,
    origin:true,
    methods: ["GET","POST","PATCH","PUT","DELETE","OPTIONS"]
}
app.use(cors(corsConfig));
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ldn2wkd.mongodb.net/?retryWrites=true&w=majority`;

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
    client.connect();
    // Send a ping to confirm a successful connection


    const toysData = client.db('toymarket').collection('toys-data');
    
    app.get('/mytoys',async(req, res) => {

       
     query = {seller_email: req.query.email}
     let sort = {}
     if(req.query?.sort){
     sort = {price: req.query.sort}    
     }

          const result = await toysData.find(query).sort(sort).toArray();
          res.send(result)

      })

// add a toy
      app.post('/add', async(req,res) =>{
      
        const data = req.body;
        const result = await toysData.insertOne(data);
        res.send(result)
  
      })

// update a toy


app.patch('/update/:id', async(req,res)=>{
    const id = req.params.id;
    let query ={_id: new ObjectId(id)}
   const updatedData = req.body;

    const updatedDoc = {
      $set: updatedData
    }
    const result = await toysData.updateOne(query,updatedDoc);
    res.send(result)
    console.log(result)
  })



      app.delete('/mytoys/:id', async(req,res) =>{
        const id = req.params.id;
        let query ={_id: new ObjectId(id)}
  
        const result = await toysData.deleteOne(query);
        res.send(result)
      })
   


    app.get('/', async(req,res)=>{
        const data = toysData.find();
        const result = await data.toArray();
        res.send(result);
      
    })

    app.get('/alltoys', async(req,res)=>{
        const query = req.query.limit || 20;
        const result = await toysData.find().limit(parseInt(query)).toArray();
        res.send(result)      
      
    })

    app.get('/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await toysData.findOne(query);
        res.send(result)
 
      })

    

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// listen
app.listen(port)