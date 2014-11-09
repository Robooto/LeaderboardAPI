var Leaderboard = (function() {

    // The root URL for the RESTful services
    var rootURL = "http://localhost:85/phplearn/scoreapi/api/scores";

    /*
     *  Get top 50 scores from the DB and return the data in a promise.
     */
    var getScores = function() {
        return $.ajax({
            type: 'GET',
            url: rootURL,
            dataType: "json", // data type of response
        });
    };

    /*
     *  Get top score for a user and return the data in a promise.
     */

    var getTopScore = function(query) {
        return $.ajax({
            type: 'GET',
            url: rootURL + '/' + query,
            dataType: "json", // data type of response
        });
    };

    /*
     *  Update score in DB needs ID and score
     */

    var updateScore = function(id, score) {
        $.ajax({
            type: 'PUT',
            url: rootURL + '/' + id,
            dataType: "json", // data type of response
            data: JSON.stringify({
                "score": score
            })
        });
    };

    /*
     *  Post score to DB needs score and name
     */

    var postScore = function(score, name) {
        $.ajax({
            type: 'POST',
            url: rootURL,
            dataType: "json", // data type of response
            data: JSON.stringify({
                "name": name,
                "score": score
            })
        });
    };

    return {
        getScores: getScores,
        getTopScore: getTopScore,
        updateScore: updateScore,
        postScore: postScore
    };

})();