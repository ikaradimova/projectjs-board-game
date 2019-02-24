let Knight = function(x, y, playerId, figureId) {
    this.attack = 8;
    this.armour = 3;
    this.health = 15;
    this.attackSpan = 1;
    this.speed = 1;
    this.x = x;
    this.y = y;
    this.playerId = playerId;
    this.type = 'knight';
    this.id = figureId;
    this.maxHealth = 15;
};
