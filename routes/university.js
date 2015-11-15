// Retrieve
var MongoClient = require('mongodb').MongoClient;

exports.getUni = function (req, res){
    
    var address = req.params.webAddress;
    if(address=="firstContact"){
        res.json(null);
    }
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
            res.send(null);
        });
    
    });
}
exports.distinct = function (req, res){
    MongoClient.connect("mongodb://dbuser:dbpassword@ds059702.mongolab.com:59702/university_database", function (err, db) {
        if (!err) {
            console.log("We are connected");
        }
        var collection = db.collection('Universities');
        collection.distinct('geographicRegion', function (err, docs){
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
        var criteria = req.body.first;
        var userData;
        if (criteria == "admission") {
            userData=(req.body.admission);
        }
        if (criteria == "region") {
            userData=(req.body.region);
        }
        if (criteria == "religion") {
            userData=(req.body.religion);
        }
        
        if (criteria !="null") {
            console.log(criteria + " " + userData);
            if (criteria== "admission") {
                var list = new Array();
                collection.find({
                    "percentAdmitted.total": {
                        "$gte": Number(userData)
                    }
                }).toArray(function (err, docs) {
                    console.log("Printing docs from Array")
                    docs.forEach(function (doc) {
                        //console.log("Doc from Array ");
                        if (doc.percentAdmitted.total != null&&list.indexOf(doc.webAddress.home)==-1) {
                            list.push(doc.webAddress.home);
                            //console.log(doc.webAddress.home);
                        }
                    });
                    res.send(list.sort());
                });
            }
            if(criteria=="region"){
                var list = new Array();
                collection.find({
                    "geographicRegion": {"$ne":userData} 
                }).toArray(function (err, docs) {
                    console.log("Printing docs from Array")
                    docs.forEach(function (doc) {
                        //console.log("Doc from Array ");
                        try {
                            if (doc.percentAdmitted.total != null&&list.indexOf(doc.webAddress.home)==-1) {
                            list.push(doc.webAddress.home);
                            //console.log(doc.webAddress.home);
                        }
                        } catch (error) {
                            //do nothing
                        }
                        
                    });
                    res.send(list.sort());
                });
            }
            if(criteria=="religion"){
                var list = new Array();
                collection.find({
                    "Religious-affiliation": {"$ne":userData} 
                }).toArray(function (err, docs) {
                    console.log("Printing docs from Array")
                    docs.forEach(function (doc) {
                        //console.log("Doc from Array ");
                        try {
                            if (doc.percentAdmitted.total != null&&list.indexOf(doc.webAddress.home)==-1) {
                            list.push(doc.webAddress.home);
                            //console.log(doc.webAddress.home);
                        }
                        } catch (error) {
                            //do nothing
                        }
                        
                    });
                    res.send(list.sort());
                });
            }

        }
            
        
    });

}

exports.test = function (req, res){
    res.send("connected");
}