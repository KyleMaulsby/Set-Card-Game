'use strict';
//(function(){
const color = ["Red","Green","Purple"];
const fill = ["E","H","F"];
const amount = ["1","2","3"];
const shape = ["D","S","O"];

const path =["M25 0 L50 50 L25 100 L0 50 Z",
    "M38.4,63.4c0,16.1,11,19.9,10.6,28.3c-0.5,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20 c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z",
    "M25,99.5C14.2,99.5,5.5,90.8,5.5,80V20C5.5,9.2,14.2,0.5,25,0.5S44.5,9.2,44.5,20v60 C44.5,90.8,35.8,99.5,25,99.5z"];

let cards = [];
// Builds the deck
for(let c=0;c<3;c++) {
    for (let f = 0; f < 3; f++) {
        for (let a = 0; a < 3; a++) {
            for (let s = 0; s < 3; s++) {
                let obj = {
                    color: "",
                    fill: "",
                    amount: "",
                    shape: "",
                    path:""
                };
                obj.color = color[c];
                obj.fill = fill[f];
                obj.path = path[s];
                obj.amount = amount[a];
                obj.shape = shape[s];
                cards.push(obj);
            }
        }
    }
}
let Deck = [];
// shuffles the cards into a random sequence in the array
const shuffleDeck = function(cards){
    Deck = [];
    // pushes a card from cards array to the deck array in a random order
    for(let i=81;i>0;i--){
        let rand = Math.floor(Math.random()*i);
        //removes card from card array as to not make duplicates
        let card = cards.splice(rand,1);
        Deck.push(card[0]);
    }
};
const drawCard = function(deck){
// "draws" top most card
    let card = deck[0];
    deck.splice(0,1);
    let data = "";
    // loop to build the svg img depending on how many shapes are on the card
    for(let i=0;i<card.amount;i++) {
        data += '<svg viewbox="-2 -2 54 104" class="img" height="100" width="50"  stroke="' + card.color + '" stroke-width="3">';
        if(card.fill === "H") {
            data += '<path  d="' + card.path + '" fill="url(#striped-' + card.color + ')"/></svg>'
        }else if(card.fill === "F"){
            data += '<path  d="' + card.path + '" fill="' + card.color + '"/></svg>'
        }else{
            data += '<path  d="' + card.path + '" fill="none"/></svg>'
        }
    }
    let newCard = $("<div/>", {
        class: 'card col-4',
        id: card.color+ card.fill+ card.amount+ card.shape,
        html: data
    }).data("color", card.color)
        .data("shape", card.shape)
        .data("amount", card.amount)
        .data("fill", card.fill);
    board.push(newCard);
    return newCard;
};

let board = [];
const makeBoard = function(){
    $("#table").html("");
    while(board.length<12){
        $("#table").append(drawCard(Deck));
    }
};
const isMatch = function(set){
    let data = [[],[],[],[]];
    //builds an array of arrays to store card data for each type of data
    set.forEach(function(type) {
        data[0].push(type.data("color"));
        data[1].push(type.data("fill"));
        data[2].push(type.data("amount"));
        data[3].push(type.data("shape"));
    });
    let sameOrDiff = true;
    // tests to see if any array within the data array all match or all differ
    data.forEach(function(type) {
        if (type[0] === type[1] && type[0] === type[2]) { // if all match
        } else if (type[0] !== type[1] && type[0] !== type[2] && type[1] !== type[2]) { // if all differ
        } else {
            sameOrDiff = false;
        }
    });
    return sameOrDiff;
};
// tests the 3 current cards to see if they are a correct match
const testSet = function(){
    setTimeout(function(){
        if(isMatch(selected)){
            selected.forEach(function(obj){
                if(board.length > 12) {
                    obj.remove();
                }else{
                    obj.replaceWith(drawCard(Deck));
                }
                board.forEach(function(card){
                    if(card.attr('id') === obj.attr('id')){
                        board.splice(board.indexOf(card),1);
                    }
                });
            });
            // clears out old hint tracking data
            selected = [];
            hintarr = [];
            hintcount = 0;

        }else{
            selected = [];
        }
        $(".card").removeClass("selected");
    },250);
};
const draw3 = function(deck){
    if(board.length<15) {
        for (let i = 0; i < 3; i++) {
            $("#table").append(drawCard(deck));
        }
    }
};
$("#add3").on("click",function(){
    draw3(Deck);
});

let hintarr = [];
let hintcount = 0;
// looks at the board array to find a matching set and give a hint to the player
const hint = function(){
    if(hintarr.length === 0) {
    // iterates through the board array and tests all possible sets till it finds a match then adds that set to the "hintarr" for further refrence
        for (let a = 0; a < board.length; a++) {
            for (let b = 0; b < board.length; b++) {
                for (let c = 0; c < board.length; c++) {
                //makes sure to not count tests that involve duplicates // could be optimized in the future to not test these at all
                    if (isMatch([board[a], board[b], board[c]]) && (board[a] !== board[b]) && (board[a] !== board[c]) && (board[b] !== board[c])) {
                        hintarr = [board[a], board[b], board[c]];
                        let id = "#"+hintarr[hintcount].attr("id");
                        $(id).addClass("hint");
                        hintcount++;
                        return  null;
                    }
                }
            }
        }
        // if no possible sets are found it will automatically invoke the draw3 function
        if(hintarr.length === 0){
            draw3(Deck);
        }
    }else{
    //does nothing if 3 cards are currently highlighted with hints
        if(hintcount > 2){
        }else {
            let id= "#"+hintarr[hintcount].attr("id");
            $(id).addClass("hint");
            hintcount++
        }
    }
};
$("#hint").on("click",function(){
    hint();
});

shuffleDeck(cards);
makeBoard();

let selected = [];
$("#table").on("click",".card",function(){
    let card = $(this);
     if(card.hasClass("selected")){
        card.toggleClass("selected");
        selected.splice(selected.indexOf(card),1);
    } else if(selected.length < 3) {
        card.toggleClass("selected");
        selected.push(card);
        if(selected.length === 3){
            testSet();
        }
    }
});

//})();