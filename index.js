const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        const CompeletedTasks = client.db('Taskapp').collection('doneTasks')

        app.post('/addTask', async (req, res) => {
            const task = req.body;
            console.log(task);
            const result = await TaskCollections.insertOne(task);

            res.send(result);

            // Task add API 
            app.get('/allTask', async (req, res) => {
                const query = req.query
                const filter = {
                    email: query.email
                }
                console.log(filter)
                const cursor = await AllTask.find(query).toArray()
                res.send(cursor)
            })

            // Task delete 
            app.delete('/allTask:id([0-9a-fA-F]{24})', async (req, res) => {
                const id = req.params.id;
                // console.log(id);
                const query = { _id: ObjectId(id) }
                const result = await TaskCollections.deleteOne(query)
                res.send(result)
            });
            app.get('/doneTask', async (req, res) => {
                const query = req.query
                const filter = {
                    email: query.email
                }
                console.log(filter)
                const cursor = await AllTask.find(query).toArray()
                res.send(cursor)
            })
            app.post('/doneTask', async (req, res) => {
                const compeletedTask = req.body
                console.log(filter)
                const result = await compeletedTasks.insertOne(compeletedTask)
                res.send(result)
            })
            app.post('/users', async (req, res) => {
                const user = req.body
                const result = await UserCollections.insertOne(user)
                res.send(result)
            });


            app.get('/user', async (req, res) => {
                const email = req.query.email;
                // const decodedEmail = req.decoded.email;

                const query = { email: email }
                const user = await UserCollections.findOne(query);
                res.send(user);
            });
        });

    }
    finally {

    }
}
run().catch(err => { console.log(err) })



app.get('/', (req, res) => {
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