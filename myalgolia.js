'use strict';

/**
 * Module dependencies.
 */
var algoliasearch = require('algoliasearch');
var async = require('async');
var _ = require('lodash');


/**
 * create algolia client using access key and secret
 */
exports.createClient = function(credentials) {
	return new Client(credentials);
};

exports.Client = Client;

function Client(credentials) {
	if (!credentials || !credentials.accessKeyId || !credentials.secretAccessKey) {
		throw new Error("Algolia access key Id and secret required.");
	}
	this.client = algoliasearch(credentials.accessKeyId, credentials.secretAccessKey);
};


/**
 * create algolia config
 */
Client.prototype.initialize = function(algoliaConfig) {
	var self = this;
	console.log('algoliaConfig', algoliaConfig);
	this.algoliaConfig = algoliaConfig;
};

/**
 * Push one or more indices to Algolia, taken in as array of string
 */
Client.prototype.reIndex = function(collectionsToReIndex, cb) {
	var self = this;
	console.log('reIndex-2');
	if (!collectionsToReIndex)
		return cb({ error: "Index required" });
	updateIndices(self, collectionsToReIndex, function(err, response) {
		if (err) {
			return cb({ error: err });
		} else {
			cb(null, { message: "done!" });
		}
	})

};

/**
 * Push all indices to Algolia together
 */
Client.prototype.reIndexAll = function(cb) {
	var self = this;
	console.log('reIndexAll-2');
	var collectionsToReIndex = Object.keys(self.algoliaConfig);
	console.log('collectionsToReIndex', collectionsToReIndex);
	console.log('self.algoliaConfig - ', self.algoliaConfig);
	updateIndices(self, collectionsToReIndex, function(err, response) {
		if (err) {
			return cb({ error: err });
		} else {
			cb(null, { message: "done!" });
		}
	})


};

var updateIndices = function(self, collectionsToReIndex, cb) {
	var updateIndex = function(key, done) {
		var index = self.client.initIndex(self.algoliaConfig[key].index);
		index.setSettings({
			attributesToIndex: self.algoliaConfig[key].attributesToIndex,
			customRanking: self.algoliaConfig[key].customRanking
		});

		index.clearIndex(function(err) {
			if (err) {
				console.error("err-1", err);
				return done({ error: err });
			} else {
				console.log("Algolia Clean done");
				console.log("searching controller");
				self.algoliaConfig[key].parser(function(err, result) {
					if (err) {
						console.error("err-3", err);
						return done({ error: err });
					} else {
						console.log("total data: ", result.length);
						var chunkeddata = _.chunk(result, 5000);
						console.log("Algolia Push initiated");
						async.each(chunkeddata, index.saveObjects.bind(index), function() {
							console.log("Algolia Push done");
							done();
						});
					}
				})
			};
		});
	};
	async.eachSeries(collectionsToReIndex, updateIndex, function(err) {
		if (err) {
			return cb({ error: err });
		} else {
			cb(null, { message: "done!" });
		}
	});
}
