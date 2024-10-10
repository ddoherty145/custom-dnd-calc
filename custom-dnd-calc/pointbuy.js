var HEROES = {};

// Initialize base values for all attributes
let baseStats = {
    str: 8,
    dex: 8,
    con: 8,
    int: 8,
    wis: 8,
    cha: 8
};

document.getElementById("base_str").innerHTML = baseStats.str;
document.getElementById("base_dex").innerHTML = baseStats.dex;
document.getElementById("base_con").innerHTML = baseStats.con;
document.getElementById("base_int").innerHTML = baseStats.int;
document.getElementById("base_wis").innerHTML = baseStats.wis;
document.getElementById("base_cha").innerHTML = baseStats.cha;

document.getElementById("cost_str").innerHTML = calculateCost(baseStats.str);
document.getElementById("cost_dex").innerHTML = calculateCost(baseStats.dex);
document.getElementById("cost_con").innerHTML = calculateCost(baseStats.con);
document.getElementById("cost_int").innerHTML = calculateCost(baseStats.int);
document.getElementById("cost_wis").innerHTML = calculateCost(baseStats.wis);
document.getElementById("cost_cha").innerHTML = calculateCost(baseStats.cha);


// Function to update the displayed base values
function updateBaseValues() {
    for (let stat in baseStats) {
        document.getElementById('base_' + stat).textContent = baseStats[stat];
        updateTotalStat(stat); // Update the final score and modifier
    }
}

// Function to update the total stat
function updateTotalStat(stat) {
    let baseValue = baseStats[stat];
    let bonusValue = getBonusValue(stat); 
    let total = baseValue + bonusValue;

    document.getElementById('total_' + stat).textContent = total;

    
    let modifier = Math.floor((total - 10) / 2);  
    document.querySelector(`[is="modifier_${stat}"]`).textContent = modifier;
}


function getBonusValue(stat) {
    let oneBonus = document.getElementById('one_' + stat).classList.contains('pressed') ? 1 : 0;
    let twoBonus = document.getElementById('two_' + stat).classList.contains('pressed') ? 2 : 0;
    return oneBonus + twoBonus;
}

function calculateCost(stat) {
    let cost = 0;
    if (stat >= 8 && stat <= 13) cost = stat - 8;
    else if (stat >= 14 && stat <= 15) cost = (stat - 13) * 2 + 5;
    return cost;
}

function calculateModifier(stat) {
    return Math.floor((stat - 10) / 2);
}

// Event listeners for the +1 and +2 buttons
document.querySelectorAll('.bonus.one').forEach(button => {
    button.addEventListener('click', function() {
        let stat = this.id.split('_')[1];
        this.classList.toggle('pressed'); // Toggle the pressed state
        updateTotalStat(stat); // Recalculate the total
    });
});

document.querySelectorAll('.bonus.two').forEach(button => {
    button.addEventListener('click', function() {
        let stat = this.id.split('_')[1];
        this.classList.toggle('pressed'); // Toggle the pressed state
        updateTotalStat(stat); // Recalculate the total
    });
});

document.querySelectorAll('.upper').forEach(button => {
    button.addEventListener('click', function() {
        let stat = this.id.split('_')[1];
        baseStats[stat]++;
        updateBaseValues(); 
    });
});

document.querySelectorAll('.downer').forEach(button => {
    button.addEventListener('click', function() {
        let stat = this.id.split('_')[1];
        baseStats[stat]--;
        updateBaseValues(); I
    });
});

document.getElementById("two_str").addEventListener("click", function() {
    baseStats.str += 2;
    updateStatsDisplay();
});

function updatePointsSpent() {
    let totalSpent = calculateCost(baseStats.str) + calculateCost(baseStats.dex) + 
                     calculateCost(baseStats.con) + calculateCost(baseStats.int) + 
                     calculateCost(baseStats.wis) + calculateCost(baseStats.cha);
    document.getElementById("points-used").innerHTML = totalSpent;
    document.getElementById("points-available").innerHTML = 27 - totalSpent;
}



