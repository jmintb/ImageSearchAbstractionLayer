var request = require('request');
var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/data';

function searchForImages(searchTerm, mongo, res) {
    addQueryToDatabase(searchTerm, mongo);
    request('https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=' + searchTerm, function(error, response, body) {
        var images = createImageList(response);
        res.json(response);
    });
}

function addQueryToDatabase(searchTerm, mongo) {
    mondo.connect(mongoUrl, function (err, db) {
       db.collection('querys').insertOne({_id: 'query', query: {term: searchTerm, time: getTime()}}, function(err) {
           db.close();
       }); 
    });
}

function createImageList(reponse) {
    var imgList = [];
    for (var i = 0; i < response.length; i++) {
        var element = response[i];
        imgList.push({"name": element.name, "url": element.contentUrl});
    }
    return imgList;
}

function getLatestSearches(mongo, res) {
    mongo.connect(mongoUrl, function(err, db) {
        db.collection('querys').find({_id: 'query'}, function(err, result) {
            var searches = [];
            for (var i = 0; i < result.length; i++) {
                searches.push(result[i])
            }
            res.json(searches);
            db.close();
        })
    })
}

