var CryptoJS = require("crypto-js");    

var ts = new Date().getTime().toString(),
    publicKey = '1293b142b10f3a29a97d3303b920e427',
    privKey = '7d3a0ca0c2437bb4e8bc01b04a6f95dd945caff8',
    storyId = 3846,
    title,
    marvelAttr,
    characters,
    characterArray = [];

var hash = CryptoJS.MD5(ts + privKey + publicKey).toString();
var url='http://gateway.marvel.com/v1/public/stories/';

//Store response data in variables to printHTML and listCharacters
function storeStoriesData(response, attribution) {
    title = response.title;
    characters = response.characters.items;
    marvelAttr = attribution;
    
    //Base html
    var html = '<h1 id="title">' + title + '</h1>';
        html += '<p>' + marvelAttr + '</p>';
        html += '<h3 id="characterList">Story Characters:</h3>';
    
    printHTML(html);
}

//API Call to get story data
function getStoryInfo() {
    var storyUrl = url + storyId + '?apikey=' + publicKey;
    
    $.getJSON(storyUrl, {
        hash: hash,
        ts: ts
    })
    .done(function(response) {
        getCharacterCollection(response.data.results[0].characters.collectionURI);
        storeStoriesData(response.data.results[0], response.attributionText);
    }); //end getJSON    
}

//API Call to get the character collection data
function getCharacterCollection(charCollectionURI) {
    var collectionUrl = charCollectionURI + '?apikey=' + publicKey; 
    $.getJSON(collectionUrl, {
        hash: hash,
        ts: ts
    })
    .done(function(response) {
        generateCharHTML(response.data.results);
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