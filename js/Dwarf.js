let Dwarf = function(x, y, playerId, figureId) {
    this.attack = 6;
    this.armour = 2;
    this.health = 12;
    this.attackSpan = 2;
    this.speed = 2;
    this.x = x;
    this.y = y;
    this.playerId = playerId;
    this.type = 'dwarf';
    this.id = figureId;
    this.maxHealth = 12;
};