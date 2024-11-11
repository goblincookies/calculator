let keys = document.querySelectorAll(".key");
let userInput = document.querySelector("#user-input");
let inputA = document.querySelector("#input-a");


let values = "";
// let curIndex=0;

let cursorVisible = true;
let displayingAnswer = false;
let blinkSpeed = 400;
let cursor = document.getElementById('cursor');

keys.forEach( key => key.addEventListener("click", keyPress) );

// BLINKING CURSOR
setInterval(() => {
    if (!displayingAnswer) {
        // cursorVisibility( cursorVisible )
        cursor.style.opacity = cursorVisible+0;
        cursorVisible = !cursorVisible;
    }
}, blinkSpeed);

function cursorVisibility( val ) {
    cursor.style.opacity = val+0;
    cursorVisible = val;
}

function keyPress(e) {

    if (displayingAnswer) {
        displayingAnswer = false;
        inputA.classList.remove("right");
        userInput.textContent = "";
        values = "";
    }
    console.log( e.target.id );
    let isNumber = true;

    switch( e.target.id) {
        case "clear":
            clearScreen();
            isNumber = false;
            break;
        case "del":
            deleteCharacter();
            isNumber = false;
            break;
        case "calc":
            calcSolution();
            isNumber = false;
            break;
    }

    if (isNumber) {
        cursorVisibility(false);
        addCharacter( e.target.id);
    }
};


function parseVal( val) {

    // IT'S A NUMBER
    if (parseInt(val).toString() == val ) {
        
        return val;
    }

    // CHECK IF PREV IS THE SAME
    console.log( "prev is: " + values[values.length-1])
    console.log( "this is: " + val )

    if (values[values.length-1] != val ) {

        // CHECK PREV IS NOT A SYMBOL
        if ( !isNaN( parseInt(values[values.length-1]))) {

            return val;
        } else {
            deleteCharacter();
            return val;

        }
    }
    return "";
}

function addCharacter( val ) {
    val = parseVal( val)

    values += val;
    userInput.textContent += val;
}

function deleteCharacter () {
    // CHECK IF THERES MORE THAN ONE CHARACTER
    // SIMPLE DELETE
    console.log(values)
    values = values.slice(0-1);
    userInput.textContent = userInput.textContent.slice(0,-1);
    // if ( values.length > 0) {
    // }
}
function clearScreen() {
    values = "";
    userInput.textContent = "";
}
// function updateLine() {
// }
function calcSolution() {
    displayingAnswer = true;
    cursorVisibility(false);
    inputA.classList.add("right");
    userInput.textContent = "hello!";
    let numbers = values.split(/[/*-+%]/).filter(i=>i)
    let operations = values.split(/[0-9]/).filter(i => i);;
    console.log("the numbers are " + numbers);
    console.log("the operations are " + operations);
}