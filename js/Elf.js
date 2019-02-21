let Elf = function(x, y, playerId, figureId) {
    this.attack = 5;
    this.armour = 1;
    this.health = 10;
    this.attackSpan = 3;
    this.speed = 3;
    this.x = x;
    this.y = y;
    this.playerId = playerId;
    this.type = 'elf';
    this.id = figureId
};