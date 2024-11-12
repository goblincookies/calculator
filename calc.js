let keys = document.querySelectorAll(".key");
let typeBox = document.querySelector("#user-input");
let inputA = document.querySelector("#input-a");
let inputB = document.querySelector("#input-b");
let printLines = document.querySelector("#print-out").querySelectorAll("div");

let userInput = "";

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
        shiftUp()
        inputB.textContent="";
        typeBox.classList.remove("yellow");
        typeBox.classList.add("green");
        displayingAnswer = false;
        inputA.classList.remove("right");
        userInputClear();
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
        addKeyPress( e.target.id);
    }

};

function makeHighlighSpan() {
    let span = document.createElement("span");
    span.classList.add("yellow");
    return span;
}

function parseVal( val) {
    // IT'S A NUMBER
    if (parseInt(val).toString() == val ) {
        return val;
    }
    // CHECK IF PREV IS THE SAME
    console.log( "prev is: " + userInput[userInput.length-1])
    console.log( "this is: " + val )

    if (userInput[userInput.length-1] != val ) {

        // CHECK PREV IS NOT A SYMBOL
        if ( !isNaN( parseInt(userInput[userInput.length-1]))) {

            return val;
        } else {
            deleteCharacter();
            return val;

        }
    }
    return "";
}

function addKeyPress( val ) {

    // NUMBER: GO
    // SYMBOL: DEPENDS ON PREV
    //      PERCENT: GO
    //      FIRST ANYTHING: GO
    //      FIRST SYMBOL WITH DECIMAL: GO
    //      SECOND DECIMAL, WITH EXISTING SYMBOL: GO
    //      SYMBOL WITH NO PREV VALUE: PULL LINE-B, GO


     // IT'S A NUMBER
     if (parseInt(val).toString() == val ) {
        userInputAdd(val);
    } else {
        // IT'S A SYMOBL
        let currentInput = userInput.split(/[0-9]/).filter(i => i);
        switch(val) {
            case "%":
                if (userInput.length<1) {
                    // PULL PREVIOUS NUMBER 
                } else {
                    let n = userInput[userInput.length-1];
                    console.log(typeof n);
                    if ( n== "%" | n=="." | parseInt(n).toString()==n ) {
                        userInputAdd(val);
                    }
                };
                break;
            case ".":
                if (userInput[userInput.length-1] != "%"){
                    
                    // let n = userInput.split(/[0-9%.]/).filter(i => i);
                    let n = currentInput.filter(i=>i==".");
                    
                    if (n.length <1) {
                        userInputAdd(val);
                    } else if (n.length < 2 & currentInput.length > 1) {
                        userInputAdd(val);
                    }
                }
                break;
                // break;
            case "-": //ACCOUNT FOR NEGATIVES
            case "+":
            case "*":
            case "/":
                if (userInput.length<1) {
                    // PULL PREVIOUS NUMBER 
                } else {
                    let n = userInput.split(/[0-9%.]/).filter(i => i);
                    if ( ["-","+","*","/"].some( el => userInput[userInput.length-1].includes(el) ) ) {
                        deleteCharacter();
                        userInputAdd(val);
                    } else if (n.length < 1) {
                        userInputAdd(val);
                    }
                }

                break;
        }

    }

    // // CHECK IF PREV IS THE SAME
    // console.log( "prev is: " + userInput[userInput.length-1])
    // console.log( "this is: " + val )

    // if (userInput[userInput.length-1] != val ) {

    //     // CHECK PREV IS NOT A SYMBOL
    //     if ( !isNaN( parseInt(userInput[userInput.length-1]))) {

    //         return val;
    //     } else {
    //         deleteCharacter();
    //         return val;

    //     }
    // }



    // // val = parseVal( val);

    // userInputAdd(val);
}

function userInputClear() {
    userInput = "";
    typeBox.textContent = userInput;
}

function userInputAdd( val) {
    userInput += val;
    typeBox.textContent = userInput;
}
function userInputDelete() {
    userInput = userInput.slice(0, -1);
    typeBox.textContent = userInput;
}

function deleteCharacter () {
    // CHECK IF THERES MORE THAN ONE CHARACTER
    // SIMPLE DELETE
    console.log(userInput);
    userInputDelete();
    // typeBox.textContent = typeBox.textContent.slice(0,-1);
}
function clearScreen() {
    userInputClear();
    for (let i= 0; i < printLines.length-3; i++) {
        printLines[i].textContent = "";
    }
}

function shiftUp() {
    for (let i= 0; i < printLines.length-2; i++) {
        if (printLines[i+2].childElementCount > 0 ) {
            // SKIP THE CURSOR
            printLines[i].textContent = printLines[i+2].children[0].textContent
        } else {
            // SIMPLE COPY UP
            printLines[i].textContent = printLines[i+2].textContent
        }
    }
}

function calcSolution() {
    displayingAnswer = true;
    cursorVisibility(false);
    inputB.textContent = userInput;
    typeBox.classList.remove("green");
    typeBox.classList.add("yellow");
    inputA.classList.add("right");
    typeBox.textContent = "hello!";
    let numbers = userInput.split(/[/*-+]/); //.filter(i=>i);
    let operations = userInput.split(/[0-9.%]/).filter(i => i);
    console.log("my recorded input is: ", userInput);
    console.log("the numbers are ", numbers);
    console.log("the operations are " + operations);
}

