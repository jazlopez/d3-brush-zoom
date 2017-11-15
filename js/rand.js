var rand = function(min, max) {

    /**
     * default
     */

    if(!min){
        min = 2;
    }

    if(!max) {
        max = 20;
    }

    var min = Math.ceil(min);
    var max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min;
};

