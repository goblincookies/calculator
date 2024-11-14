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
    printLines.forEach( el => {
        el.querySelector(".print-display").classList.add("shift-anim");
    });
}

function keyPress(e) {
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
            val = val[0];
            // val = val.split(/[^\d*+-/%.]/).filter(i=>i);
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
        addKeyClick( val);
    }

};

function getOpperatorsSoFar() { return(userInput.split(/[0-9%.-]/).filter(i => i));}
function getSymbolsUsedSoFar( val ) {return(userInput.split("").filter(i=>i==val) );}
function isNumber( val) {return /^\d/.test(val);}

function qualifiedDigit(val) {
    if (userInput.slice(-1) != "%") {
        return true;
    }
    return false;
}
function qualifiedPercent(val) {
    if (userInput.length>1) {
        let lastDigit = userInput.slice(-1);
        if ( lastDigit == "%") {
            return true;
        }
        if (lastDigit==".") {
            return true;
        }
        if(isNumber(lastDigit) ) {
            return true;
        }
    }   
    return false;
}
function qualifiedDecimal(val) {
    if (userInput.slice(-1) != "%"){
        let decimalsSoFar = getSymbolsUsedSoFar(".");

        if (decimalsSoFar.length <1) {
            return true;
        }
        let opperatorsSoFar = getOpperatorsSoFar();
        if (decimalsSoFar.length < 2 & opperatorsSoFar.length > 0) {
            return true;
        }
    }
    return false;
}
function qualifiedNegative(val) {
    console.log("neg check");
    // IS FIRST DIGIT
    if ( userInput.length < 1 ) {
        console.log("passed 1")
        return true;
    }
    let lastDigit = userInput.slice(-1);
    // LAST DIGIT IS SYMBOL
    if (["+","*","/"].some( el => lastDigit.includes(el) ) ) {
        console.log("passed 2")

        return true;
    }
    let negativesSoFar = getSymbolsUsedSoFar("-");
    let opperatorsSoFar = getOpperatorsSoFar();
    // LAST DIGIT IS A NUMBER, AND LESS THAN 2 NEGS, AND NO OPPERATORS 
    if (isNumber(lastDigit)  && negativesSoFar.length<2 && opperatorsSoFar.length < 1) {
        console.log("passed 3")
        return true;
    }
    return false;
}
function qualifiedOpperator(val) {
    if (userInput.length > 0) {
        console.log("opp check");
        if ( ["+","*","/","-"].some( el => userInput.slice(-1).includes(el) ) ) {
            deleteCharacter();
            return(true);
        }
        let numbersSoFar = getNumbers(userInput);
        let opperatorsSoFar = getOpperatorsSoFar();
        let negativesSoFar = getSymbolsUsedSoFar("-");
        // console.log("checking 2", opperatorsSoFar, neg);
        if ( numbersSoFar.length < 2 && opperatorsSoFar.length < 1 && negativesSoFar.length < 2) {
            return(true);
        }
    }
    return false;
}

function qualifiedChar(val) {
    // 
    if( isNumber(val)){
        return(qualifiedDigit(val));
    }

    switch( val ) {

        // IS DIGIT:
        // case /^\d/.test(val):
        //     console.log("is Digiti")
        //     return(qualifiedDigit(val));
        case "%":
            return(qualifiedPercent(val));
        case ".":
            return(qualifiedDecimal(val));
        case "-":
            return(qualifiedNegative(val));
        case "+":
        case "*":
        case "/":
            return(qualifiedOpperator(val));
        default:
            return false;
    }
}

function addKeyClick(val) {
    console.log("checking..")
    // VAL IS A SINGLE DIGIT
    if(qualifiedChar(val)) {
        userlineAdd(val);     
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
    prevAnswer="";
    for (let i= 0; i < printLines.length-2; i++) {
        printLines[i].querySelector(".print-display").textContent = "";
    }
}

function shiftUp() {
    let printDisplayA
    let printDisplayB

    for (let i= 0; i < printLines.length-2; i++) {
        // console.log(i);
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
    return manageFloat( manageFloat(processInput(a))+manageFloat(processInput(b)));
};
function subtract (a,b) {
    return manageFloat( manageFloat(processInput(a))-manageFloat(processInput(b)));
};
function multiply(a,b) {
    return manageFloat(processInput(a)*processInput(b));
};
function divide(a,b) {
    return manageFloat(processInput(a)/processInput(b));
}

function processInput( digit ) {
    
    // GET PERCENTS
    let perc = digit.split(/[0-9.-]/).filter(i => i);
    if (perc.length > 0) {
        // MAKE ARRAY
        perc = perc[0].split("");
    }
    let number = digit.split(/[%]/).filter(i => i)[0];
    number = parseFloat(number);

    perc.forEach( () => {
        number = manageFloat(number/=100);
    }  );
    return parseFloat(number);
}
function getNumbers( val ) {
    let numbers = val.split(/[^\d%.-]/).filter(i=>i);
    let result = [];
    numbers.forEach( el => {
        while (el.length > 0) {
            let num = "";
            let n = el.length;
            for (let i = 0; i<n; i++) {
                num += el[0];
                el= el.slice(1);
                if( el.length > 0 && ["-","+","*","/"].some( v => el[0].includes(v) ) ) break;
            }
            result.push(num);    
        }
        result.push(el);
    });
    result=result.filter(i => i);
    return result;
};

function getOpperations( val ) {
    return val.split(/[0-9-.%]/).filter(i => i);
};

function calcSolution() {
    displayingAnswer = true;
    cursorVisibility(false);
    typeBoxB.textContent = userInput;
    typeBox.classList.remove("green");
    typeBox.classList.add("yellow");
    lineA.classList.add("right");
    lineB.classList.add("shift");

    let numbers = getNumbers(userInput) //.split(/[^\d%.-]/).filter(i=>i);
    let operations = getOpperations(userInput) //.split(/[0-9.%]/).filter(i => i);
    let answer = "";

    // EVALUATE OPPERATION
    // THERE ARE NO OPPERATIONS
    if (operations.length < 1 ) {
        if (numbers.length < 1) {
            answer = processInput("0");
        } else if (numbers.length < 2) {
            answer = processInput(userInput);
        } else {
            answer = add( numbers[0], numbers[1] );
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

