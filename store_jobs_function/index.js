var request = require("request"); // Include the request lib - run npm install request
exports.handler = function(event, context, callback) {
	callback = context.done;
	var data = event.bodyJson || {};
	
	// Set the URL
	var url = 'https://api.domain.co.uk';
	
	// Make the request
	request({
	    url: url,
	    json: true
	}, function (error, response, body) {
	    if (!error && response.statusCode === 200) {
		    let retrievedArray = body;
	        
	        request({
				url: 'https://your-api-url.com',
				method: "POST",
				json: retrievedArray
			}, function (error, response, body) {
			  if (error) {
				console.error(error)
				return
			  }
			  console.log(body)
			})
	    }    
	});
};