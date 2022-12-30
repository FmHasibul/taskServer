const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()

app.use(cors());
app.use(express.json());

const uri = process.env.DB_URL;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const TaskCollections = client.db('Taskapp').collection('taskCollection')
        const UserCollections = client.db('Taskapp').collection('users')


        app.post('/addTask', async (req, res) => {
            const task = req.body;
            const result = await TaskCollections.insertOne(task);
            res.send(result);
        });

        app.get('/allTask', async (req, res) => {
            const email = req.query.email
            console.log(email);
            const query = { user: email };
            const cursor = await TaskCollections.find(query).toArray();
            res.send(cursor)
        });
        app.put('/allTask/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const taskComplete = req.body.taskComplete
            const query = { _id: ObjectId(id) }
            console.log(query);
            const updatedDoc = {
                $set: {
                    taskComplete: taskComplete
                }
            }
            const result = await TaskCollections.updateOne(query, updatedDoc);
            res.send(result);
        })
        // Task delete 
        app.delete("/allTask/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) };
            const result = await TaskCollections.deleteOne(filter);
            res.send(result);
        });


        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await UserCollections.insertOne(user)
            res.send(result)
        });





    }
    finally {

    }
}
run().catch(err => { console.log(err) })



app.get('/', (req, res) => {
    console.log(req);
    res.send('task manager server')
})
app.listen(port, () => {
    client.connect(err => {
        if (err) {
            console.log(err);
        }
        else {
            console.log('connect to Mongodb');
        }
    });
    console.log(`Task manager server is running on PORT ${port}`);
})