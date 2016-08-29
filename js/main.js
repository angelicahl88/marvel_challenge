var CryptoJS = require("crypto-js");

var requestParams = {
  ts: new Date().getTime().toString(),
  publicKey: '1293b142b10f3a29a97d3303b920e427',
  privKey: '7d3a0ca0c2437bb4e8bc01b04a6f95dd945caff8',
  storyId: 3846,
  url: 'http://gateway.marvel.com/v1/public/stories/'
}

var hash = CryptoJS.MD5(requestParams.ts + requestParams.privKey + requestParams.publicKey).toString();

var storeStoriesData = function(response, attribution) {
    var title = response.title;
    var characters = response.characters.items;
    var marvelAttr = attribution;

    //Base html
    var html = '<h1 id="title">' + title + '</h1>';
        html += '<p>' + marvelAttr + '</p>';
        html += '<h3 id="characterList">Story Characters:</h3>';

    printHTML(html);
}

//API Call to get story data
var getStoryInfo = function() {
    var storyUrl = requestParams.url + requestParams.storyId + '?apikey=' + requestParams.publicKey;

    $.getJSON(storyUrl, {
        hash: hash,
        ts: requestParams.ts
    })
    .done(function(response) {
        getCharacterCollection(response.data.results[0].characters.collectionURI);
        storeStoriesData(response.data.results[0], response.attributionText);
    })
    .fail(function(err) {
      console.error(err.message);
    }); //end getJSON
}

//API Call to get the character collection data
var getCharacterCollection = function(charCollectionURI) {
    var collectionUrl = charCollectionURI + '?apikey=' + requestParams.publicKey;
    $.getJSON(collectionUrl, {
        hash: hash,
        ts: requestParams.ts
    })
    .done(function(response) {
        generateCharHTML(response.data.results);
    })
    .fail(function(err) {
      console.error(err.message);
    }); //end getJSON
}


//Append HTML to .container
function printHTML(html) {
    $('.container').append(html);
}

//Loop through Character collection to generate character HTML to printHTML
function generateCharHTML(charData) {
    var description;

    $.each(charData, function(index, value) {
       if (charData[index].description.length === 0) {
            description = 'No charachter description available';
        } else {
            description = charData[index].description;
        }
        var charHtml = '<div class="character">';
            charHtml += '<img src=' + charData[index].thumbnail.path + '.' + charData[index].thumbnail.extension + '>';
            charHtml += '<h4>' + charData[index].name + '</h4>';
            charHtml += '<p>' + description + '</p>';
            charHtml += '</div>';

        printHTML(charHtml);
    });

}

//Get the story
getStoryInfo();
