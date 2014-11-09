BasicGame.Game = function(game) {

    // set gridsize
    this.grideSizeX = 6;
    this.grideSizeY = 6;

};

BasicGame.Game.prototype = {

    create: function() {
        // Set game vars
        this.moveCount = 20;

        this.score = 0;

        BasicGame.jewelsSelected = 0;

        // creating hud using graphics
        this.hud = game.add.graphics(0, 0);

        this.hud.beginFill(0x00ffff);
        this.hud.lineStyle(5, 0x606060, 1);
        this.hud.drawRect(0, 0, this.game.width, 100);

        this.hud.moveTo(game.world.centerX, 0);
        this.hud.lineTo(game.world.centerX, 100);
        this.hud.endFill();

        // calling our prefab jewels
        this.jewels = new Jewels(this.game);
        this.jewels.createGW(this.grideSizeX, this.grideSizeY);

        // Moves Label
        this.movesLabel = this.game.add.text(35, 35, 'Moves Left', {
            font: '30px Arial',
            fill: '#606060'
        });

        // Moves left
        this.movesLeft = this.game.add.text(205, 30, '20', {
            font: '40px Arial',
            fill: '#606060'
        });

        // score Label
        this.scoreLabel = this.game.add.text(game.world.width - 200, 35, 'Score', {
            font: '30px Arial',
            fill: '#606060'
        });

        // score
        this.scoreText = this.game.add.text(game.world.width - 100, 30, '0', {
            font: '40px Arial',
            fill: '#606060'
        });

        // Call 'clicked' when the user clicks
        this.game.input.onDown.add(this.clicked, this);

        //sounds
        this.nonclick = this.add.audio('nonclick');
        this.explosion = this.add.audio('explosion');
        this.endgame = this.add.audio('endgame');
        this.pointsound = this.add.audio('points');

        // place holder for next best score from db
        var nextScore = BasicGame.scoreToBeat;

        if (nextScore) {
            var nextScoreText = game.add.text(game.world.centerX, game.world.centerY + 350, 'Rival Score: ' + nextScore, {
                font: '36px Arial',
                fill: '#606060'
            });
            nextScoreText.anchor.setTo(0.5, 0.5);
        }
    },

    update: function() {

        //  Do I even need an update function?

    },

    clicked: function() {
        // If jewels are already selected, do nothing
        if (BasicGame.jewelsSelected != 0) {
            this.nonclick.play();
            return;
        }

        // Return the jewel that is below the pointer
        // If there is no jewel, do nothing
        var jewel = this.jewels.findClickedJewel();
        if (!jewel) {
            this.nonclick.play();
            return;
        }

        // Set 'jewel.selected = true' to all the jewels that should be removed
        // If only 1 jewel is selected: do nothing
        this.jewels.selectJewels(jewel.i, jewel.j, jewel.frame);
        if (BasicGame.jewelsSelected == 1) {
            this.nonclick.play();
            this.jewels.setAll('selected', false);
            BasicGame.jewelsSelected = 0;
            return;
        }

        // remove the jewels and update score
        this.jewels.removeSelectedJewels(this.grideSizeX, this.grideSizeY);
        this.explosion.play();
        // update score and movecount
        this.updateScore();
        this.pointsound.play();
        // add flying text for score
        this.flyingText(game.input.activePointer.x, game.input.activePointer.y, BasicGame.jewelsSelected);

        // Once the jewels finish disapearing: refill the world with jewels
        this.game.time.events.add(300, this.refillJewels, this);
    },

    // flying text for score
    flyingText: function(x, y, amount) {
        if (amount == 0) {
            return;
        }

        var flyText = game.add.text(x - 30, y - 80, '+' + amount, {
            font: 'bold 50px Arial',
            fill: '#2CD82C'
        });

        game.add.tween(flyText).to({
            y: flyText.y - 150
        }, 500, Phaser.Easing.Quadratic.In, true).onComplete.add(function(text) {
            text.destroy();
        }, this);
    },

    // Add back the jewels to the screen and reset the selected count
    refillJewels: function() {
        this.jewels.moveJewelsDown(this.grideSizeX, this.grideSizeY);
        this.jewels.addMissingJewels(this.grideSizeX, this.grideSizeY);

        BasicGame.jewelsSelected = 0;
    },

    updateScore: function() {
        // Update the score
        this.score += BasicGame.jewelsSelected;
        this.scoreText.text = this.score;


        // update move count
        this.moveCount--;
        this.movesLeft.text = this.moveCount;

        // End the game when moves get to 0
        if (this.moveCount <= 0) {
            this.game.time.events.add(600, this.quitGame, this);
        }
    },

    quitGame: function(pointer) {

        var isNewHighScore = false; // flag for high score

        // grab highscore from local storage if it is there

        if (BasicGame.highScore < this.score) {
            isNewHighScore = true;
            BasicGame.highScore = this.score;
        }

        // If score is higher than 50 get a name and post to the leaderboard
        if (BasicGame.highScore > 50) {
            this.getName(BasicGame.name);

            if (BasicGame.scoreID > 0) {
                Leaderboard.updateScore(BasicGame.scoreID, BasicGame.highScore);
            } else {
                var leaderboardNameNew = localStorage.getItem('samJeweledName');
                Leaderboard.postScore(BasicGame.highScore, leaderboardNameNew);
            }
        }
        //  Then let's go back to the main menu.
        this.endgame.play();
        this.state.start('MainMenu');

    },

    // prompt the user for a name, basic validation included
    getName: function(name) {
        if (!name) {
            name = prompt("Please enter your name for the Leaderboard.", "");
        }

        if (name == '' || name == 'null' || name == null) {
            name = 'Guest' + game.rnd.integer();
        }

        while (name.length > 20) {
            name = prompt("Please enter your name using less than 20 characters.");
        }

        localStorage.setItem('samJeweledName', name);

    },
    render: function() {
        //this.game.debug.inputInfo(16, 200);
    },
    postScores: function(highscore) {
        // Create our XMLHttpRequest object
        var hr = new XMLHttpRequest();
        // Create some variables we need to send to our PHP file
        var url = "api/addScore.php";
        var fn = localStorage.getItem('samJeweledName');
        var ln = highscore;
        var vars = "name=" + fn + "&score=" + ln + "&session=" + session;
        hr.open("POST", url, true);
        hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        // Access the onreadystatechange event for the XMLHttpRequest object
        hr.onreadystatechange = function() {

            if (hr.readyState == 4 && hr.status == 200) {
                var return_data = hr.responseText;
                console.log(return_data);
            }
        }
        // Send the data to PHP now... and wait for response to update the status div
        hr.send(vars); // Actually execute the request
        console.log('processing...');
    }

};