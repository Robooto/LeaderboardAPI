BasicGame = {

    /* Here we've just got some global level vars that persist regardless of State swaps */
    highScore: 0,

    scoreToBeat: 0,

    /* Your game can check BasicGame.orientated in internal loops to know if it should pause or not */
    orientated: false,

    jewelsSelected: 0,

    scoreID: 0,

    name: null

};

BasicGame.Boot = function(game) {};

BasicGame.Boot.prototype = {

    preload: function() {

        this.load.image('progressBar', 'assets/images/progressBar.png');

    },

    create: function() {

        // Set a background color and the physic system
        game.stage.backgroundColor = '#FFFFFF';
        // not using physics in this game
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop) {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(320, 480, 640, 1136);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.setScreenSize(true);
            this.scale.refresh();
        } else {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(320, 480, 640, 1136);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.forceOrientation(false, true);
            this.scale.setResizeCallback(this.gameResized, this);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
            this.scale.setScreenSize(true);
            this.scale.refresh();
        }

        this.state.start('Preloader');

    },

    gameResized: function(width, height) {

        //  This could be handy if you need to do any extra processing if the game resizes.
        //  A resize could happen if for example swapping orientation on a device.

    },

    enterIncorrectOrientation: function() {

        BasicGame.orientated = false;

        document.getElementById('orientation').style.display = 'block';

    },

    leaveIncorrectOrientation: function() {

        BasicGame.orientated = true;

        document.getElementById('orientation').style.display = 'none';

    }

};