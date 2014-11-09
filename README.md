
# Leaderboard API for HTML 5 games

----------


## Purpose:

As I started making games with Phaser I found there was a lack of documentation on how to create a leaderboard.  Commonly people like myself have web hosting that supports SQL and PHP, after a few months of tinkering I came up with a fairly simple Restful API for basic leaderboard using javascript, php, and mysql.  

## Disclaimer:  

I am a begginer so use all this code at your own risk!

## Included:

* Leaderboard API created with  the Slim PHP Framwork

* Sample ajax calls to read and write from the API

* Sample Game that posts and reads from the API

* Sample Leaderboard

* SQL DB example

## Set Up:
1. Create a MySQL DB called test *(or whatever you would like it to be called)*

2. Execute the included .sql file to create and populate the apitest table.

3. Deploy the webapp included (**Note:** Phaser games require a server to run so apache or node)

4. Edit the api/index.php getConnection function and adjust the connection parameters.

5. Open the leaderboard.api.js file and adjust the rootURL variable so it matches your configuration.


----------


#API Documentation

This is a basic RESTful API with 1 resource that allows for creating, reading, and updating of records.

* Allowed HTTP Verbs are - `"GET", “POST”, and “PUT”`.
* One resource called `/scores`

## Get all scores in descending order

* Description
    * Grab all scores from the Database in descending order by score
* URL 
    *  `/scores`
* Method 
    * GET
* URL Params
    * None
* Data Params
    * None
* Success Response:
    * Code: 200
    * Type: JSON
    * Content: `{ "score": [{ "id": 1, "name": "Sam", "score": 200}] }` 
* Error Response:
    * Code: 200 (for now)
    * Type: JSON
    * Content: `{ "error": { “text”: “error message” }}`
* Sample Call

	    * $.ajax({
           		type: 'GET',
           		url: "/scores",
           		dataType: "json",
				success: function(response) {
					// do something with response
				}
       	  });

## Get a single score


* Description
    * Grab a single score from the database.  It accepts a name or id in the url.
* URL 
    *  `/scores/:query`
* Method 
    * GET
* URL Params
    * Id or Name (one or the other not both)
        * Example: `/scores/2` or `/scores/sam`
* Data Params
    * None
* Success Response:
    * Code: 200
    * Type: JSON
    * Content: `{ "id": 1, "name": "Sam", "score": 200}`
* Error Response:
    * Code: 200 (for now)
    * Type: JSON
    * Content: `{ "error": { “text”: “error message” }}`
* Sample Call

	    * $.ajax({
           		type: 'GET',
           		url: "/scores/3",
           		dataType: "json",
				success: function(response) {
					// do something with response
				}
       	  });

## Post a new score

* Description
    * Post a new score to the database.  This method accepts a JSON data payload.
* URL 
    *  `/scores`
* Method 
    * POST
* URL Params
    * None
* Data Params
    * Type: JSON
    * Required Fields - name and score
    * Example `{ "name": “Sam”, “score”: 100 }`
* Success Response:
    * Code: 200
    * Type: JSON
    * Content: echo back what was posted with id
    * Example: `{ "id": 2, “name”: “Sam”, “score”: 100 }`
* Error Response:
    * Code: 200 (for now)
    * Type: JSON
    * Content: `{ "error": { “text”: “error message” }`
* Sample Call

	    * $.ajax({
           		type: 'POST',
           		url: "/scores",
           		dataType: "json",
				data: JSON.stringify({ "name": “Sam”, “score”: 200})
				success: function(response) {
					// do something with response
				}
       	  });

## Update a score

* Description
    * Update an existing score.  This method will only update scores if the score in the database is less than the new score submitted.
* URL 
    *  `/scores/:id`
* Method 
    * PUT
* URL Params
    * id - record Id
* Data Params
    * Type: JSON
    * Required Fields - score
    * Example `{ "score": 100 }`
* Success Response:
    * Code: 200
    * Type: JSON
    * Content: echo back what was posted
    * Example: `{ "score": 100 }`
* Unsuccessful Response:
    * Code: 200
    * Type: JSON
    * Content: "No Update. Score lower than highscore"
    * Example: Score in DB was 200.  Score in update was 100.
* Error Response:
    * Code: 200 (for now)
    * Type: JSON
    * Content: `{ "error": { “text”: “error message” }}`
* Sample Call

			$.ajax({
				type: "PUT",
   				url: "/scores/:Id",
   				dataType: "json",
				data: JSON.stringify({ "score": 200})
				success: function(response) {
					// do something with response
				}
   	  		});

## Acknowledgements:  

##### Most of my code was cannibalized from  [http://coenraets.org/blog/2011/12/restful-services-with-jquery-php-and-the-slim-framework/](http://coenraets.org/blog/2011/12/restful-services-with-jquery-php-and-the-slim-framework/)


----------
### To-dos
1. Create meaningful error codes and text.
2. Add helper functions to API - Find if player exists etc.
2. Update leaderboard.api.js to use some private variables and methods for storing ID.
3. Update my sample game to consume and use the data more appropriately.
4. Employ a basic way to secure the API.
5. Move the connection information into its own file.

