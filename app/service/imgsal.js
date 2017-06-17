module.exports = function(app, db, apiKey) {
    var request = require('request');
    var queryCollection = db.collection('querys')

    app.get('/imagesearch/:search', function(req, res) {
        var page = req.query.offset === undefined ? 1 : req.query.offset;
        addQueryToDatabase(req.params.search, page);
        returnImageList(req.params.search, page, res);
    });

    function addQueryToDatabase(searchTerm, page) {
        queryCollection.findOne({_id: 'queryHistory'}, function(err, doc) {
            if (err) throw err;
            var queryHistroyEntry = {term: searchTerm, when: new Date()};
            
            if(doc === null) {
                queryCollection.insertOne({_id: 'queryHistory', querys: [{term: searchTerm, when: new Date()}]});
            } else {
                doc.querys.unshift({
                    term: searchTerm,
                    when: new Date()
                });
                doc.querys.length = doc.querys.length <= 2 ? doc.querys.length : 10;
                queryCollection.updateOne({_id: 'queryHistory'}, { $set:{querys: doc.querys}});
            }
        }); 
    }

    function returnImageList(searchTerm, page, res) {
        queryCollection.findOne({searchTerm: searchTerm, page: page}, function (err, doc) {
            if (doc !== null) {
                res.json(doc.cachedResult);
            } else {
                var options = {
                    uri: 'https://pixabay.com/api/?key=' + apiKey + '&q=' + searchTerm + '&page=' + page + '&per_page=10'
                }
                request(options, function(err, searchResponse, body) {
                    if(err) throw err;
                    var imageList = createImageList(JSON.parse(body).hits);
                    queryCollection.insertOne({searchTerm: searchTerm, page: page, cachedResult: imageList})
                    res.json(imageList);
                });
            }
        });

    }

    function createImageList(response) {
        var imgList = [];
        for (var i = 0; i < response.length; i++) {
            imgList.push({"tags": response[i].tags, "url": response[i].webformatURL, "thumbnail": response[i].previewURL, "context": response[i].pageURL});
        }
        return imgList;
    }

    app.get('/latest/imagesearch', returnLatestSearches);

    function returnLatestSearches(req, res) {
           queryCollection.findOne({_id: 'queryHistory'}, function(err, doc) {
                if (err) throw err;

                if (doc === null) {
                    res.json('There are no recent searches');
                } else {
                res.json(doc.querys);
                }
            });
    }
}