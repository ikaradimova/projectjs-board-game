let Player = function(id, name, points){
    this.maxNumberOfKnights = 2;
    this.knights = 0;
    this.maxNumberOfElves = 2;
    this.elves = 0;
    this.maxNumberOfDwarfs = 2;
    this.dwarfs = 0;
    this.name = name;
    this.id = id;
    this.points = points;
    this.numberOfFigures = 0;
    this.figures = [];
    this.lostFigures = [];

    // function numberOfFigures(){
    //     return (this.knights + this.dwarfs + this.elves);
    // }
};