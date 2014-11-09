var Jewels = function(game) {
    Phaser.Group.call(this, game);

    this.createMultiple(60, 'jewels');
    this.setAll('inputEnabled', true);
    this.setAll('input.useHandCursor', true);

};

// creating a prefab that inherites phaser group methods
Jewels.prototype = Object.create(Phaser.Group.prototype);
Jewels.prototype.constructor = Jewels;

Jewels.prototype.createGW = function(gridSizeX, gridSizeY) {

    // Go through the grid (6x6)
    for (var i = 0; i < gridSizeX; i++) {
        for (var j = 0; j < gridSizeY; j++) {
            // Create a jewel at each spot
            this.addJewel(i, j);
        }
    }
};

Jewels.prototype.addJewel = function(i, j) {
    // Retrive a dead jewel from the group
    var jewel = this.getFirstDead();
    if (!jewel) {
        return;
    }

    // Create the jewel grid on the screen offset by 70, 300 so the grid is where I want it
    // add to the jewel widths and heights to give the rows/columns some space
    jewel.scale.setTo(1, 1);
    jewel.reset(70 + i * (jewel.width + 20), 300 + j * (jewel.height + 10));
    jewel.anchor.setTo(0.5, 0.5);
    jewel.frame = game.rnd.integerInRange(0, 3);

    // Add custom parameters to the jewel
    jewel.i = i;
    jewel.j = j;
    jewel.selected = false;

    // Tween in the jewels when they spawn
    jewel.scale.setTo(0, 0);
    this.game.add.tween(jewel.scale).to({
        x: 1,
        y: 1
    }, 200).start();
};

Jewels.prototype.findClickedJewel = function() {
    // find the grid coordinate of the jewel
    var x = game.input.activePointer.x,
        y = game.input.activePointer.y;

    // Convert the x, y point into i,j value// 
    // subtracting our pointer by our offset then adding the width/height of the diamond
    // dividing that by our tileset width to get our grid number
    var i = Math.floor((x - 70 + 40) / 100);
    var j = Math.floor((y - 300 + 40) / 83);


    return this.getJewel(i, j);
};

Jewels.prototype.selectJewels = function(i, j, frame) {
    // Get the corresponding jewel
    var jewel = this.getJewel(i, j);
    if (!jewel) {
        return;
    }

    // If the jewel maches the color we are looking for (the same frame)
    if (jewel.frame == frame && !jewel.selected) {
        // Then select the jewel
        jewel.selected = true;
        BasicGame.jewelsSelected += 1;

        // And recursively call the function for all the adjacent jewels
        this.selectJewels(i, j - 1, frame);
        this.selectJewels(i, j + 1, frame);
        this.selectJewels(i - 1, j, frame);
        this.selectJewels(i + 1, j, frame);
    }
};

// return the do i, j
Jewels.prototype.getJewel = function(i, j) {
    var jewelIJ;

    // We go through every jewels to find the one we are looking for
    this.forEachAlive(function(jewel) {
        if (jewel.i == i && jewel.j == j) {
            jewelIJ = jewel;
        }
    }, this);

    return jewelIJ;
};

Jewels.prototype.removeSelectedJewels = function(gridSizeX, gridSizeY) {
    // Go through all the jewels
    for (var i = 0; i < gridSizeX; i++) {
        for (var j = 0; j < gridSizeY; j++) {
            var jewel = this.getJewel(i, j);

            if (jewel.selected) {
                // explode the selected jewels
                var explode = new Explosion(this.game);

                explode.explodeJewel(jewel.x, jewel.y, jewel.frame);
                // If the jewel is selected, kill it with a tween
                this.game.add.tween(jewel.scale).to({
                    x: 0,
                    y: 0
                }, 200).start();
                jewel.alive = false;
            }
        }
    }
};

Jewels.prototype.moveJewelsDown = function(gridSizeX, gridSizeY) {
    // Go through the grid
    for (var i = 0; i < gridSizeX; i++) {
        var moveBy = 0;

        for (var j = gridSizeY - 1; j >= 0; j--) {
            var jewel = this.getJewel(i, j);

            if (!jewel) {
                // If a jewel is missing
                // It means that the jewels above will have to move down
                moveBy += 1;
            } else if (moveBy > 0) {
                // If there is a jewel, and it should move down
                // Move it down by the correct amount (moveBy) // adding + 10 to height
                this.setJewel(i, j, j + moveBy);
                this.game.add.tween(jewel).to({
                    y: jewel.y + moveBy * (jewel.height + 10)
                }, 300).start();
            }
        }
    }
};

Jewels.prototype.addMissingJewels = function(gridSizeX, gridSizeY) {
    // Go through the grid
    for (var i = 0; i < gridSizeX; i++) {
        for (var j = gridSizeY - 1; j >= 0; j--) {
            var jewel = this.getJewel(i, j);

            if (!jewel) {
                // If a jewel is missing, add a new one
                this.addJewel(i, j);
            }
        }
    }
};

Jewels.prototype.setJewel = function(i, j, newJ) {
    var jewel = this.getJewel(i, j);
    jewel.j = newJ;
};