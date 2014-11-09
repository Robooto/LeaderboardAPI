$(initPage);

function initPage() {

    // Handlebar templates

    // my links template
    var sourceLinks = $(".my-links-hb").html();
    var templateLinks = Handlebars.compile(sourceLinks);
    var links = {
        links: [{
            href: 'https://github.com/Robooto',
            text: 'Github'
        }, {
            href: 'https://twitter.com/samwrussell',
            text: 'Twitter'
        }, {
            href: 'https://www.facebook.com/sam.russell.904',
            text: 'Facebook'
        }]
    };
    $(".my-links").html(templateLinks(links));


    // Handlebar setup
    var sourceBoard = $('.scoreList-hb').html();
    var templateBoard = Handlebars.compile(sourceBoard);

    // Handlebar helper to get the correct rank on the leaderboard
    Handlebars.registerHelper("inc", function(value, options) {
        return parseInt(value) + 1;
    });

    /*
     * Calling leaderboard getScore Method once the request is successful render the leaderboard
     */
    Leaderboard.getScores().done(function(response) {
        $("#scoreList").html(templateBoard(response));
    }).fail(function(response) {
        $('#scoreList').text("Could not retrieve score data.")
    });


    /*
     * High light your name on the leaderboard
     */

    // You could create a handlebar helper for this...maybe an update
    var name = localStorage.getItem('samJeweledName');

    if (name) {
        $('tbody').find('td.name').each(function() {
            if ($(this).text() == name) {
                $(this).addClass('success').siblings().addClass('success');
            }
        });
    }


}