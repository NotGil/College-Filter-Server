// Retrieve
var MongoClient = require('mongodb').MongoClient;

exports.getUni = function (req, res){

    var address = req.params.webAddress;
    // Connect to the db
    MongoClient.connect("mongodb://dbuser:dbpassword@ds059702.mongolab.com:59702/university_database", function (err, db) {
        if (!err) {
            console.log("We are connected");
        }
        var collection = db.collection('Universities');
        collection.find({
            "webAddress.home": {
                "$regex": "^"+address+"\\.edu|\\."+address+"\\.edu",
                "$options": "i"
            }
        }).toArray(function (err, docs) {
            console.log("Printing docs from Array")
            docs.forEach(function (doc) {
                //console.log("Doc from Array ");
                if (doc.percentAdmitted.total != null) {
                    console.log(doc.name);
                    res.json(doc);
                }
            });
        });
    
    });
}
exports.distinct = function (req, res){
    MongoClient.connect("mongodb://dbuser:dbpassword@ds059702.mongolab.com:59702/university_database", function (err, db) {
        if (!err) {
            console.log("We are connected");
        }
        var collection = db.collection('Universities');
        collection.distinct('Religious-affiliation', function (err, docs){
            res.send(docs);
        })
    
    });
}
exports.filter = function (req, res){
    MongoClient.connect("mongodb://dbuser:dbpassword@ds059702.mongolab.com:59702/university_database", function (err, db) {
        if (!err) {
            console.log("We are connected");
        }
        var collection = db.collection('Universities');
        
        console.log("filter function is running");
        var criteria = new Array(req.body.first, req.body.second, req.body.third);
        var userData = new Array();
        for (var i = 0; i < 3; i++) {
            if (criteria[i] == "admission") {
                console.log(req.body.admission);
                userData.push(req.body.admission);
            }
            if (criteria[i] == "SATScores") {
                userData.push(req.body.SATScores);
            }
            if (criteria[i] == "region") {
                userData.push(req.body.region);
            }
        }
        
        
        for (i = 0; i < 3; i++) {
            
            if (criteria[i] !="null") {
                console.log(criteria[i] + " " + userData[i]);
                if (criteria[i] == "admission") {
                    var list = new Array();
                    collection.find({
                        "percentAdmitted.total": {
                            "$gte": Number(userData[i])
                        }
                    }).toArray(function (err, docs) {
                        console.log("Printing docs from Array")
                        docs.forEach(function (doc) {
                            //console.log("Doc from Array ");
                            if (doc.percentAdmitted.total != null) {
                                list.push(doc.webAddress.home);
                                console.log(doc.webAddress.home);
                            }
                        });
                        res.send(list);
                    });
                }

            }
            
        }
    });

}

exports.test = function (req, res){
    var criteria = new Array(req.body.first, req.body.second, req.body.third);
    //var userData = new Array(req.query[criteria[0]], req.query[criteria[1]], req.query[criteria[2]]);
    var userData = new Array();
    
    var i;
    for (i = 0; i < 3; i++) {
        if (criteria[i] == "admission") {
            console.log(req.body.admission);
            userData.push(req.body.admission);
        }
        //*example* will probably not work when you actually use it 
        if (criteria[i] == "SATScores") {
            userData.push(req.body.SATScores);
        }
        if (criteria[i] == "region") {
            userData.push(req.body.region);
        }
    }
    res.send(req.body);
}