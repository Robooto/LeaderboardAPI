var Explosion = function(game) {

    // properties for emitters
    this.emitterprop = {
        ySpeedL: -50,
        ySpeedH: 200,
        xSpeedL: -250,
        xSpeedH: 250,
        minScale: 0.5,
        maxScale: 2.5,
        gravity: 300
    };

    // Init emitter for jewel explosions
    this.pix0Emitter = game.add.emitter(0, 0, 80);
    this.pix0Emitter.makeParticles('pix0');
    this.pix0Emitter.setYSpeed(this.emitterprop.ySpeedL, this.emitterprop.ySpeedH);
    this.pix0Emitter.setXSpeed(this.emitterprop.xSpeedL, this.emitterprop.xSpeedH);
    this.pix0Emitter.minParticleScale = this.emitterprop.minScale;
    this.pix0Emitter.maxParticleScale = this.emitterprop.maxScale;
    this.pix0Emitter.gravity = this.emitterprop.gravity;

    this.pix1Emitter = game.add.emitter(0, 0, 80);
    this.pix1Emitter.makeParticles('pix1');
    this.pix1Emitter.setYSpeed(this.emitterprop.ySpeedL, this.emitterprop.ySpeedH);
    this.pix1Emitter.setXSpeed(this.emitterprop.xSpeedL, this.emitterprop.xSpeedH);
    this.pix1Emitter.minParticleScale = this.emitterprop.minScale;
    this.pix1Emitter.maxParticleScale = this.emitterprop.maxScale;
    this.pix1Emitter.gravity = this.emitterprop.gravity;

    this.pix2Emitter = game.add.emitter(0, 0, 80);
    this.pix2Emitter.makeParticles('pix2');
    this.pix2Emitter.setYSpeed(this.emitterprop.ySpeedL, this.emitterprop.ySpeedH);
    this.pix2Emitter.setXSpeed(this.emitterprop.xSpeedL, this.emitterprop.xSpeedH);
    this.pix2Emitter.minParticleScale = this.emitterprop.minScale;
    this.pix2Emitter.maxParticleScale = this.emitterprop.maxScale;
    this.pix2Emitter.gravity = this.emitterprop.gravity;

    this.pix3Emitter = game.add.emitter(0, 0, 80);
    this.pix3Emitter.makeParticles('pix3');
    this.pix3Emitter.setYSpeed(this.emitterprop.ySpeedL, this.emitterprop.ySpeedH);
    this.pix3Emitter.setXSpeed(this.emitterprop.xSpeedL, this.emitterprop.xSpeedH);
    this.pix3Emitter.minParticleScale = this.emitterprop.minScale;
    this.pix3Emitter.maxParticleScale = this.emitterprop.maxScale;
    this.pix3Emitter.gravity = this.emitterprop.gravity;

};

Explosion.prototype.explodeJewel = function(x, y, frame) {

    // use the correct sprite for each jewel
    switch (frame) {
        case 0:
            this.pix0Emitter.x = x;
            this.pix0Emitter.y = y;
            this.pix0Emitter.start(true, 500, null, 10);
            break;
        case 1:
            this.pix1Emitter.x = x;
            this.pix1Emitter.y = y;
            this.pix1Emitter.start(true, 500, null, 10);
            break;
        case 2:
            this.pix2Emitter.x = x;
            this.pix2Emitter.y = y;
            this.pix2Emitter.start(true, 500, null, 10);
            break;
        case 3:
            this.pix3Emitter.x = x;
            this.pix3Emitter.y = y;
            this.pix3Emitter.start(true, 500, null, 10);
            break;
    }

};