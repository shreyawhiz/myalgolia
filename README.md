# myalgolia
This is a wrapper module to index one or many indexes together.


###Please Star it on github if you liked it

##Installation

Installing using npm (node package manager):

    npm install myalgolia

If you don't have npm installed or don't want to use it:

    cd ~/.node_libraries
    git clone git://github.com/shreyawhiz/myalgolia

```javascript
//Include the myalgolia module
var myalgolia = require('myalgolia');
```

##Requirements
* An Algolia account, with service enabled, and API key. See the Getting Started guide for more information https://www.algolia.com/doc/
*  "algoliasearch": "^3.10.2",
*  "lodash": "^4.16.0",
*  "async": "~1.5.2"


##Examples

```javascript
//create a myalgolia client
var client = myalgolia.createClient({algoliaKey: 34Rffv5f, algoliaSecret: ######});

Lets suppose you have a data collection to index
var collections = {
	key1 : {
		index: "key1_index",
		attributesToIndex : ['title'],
		customRanking : [],
		parser : function(){} //function to manipulate and get the exat data to be sent to algolia
	},
	key2 : {
		index: "key2_index",
		attributesToIndex : ['source'],
		customRanking : [],
		parser : function(){}
	}
};

Do
client.initialize(algoliaConfig);
//to create an algolia config

Now use reIndexAll or reIndex to index/reindex your collections

*For reIndex, send an array of keys (such as ['key1', 'key2']) as identification which all collections to index.

```