updateBaseValues();


HEROES.pointbuyer = (function (){
    var pointsTotal = 27;
    var pointUsed = 0;
    var stats=["str","dex","con","int","wis","cha"];
    var costs = {"8": 0,"9": 1,"10": 2,"11": 3,"12": 4,"13": 5,"14": 7,"15": 9};
    var modifiers = {"8": -1,"9": -1,"10": 0,"11": 0,"12": 1,"13": 1,"14": 2,"15": 2,"16": 3,"17":3,"18":4}
    var starting_base = {str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8};
    var current_base = {str: 0, dex: 0, con: 0, wis: 0, int: 0, cha: 0};
    var current_bonus = {str: 0, dex: 0, con: 0, wis: 0, int: 0, cha: 0};
    var total_bonus = 0;
    var checkedRacialMods = [];
    const ancestry_choices = {
        dwarfMountain:{total:4,one:0,two:2},
        halfElf:{total:4,one:2,two:1},
        flex:{total:3,one:3,two:1},
        other:{total:3,one:1,two:1},
        human:{total:6,one:6,two:0},
        humanVariant:{total:2,one:2,two:0},
        triton:{total:3,one:3,two:0}
    };

    var ancestry_boosts = {
    };
    var set_span = function(type, value){
        document.getElementById(type).textContent=value;
    }
    var set_stat_span = function(type, key, value){
        document.getElementById(type+"_"+key).textContent=value;
    }
    var ancestry_change = function(){
        var ancestry_dropdown = document.getElementById("ancestry_dropdown");
        var selected_ancestry = ancestry_dropdown.options[ancestry_dropdown.selectedIndex].value;
        var ones=document.getElementsByClassName("bonus one");
        var twos=document.getElementsByClassName("bonus two");
        var pressedOnes=document.getElementsByClassName("bonus one pressed");
        var pressedTwos=document.getElementsByClassName("bonus two pressed");

        if (ancestry_choices[selected_ancestry].one > 0){
            for(let one of ones){
                one.classList.remove("hidden");
                if (ancestry_choices[selected_ancestry].one ==6){
                    one.classList.add("pressed");
                }
                if(ancestry_choices[selected_ancestry].one < pressedOnes.length ){
                    one.classList.remove("pressed");
                }
            }
        } else {
            for(let one of ones){
                addClass(one, "hidden");
                one.classList.remove("pressed");
            }

        }
        if (ancestry_choices[selected_ancestry].two > 0){
            for (let two of twos){
                two.classList.remove("hidden");
                if(ancestry_choices[selected_ancestry].two < pressedTwos.length ) {
                    two.classList.remove("pressed");
                }
            }
        } else {
            for (let two of twos){
                addClass(two, "hidden");
                two.classList.remove("pressed");
            }
        }   
        
        recalc();
        redraw();
    }
    var addClass = function(element,newClass) {
        var arr;
        arr = element.className.split(" ");
        if (arr.indexOf(newClass) == -1) {
            if (element.className==""){
                element.className = newClass;
            } else {
                element.className += " " + newClass;
            }
        }
    }

    var reset = function(){
        for (var stat in current_base){
            current_base[stat]=starting_base[stat];
        }
    }
    var recalc = function(){
        var tT=0;
        for (var stat in current_base){
            tT=tT+costs[current_base[stat]];
        }
        pointsUsed=tT
    
    
        var ancestry_dropdown = document.getElementById("ancestry_dropdown");
        var selected_ancestry = ancestry_dropdown.options[ancestry_dropdown.selectedIndex].value;
        var ones=document.getElementsByClassName("bonus one");
        var twos=document.getElementsByClassName("bonus two");


        for (var stat in current_base){
            let stat_one = document.getElementById("one_" + stat);
            let stat_two = document.getElementById("two_" + stat);
            if(stat_one.classList.contains("pressed")){
                current_bonus[stat] = 1;
            } else if(stat_two.classList.contains("pressed")){
                current_bonus[stat] = 2;
             } else {
                current_bonus[stat] = 0;
             }
         }
    }
    var redraw = function(){
        var tt=0;
        set_span("points-used",pointUsed);
        set_span("points-available",pointsTotal-pointsUsed);
        for (var stat in current_base){
            set_stat_span("base",stat,current_base[stat]);
            tt=current_base[stat]+current_bonus[stat];
            set_stat_span("total",stat,tt);
            if(modifiers[tt]>0){
                set_stat_span("modifier",stat,"+"+modifiers[tt]);
            } else {
                set_stat_span("modifier",stat,modifiers[tt]);
            }
            if(costs[current_base[stat]]==0){
                set_stat_span("cost",stat,"");
            } else {
                set_stat_span("cost",stat,costs[current_base[stat]]);
            }
        }
    }
    var bindChanges = function(stat){
        var statBase = document.getElementById("base_"+stat);
        var statUp = document.getElementById("up_"+stat);
        var statDown = document.getElementById("down_"+stat);
        var statOne = document.getElementById("one_"+stat);
        var statTwo = document.getElementById("two_"+stat);
        var statBonuses = document.getElementsByClassName("bonus");
        statUp.addEventListener("click",function(event){
            event.preventDefault();
            if(current_base[stat]==15){return false;}
            if(pointsUsed==27){return false;}
            if(pointsUsed==26 && current_base[stat]>=13){return false;}
            current_base[stat]++;
            recalc();
            redraw();
        });
        statDown.addEventListener("click",function(event){
            event.preventDefault();
            if(current_base[stat]==8){return false;}
            if(pointsUsed==0){return false;}
            current_base[stat]--;
            recalc();
            redraw();
        });

        statOne.addEventListener('click', function(event){
            event.preventDefault()
            let selected_ancestry = ancestry_dropdown.options[ancestry_dropdown.selectedIndex].value
            let ones=document.getElementsByClassName("bonus one pressed");
            let twos=document.getElementsByClassName("bonus two pressed");
            let pressedNow = this.classList.contains("pressed");
            if(!pressedNow){
                statTwo.classList.remove("pressed");
                if ( ancestry_choices[selected_ancestry].one == ones.length ) {
                    ones[0].classList.remove('pressed')
                }
            }
            if(pressedNow || ((ancestry_choices[selected_ancestry].one > ones.length)&& ancestry_choices[selected_ancestry].total > (ones.length + 2*twos.length))){
                this.classList.toggle("pressed");
                if(pressedNow){
                    statTwo.classList.remove("pressed");
                }
            }
            recalc();
            redraw();
        });

    }

    var init = function () {
        var ancestry_dropdown = document.getElementById("ancestry_dropdown");
        ancestry_dropdown.addEventListener("change", ancestry_change);
        var choice_stats = document.getElementsByClassName("bonus");
        for (var i = 0; i < choice_stats.length; i++) {
            choice_stats[i].addEventListener("change", ancestry_change);
        }
        for (var stat in current_base) {
            bindChanges(stat);
        }
        reset();

        ancestry_dropdown.value = 'flex';
        ancestry_change();
    };

    return{
        init: init
    };
})();

(function(funcName, baseObj){

    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;
    function ready(){
        if (!readyFired) {
            readyFired = true;
            for (var i = 0; i < readyList.length; i++){
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            readyList = [];
        }
    }
    function readyStateChange(){        if ( document.readyState === "complete" ){  ready();}}
    baseObj [funcName] = function(callback, context) {
        if (typeof callback !== "function") {
            throw new TypeError("callback for docReady(fn) must be a function");
        }
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            readyList.push({fn: callback, ctx: context});
        }
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", ready, false);
                window.addEventListener("load", ready, false);

            } else {
                document.attachEvent("onreadystatchange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyeventHandlersInstalled = true;
        }
    }
})("docReady", window);

docReady(function(){
    HEROES.pointbuyer.init();
});