BasicGame.MainMenu = function(game) {

};

BasicGame.MainMenu.prototype = {

    create: function() {
        // Display top score
        BasicGame.name = localStorage.getItem('samJeweledName');


        // binding this since my done function is in its own scope.
        Leaderboard.getTopScore(BasicGame.name).done(function(response) {
            this.displayTopScore(response);
        }.bind(this));

        // load big diamond
        var bigD = this.game.add.sprite(game.world.centerX, 370, 'bigjewel');
        bigD.anchor.setTo(0.5);

        // leaderboard button
        var leaderboardButton = this.game.add.button(game.world.centerX, this.game.height - 40, 'leaderboard', this.openLeaderboard, this, 1, 0);
        leaderboardButton.anchor.setTo(0.5);
        // if the mouse is over the button, it becomes a hand
        leaderboardButton.input.useHandCursor = true;

        // emitter for fun
        var menuEmitter = game.add.emitter(game.world.centerX, this.game.height);
        menuEmitter.makeParticles('jewels', [0, 1, 2, 3], 20);
        menuEmitter.start(false, 9000);
        menuEmitter.setYSpeed(-105, -450);
        menuEmitter.setXSpeed(-100, 100);

        // Name of the game
        var nameLabel = game.add.text(game.world.centerX, 390, 'Sam Jeweled', {
            font: 'bold 70px Arial',
            fill: '#606060'
        });
        nameLabel.anchor.setTo(0.5, 0.5);

        // How to start the game
        var startLabel = game.add.text(game.world.centerX, 900, 'Tap the screen to Start', {
            font: '26px Arial',
            fill: '#606060'
        });
        startLabel.anchor.setTo(0.5, 0.5);

        game.add.tween(startLabel).to({
            angle: -2
        }, 500).to({
            angle: 2
        }, 500).loop().start();

        // Add a mute button
        this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
        this.muteButton.input.useHandCursor = true;
        this.muteButton.scale.setTo(2);
        if (game.sound.mute) {
            this.muteButton.frame = 1;
        }

        // start the game on tap
        this.game.input.onDown.addOnce(this.start, this);

        // start game sound
        this.startsound = this.add.audio('startgame');

    },

    toggleSound: function() {
        game.sound.mute = !game.sound.mute;
        this.muteButton.frame = game.sound.mute ? 1 : 0;
    },

    openLeaderboard: function() {
        // change this to the leaderboard url
        window.open("leaderboard/leaderboard.html", "_blank");
    },

    start: function() {
        this.startsound.play();
        game.state.start('Game');
    },

    displayTopScore: function(score) {
        if (score) {
            BasicGame.highScore = score.score;
            BasicGame.scoreID = score.id;
            var highScoreText = game.add.text(game.world.centerX, game.world.centerY + 55, 'Top Score: ' + BasicGame.highScore, {
                font: '36px Arial',
                fill: '#606060'
            });
            highScoreText.anchor.setTo(0.5, 0.5);
        }
    }

};