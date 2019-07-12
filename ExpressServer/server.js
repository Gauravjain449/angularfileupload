const express = require('express');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser')
var cors = require('cors')


const app = express();
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(cors())

var url = 'mongodb://localhost/';
//var url = "mongodb://gauravjain449:vxj6nkuYBmnaTobGucZORzXaanJHzFYcVmyGGpdlsjz94G4hCFP6mv1vCh4n3r5qQDVGIHxvp0NJ8nN9QdA1xg==@gauravjain449.documents.azure.com:10255/?ssl=true";
var str = "";



app.post('/addrecords', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        try {
            if (err) {
                res.json({ index: req.body.index + '- "Please check you db connection parameters' });
                console.log("Please check you db connection parameters");
            } else {
                console.log("Connection Succeeded!");
                console.log(req.body.foo);
                var dbo = db.db("csv");
                var myobj = req.body.foo;
                dbo.collection(req.body.mongoColName).insertMany(myobj, function (err, innerRes) {
                    if (err) console.log(err);
                    res.json({ index: req.body.index + '-' + req.get("content-length") });
                    console.log("Number of documents inserted: " + innerRes.insertedCount);
                    db.close();
                });
            }
        }
        catch (err) {
            console.log(err);
            res.json({ index: req.body.index + '-' + err.message });
        }
        finally {
            db.close();
        }
    });

});


app.get('/getCollections', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            res.json({ message: 'Please check you db connection parameters' });
            console.log("Please check you db connection parameters");
        } else {
            console.log("Connection Succeeded!");
            var dbo = db.db("csv");
            var _cols = [];
            dbo.collections(function (e, cols) {
                try {
                    cols.forEach(function (col) {
                        _cols.push(col.collectionName);
                    });
                    res.json({ collections: _cols });
                }
                catch (err) {
                    console.log(err);
                    res.json({ message: err.message });
                }
                finally {
                    db.close();
                }
            });
        }
    });

});

app.get('/getColDocs', (req, res) => {
    console.log(req.query);
    MongoClient.connect(url, function (err, db) {
        if (err) {
            res.json({ message: 'Please check you db connection parameters' });
            console.log("Please check you db connection parameters");
        } else {
            console.log("Connection Succeeded!");
            var dbo = db.db("csv");
            //  var query = { $and: [{ _id: { $gte: parseFloat(req.query.first) } }, { _id: { $lte: parseFloat(req.query.last) } }] }
            var query = { _id: { $gt: parseInt(req.query.id) } };
            dbo.collection(req.query.colName).find(query).sort({ _id: 1 }).limit(parseInt(req.query.limit)).toArray(function (err, result) {
                if (err) throw err;
                //console.log(result);
                //res.send(result);

                res.json({ data: result });
                // console.log(res.get("content-length"));
                // res.json({ data: 3 });
                db.close();
            });
        }
    });

});

app.post('/updelrecords', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        try {
            if (err) {
                res.json({ error: + '- "Please check you db connection parameters' });
                console.log("Please check you db connection parameters");
            } else {
                console.log("Connection Succeeded!");
                var dbo = db.db("csv");
                var myobj = req.body.foo;
                // console.log('Gaurav')
                // console.log(myobj)
                myobj.forEach((data, index, arr) => {
                    //console.log(data._id)
                    //console.log(index)
                    //console.log(arr)
                    if (data.isDeleted == true) {
                        var myquery = { _id: data._id };
                        dbo.collection(req.body.mongoColName).deleteOne(myquery, function (err, obj) {
                            if (err) throw err;
                            db.close();
                            console.log("1 document deleted");
                        });
                    }
                    else if (data.isDeleted == false) {
                        var myquery = { _id: data._id };
                        var newvalues = { $set: data };
                        dbo.collection(req.body.mongoColName).updateOne(myquery, newvalues, function (err, res) {
                            if (err) throw err;
                            console.log("1 document updated");
                            db.close();
                        });
                    }
                })

                res.json({ message: 'Hello' });
            }
        }
        catch (err) {
            console.log(err);
            res.json({ error: err.message });
        }
        finally {
            db.close();
        }
    });

});

app.listen(5000, () => {
    console.log('Server Started...');
})