let keys = document.querySelectorAll(".key");
let typeBox = document.querySelector("#user-input");
let lineA = document.querySelector("#input-a");
let lineB = document.querySelector("#input-b");
let typeBoxB = lineB.querySelector(".print-display");
let printLines = document.querySelector("#print-out").querySelectorAll(".line");
let prevAnswer = "";
let userInput = "";

let cursorVisible = true;
let displayingAnswer = false;
let blinkSpeed = 400;
let cursor = document.getElementById('cursor');

keys.forEach( key => key.addEventListener("click", keyClick) );

document.addEventListener("keydown", keyPress);

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

function clearAnim() {
    printLines.forEach(el => {
        // el.classList.remove("shift-anim");
        el.querySelector(".print-display").classList.remove("shift-anim");

    });
}
function playShiftAnim() {
    console.log("playing anim..")

    printLines.forEach(el => {
        el.querySelector(".print-display").classList.add("shift-anim");
    });
}

function keyPress(e) {
    console.log(e.key);
    let val = e.key;

    switch( val) {
        case"Backspace":
        case"Delete":
            val = "del";
            break;
        case"Enter":
        case"Return":
            val = "calc";
            break;
        default:
            val = val.split(/[^\d*+-/%.]/).filter(i=>i);
            if (val.length > 0) {
                val = val[0];
            } else {
                val = "";
            }
            // break;
    }
    
    if (val.length > 0) {
        filterDigit(val);
    }


    // if (val == "Backspace" | val =="Delete") {
    //     val = "del";
    //     filterDigit(val);
    // } else {
    //     val = val.split(/[^\d*+-/%.]/).filter(i=>i);
    //     if (val.length > 0) {

    //         filterDigit(val[0]);
    //     }
    // }
}

function keyClick(e) {
    filterDigit(e.target.id);
}

function filterDigit( val ) {

    if (displayingAnswer) {
        shiftUp();
        clearAnim();
        prevAnswer = typeBox.textContent;
        typeBoxB.textContent="";
        typeBox.classList.remove("yellow");
        typeBox.classList.add("green");
        displayingAnswer = false;
        lineA.classList.remove("right");
        userInputClear();
    }

    console.log( val );
    let isNumber = true;

    switch(val) {
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
        addkeyClick( val);
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

function addkeyClick( val ) {

    // NUMBER: GO
    // SYMBOL: DEPENDS ON PREV
    //      PERCENT: GO
    //      FIRST ANYTHING: GO
    //      FIRST SYMBOL WITH DECIMAL: GO
    //      SECOND DECIMAL, WITH EXISTING SYMBOL: GO
    //      SYMBOL WITH NO PREV VALUE: PULL LINE-B, GO


     // IT'S A NUMBER
     if (parseInt(val).toString() == val ) {
        // PREVIOUS IS NOT A PERCENT?
        if (userInput[userInput.length-1] == "%" ) {

        } else {
            userlineAdd(val);     
        }
    } else {
        // IT'S A SYMOBL
        let currentInput = userInput.split(/[0-9]/).filter(i => i);
        switch(val) {
            case "%":
                if (userInput.length<1) {
                    // PULL PREVIOUS NUMBER 
                    if (prevAnswer.length >0) {
                        // userInput = prevAnswer + val;
                        userlineAdd(prevAnswer + val);
                    }
                } else {
                    let n = userInput[userInput.length-1];
                    console.log(typeof n);
                    if ( n== "%" | n=="." | parseInt(n).toString()==n ) {
                        userlineAdd(val);
                    }
                };
                break;
            case ".":
                if (userInput[userInput.length-1] != "%"){
                    
                    // let n = userInput.split(/[0-9%.]/).filter(i => i);
                    let n = currentInput.filter(i=>i==".");
                    
                    if (n.length <1) {
                        userlineAdd(val);
                    } else if (n.length < 2 & currentInput.length > 1) {
                        userlineAdd(val);
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
                    if (prevAnswer.length >0) {
                        // userInput = prevAnswer + val;
                        userlineAdd(prevAnswer + val);
                    }
                } else {
                    let n = userInput.split(/[0-9%.]/).filter(i => i);
                    if ( ["-","+","*","/"].some( el => userInput[userInput.length-1].includes(el) ) ) {
                        deleteCharacter();
                        userlineAdd(val);
                    } else if (n.length < 1) {
                        userlineAdd(val);
                    }
                }
                break;
        }

    }
}

function userInputClear() {
    userInput = "";
    typeBox.textContent = userInput;
}

function userlineAdd( val) {
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
    let printDisplayA
    let printDisplayB

    for (let i= 0; i < printLines.length-2; i++) {
        console.log(i);
        printDisplayA = printLines[i].querySelector(".print-display");
        printDisplayB = printLines[i+2].querySelector(".print-display");

        if (printDisplayB.childElementCount > 0 ) {
            // SKIP THE CURSOR
            printDisplayA.textContent = printDisplayB.children[0].textContent;
        } else {
            // SIMPLE COPY UP
            printDisplayA.textContent = printDisplayB.textContent
        }
        printLines[i].classList.add("shift-anim");
    }
}

function manageFloat( val ) {
    val = parseFloat(val);
    let ans = ( val ).toFixed(12).toString();
	return parseFloat(val);
}

function add (a,b) {
    console.log("adding")
    return manageFloat(processInput(a)+processInput(b));
};
function subtract (a,b) {
    return manageFloat(processInput(a)-processInput(b));
};
function multiply(a,b) {
    return manageFloat(processInput(a)*processInput(b));
};
function divide(a,b) {
    return manageFloat(processInput(a)/processInput(b));
}

function processInput( digit ) {

    // GET PERCENTS
    let perc = digit.split(/[0-9.]/).filter(i => i);
    if (perc.length > 0) {
        perc = perc[0].split("");
    }
    let number = digit.split(/[%]/).filter(i => i)[0];
    number = parseFloat(number);

    perc.forEach( () => {
        number = manageFloat(number/=100);
        // number = (number/=100).toFixed(12).toString()
        // parseFloat( number );
        // console.log( "number is " + number );
    }  );
    // parseFloat(number.toFixed(8).toString())
    return parseFloat(number);
}

function calcSolution() {
    displayingAnswer = true;
    cursorVisibility(false);
    typeBoxB.textContent = userInput;

    typeBox.classList.remove("green");
    typeBox.classList.add("yellow");
    lineA.classList.add("right");
    lineB.classList.add("shift");

    let numbers = userInput.split(/[^\d%.]/).filter(i=>i);
    let operations = userInput.split(/[0-9.%]/).filter(i => i);
    console.log("my recorded input is: ", userInput);
    console.log("the numbers are ", numbers);
    console.log("the operations are " + operations);
    let answer = "";

    // EVALUATE OPPERATION
    // THERE ARE NO OPPERATIONS
    if (operations.length < 1 ) {
        console.log("no opperations i guess");
        if (numbers.length < 1) {
            answer = processInput("0");
        } else {
            answer = processInput(userInput);
        }
    } else {
        if (numbers.length < 2) {
            numbers.push("0");
        }
        switch (operations[0]) {
            case "+":
                answer = add( numbers[0], numbers[1] );
                break;
            case "-":
                answer = subtract( numbers[0], numbers[1] );
                break;
            case "/":
                answer = divide( numbers[0], numbers[1] );
                break;
            case "*":
                answer = multiply( numbers[0], numbers[1] );
                break;
        }
    }

    typeBox.textContent = answer;
    playShiftAnim();
}

