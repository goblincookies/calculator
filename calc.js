let typeBox = document.querySelector("#user-input");
let lineA = document.querySelector("#input-a");
let lineB = document.querySelector("#input-b");
let typeBoxB = lineB.querySelector(".print-display");
let printLines = document.querySelector("#print-out").querySelectorAll(".line");
let userInput = "";
let previousAnswer = "";
let cursorVisible = true;
let displayingAnswer = false;
let ignoringPrevious = true;
let blinkSpeed = 400;
let cursor = document.getElementById('cursor');
let maxChars = 12;
// ADD EVENT LISTENERS TO ALL BUTTONS/KEYS && KEYBOARD
document.querySelectorAll(".key").forEach( key => key.addEventListener("click", keyClick) );

// PREVENTS KEYBOARD EVENTS FROM TRIGGERING THE BUTTONS CLICK HANDLER
// PREVENTS ISSUE WHERE USERS WOULD CLICK 'CLEAR' THEN TYPE
// AN EQUATION, AND ON 'ENTER' PRESS IT WOULD BOTH CALCULATE THE ANSWER
// AND CLEAR THE SCREEN.
document.querySelectorAll(".key").forEach( key => key.addEventListener("keydown", (event)=> {
    event.preventDefault();
} ) );
document.addEventListener("keydown", keyPress);

// BLINKING CURSOR
setInterval(() => {
    if (!displayingAnswer) {
        cursor.style.opacity = cursorVisible+0;
        cursorVisible = !cursorVisible;
    }
}, blinkSpeed);
// MANUALLY SET CURSOR VISIBILITY WHEN INPUTING
function cursorVisibility( val ) {
    cursor.style.opacity = val+0;
    cursorVisible = val;
};
// CLEAR ANIMATION CLASS FROM LINES
function clearAnim() {
    printLines.forEach(el => {
        el.querySelector(".print-display").classList.remove("shift-anim");
    });
};
// ADD ANIMATION CLASS TO LINES
function playShiftAnim() {
    printLines.forEach( el => {
        el.querySelector(".print-display").classList.add("shift-anim");
    });
};
// TRIGGERS WHEN KEYBOARD IS USED
function keyPress(e) {
    let val = e.key;
    // SWITCH KEYCODES OF SPECIAL KEYS INTO STANDARD FORMATS
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
            if (val.length > 0) {
                val = val[0];
            } else {
                val = "";
            };
    };
    
    if (val.length > 0) {
        processInput(val);
    };

};
// TRIGGERS WHEN USING THE UI
function keyClick(e) {
    processInput(e.target.id);
};
// RESET THE DISPLAY FOR INPUT
function primeDisplay(){
    if (displayingAnswer) {
        shiftUp();
        clearAnim();
        typeBoxB.textContent="";
        typeBox.classList.remove("yellow");
        typeBox.classList.add("green");
        displayingAnswer = false;
        lineA.classList.remove("right");
        if (ignoringPrevious) {
            userInputClear();
        };
        ignoringPrevious = true;
    };
};
function processInput( val ) {
    let displayOnScreen = true;
    switch(val) {
        case "clear":
            displayingAnswer = true;
            primeDisplay();
            clearScreen();
            displayOnScreen = false;
            break;
        case "del":
            primeDisplay();
            deleteCharacter();
            displayOnScreen = false;
            break;
        case "calc":
            if (userInput.length > 0) {
                primeDisplay();
                calcSolution( false );
                displayOnScreen = false;
            }
            break;
    };

    if (displayOnScreen && qualifiedChar(val)) {
        primeDisplay();
        cursorVisibility(false);
        userlineAdd(val);
    };

};
function limitInput(val) {
    return val.slice(0,maxChars);
}
function getOpperatorsSoFar() { return(userInput.split(/[0-9-.%]/).filter(i => i));}
function getSymbolsUsedSoFar( val ) {return(userInput.split("").filter(i=>i==val) );}
function isNumber(val) {
    if(val.length > 1) {return false;}    
    return /^\d/.test(val);
};
// VALIDATES ADDING A NUMBER TO THE USER INPUT
function qualifiedDigit(val) {
    if (userInput.slice(-1) != "%") {
        return true;
    }
    return false;
};
// VALIDATES ADDING A PERCENT TO THE USER INPUT
function qualifiedPercent(val) {
    
    if (userInput.length>0) {
        let lastDigit = userInput.slice(-1);
        let numbersSoFar = getNumbers(userInput);
        let opperatorsSoFar = getOpperations(userInput);
        if ( lastDigit == "%") {
            return true;
        };
        if (lastDigit=="." && numbersSoFar.length >0 && opperatorsSoFar.length < 1) {
            return true;
        };
        if(isNumber(lastDigit) ) {
            return true;
        };
    };
    return false;
};
// VALIDATES ADDING A DECIMAL TO THE USER INPUT
function qualifiedDecimal(val) {
    if (userInput.length<1) { return true; };
    let lastDigit = userInput.slice(-1);
    if (lastDigit != "%" && lastDigit != "."){
        let decimalsSoFar = getSymbolsUsedSoFar(".");
        if (decimalsSoFar.length <1) {
            console.log("dec1")
            return true;
        }
        let numbersSoFar = getNumbers(userInput);
        let opperatorsSoFar = getOpperations(userInput); 

        if (decimalsSoFar.length < 2
            && numbersSoFar.length > 0
            && opperatorsSoFar.length > 0 ) {
                console.log("dec2")
                return true;
        };
    };
    return false;
};
// VALIDATES ADDING A NEGATIVE/MINUS TO THE USER INPUT
function qualifiedNegative(val) {
    // IS FIRST DIGIT
    if ( userInput.length < 1 ) {
        if (isNumber(previousAnswer)) {
            // calcSolution( true );
            previousToScreen();
            return true;
        } else {
            return true;
        }
    };

    // LAST DIGIT IS A OPPERATOR
    // REPLACE IT
    let lastDigit = userInput.slice(-1);
    // if ( ["+","*","/"].some( el => lastDigit.includes(el)) ) {
    //     deleteCharacter();
    //     return true;        
    // }
    let numbersSoFar = getNumbers(userInput);
    // CALC
    if (numbersSoFar.length >1 ) {
        calcSolution( true );
        previousToScreen();
        return true;
    }
    let negativesSoFar = getSymbolsUsedSoFar("-");
    let opperatorsSoFar = getOpperatorsSoFar();
    let decimalsSoFar = getSymbolsUsedSoFar(".");
    // LAST DIGIT IS SYMBOL
    if ( userInput.length > 1
        && ["+","*","/","%","."].some( el => lastDigit.includes(el) )
        && numbersSoFar.length < 2
        && negativesSoFar.length<2
        && opperatorsSoFar.length < 2
        && decimalsSoFar.length<2 ) {
        return true;
    };
    // LAST DIGIT IS A NUMBER, AND LESS THAN 2 NEGS, AND NO OPPERATORS 
    if (isNumber(lastDigit)
        && negativesSoFar.length<2
        && opperatorsSoFar.length < 1
        && numbersSoFar.length < 2 ) {
        return true;
    };
    return false;
};
// VALIDATES ADDING AN OPPERATOR TO THE USER INPUT
function qualifiedOpperator(val) {
    let opperatorsSoFar = getOpperatorsSoFar();
    if (opperatorsSoFar.length > 0 ) {
        calcSolution( true );
        previousToScreen();
        return true;
    }
    if (userInput.length <1 && isNumber(previousAnswer)) {
        previousToScreen();
        return true;
    };
    if (userInput.length > 0) {
        if ( ["+","*","/","-"].some( el => userInput.slice(-1).includes(el) )  && userInput.length > 1) {
            deleteCharacter();
            return(true);
        };
        let numbersSoFar = getNumbers(userInput);
        let negativesSoFar = getSymbolsUsedSoFar("-");
        if ( numbersSoFar.length ==1 && opperatorsSoFar.length < 1 && negativesSoFar.length < 2) {
            return(true);
        };
    };
    return false;
};
// VALIDATES INPUT
function qualifiedChar(val) {
    if( isNumber(val)){ return(qualifiedDigit(val));};

    switch( val ) {
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
    };
};
function userInputClear() {
    userInput = "";
    typeBox.textContent = userInput;
};
function previousToScreen() {
    ignoringPrevious = false;
    userInput = "";
    userInput = previousAnswer;
    typeBox.textContent = userInput;
}
function userlineAdd( val) {
    userInput += val;
    userInput = limitInput(userInput);
    typeBox.textContent = userInput;
};
function deleteCharacter() {
    if (userInput.length < 1) {previousAnswer = "";}
    userInput = userInput.slice(0, -1);
    typeBox.textContent = userInput;
};
function clearScreen() {
    shiftUp();
    userInput = "";
    typeBox.textContent = userInput;
    previousAnswer = "";
    displayingAnswer = false;
    for (let i= 0; i < printLines.length-2; i++) {
        printLines[i].querySelector(".print-display").textContent = "";
    };
};
// SHIFTS ALL LINES UP
function shiftUp() {
    let printDisplayA
    let printDisplayB

    for (let i= 0; i < printLines.length-2; i++) {
        printDisplayA = printLines[i].querySelector(".print-display");
        printDisplayB = printLines[i+2].querySelector(".print-display");

        if (printDisplayB.childElementCount > 0 ) {
            // SKIP THE CURSOR SPAN
            printDisplayA.textContent = printDisplayB.children[0].textContent;
        } else {
            // SIMPLE COPY UP
            printDisplayA.textContent = printDisplayB.textContent
        };
        printLines[i].classList.add("shift-anim");
    };
};
// CONSTANTLY CHOPPING OFF EXTRA DIDGITS
function manageFloat( val ) {
    val = parseFloat(val);
    let ans = ( val ).toFixed(12).toString();
	return parseFloat(ans);
};

function add (a,b) {
    return manageFloat( manageFloat(cleanUpInput(a))+ manageFloat(cleanUpInput(b)));
};
// KEPT FOR LEGACY------------------------
// ALL MINUS SYMBOLS ARE TREATED AS NEGATIVES
// FOR EXAMPLE 6-5 = [5,-6]
// IF THERE ARE NO OPPERATORS, THEY ARE TREATED ADDED TOGETHER
// FOR EXAMPLE [5,-6] >> [5 '+' -6] 
function subtract (a,b) {
    return manageFloat( manageFloat(cleanUpInput(a))-manageFloat(cleanUpInput(b)));
};
function multiply(a,b) {
    return manageFloat(cleanUpInput(a)*cleanUpInput(b));
};
function divide(a,b) {
    return manageFloat(cleanUpInput(a)/cleanUpInput(b));
};
function cleanUpInput( digit ) {
    digit = digit.toString();
    // GET PERCENTS
    let perc = digit.split(/[0-9.-]/).filter(i => i);
    if (perc.length > 0) {
        // MAKE ARRAY
        perc = perc[0].split("");
    };
    let number = digit.split(/[%]/).filter(i => i)[0];
    number = parseFloat(number);

    perc.forEach( () => {
        number = manageFloat(number/=100);
    }  );
    return parseFloat(number);
};
// RETURNS ALL NUMBERS AS AN ARRAY FROM A GIVEN STRING
// PRESERVES PERCENTS AND DECIMALS
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
            };
            let invalidNumber = true;
            num.inArra
            num.split("").forEach( i => {
                if (isNumber(i)) { invalidNumber = false;}
            });
            if (invalidNumber) { num = ""; };
            // if (num.length < 2 && num[0]=="-") { num="";};
            // if (num.length < 2 && num[0]==".") { num="";};
            result.push(num);    
        }
        result.push(el);
    });
    result=result.filter(i => i);
    return result;
};
// RETURNS THE OPPERATIONS GIVEN A STRING
function getOpperations( val ) {
    return val.split(/[0-9-.%]/).filter(i => i);
};

function calcSolution( silently ) {

    // typeBoxB.textContent = userInput;

    let numbers = getNumbers(userInput);
    let operations = getOpperations(userInput);
    let answer = "";

    // EVALUATE OPPERATION
    // THERE ARE NO OPPERATIONS
    if (operations.length < 1 ) {
        if (numbers.length < 1) {
            answer = cleanUpInput("0");
        } else if (numbers.length < 2) {
            answer = cleanUpInput(userInput);
        } else {
            answer = add( numbers[0], numbers[1] );
        };
    } else {
        if (numbers.length < 2) {
            numbers.push("0");
        };
        switch (operations[0]) {
            case "+":
                answer = add( numbers[0], numbers[1] );
                break;
            // THERE IS NEVER A SUBTRACTION OPPERATION
            // case "-":
            //     answer = subtract( numbers[0], numbers[1] );
            //     break;
            case "/":
                answer = divide( numbers[0], numbers[1] );
                break;
            case "*":
                answer = multiply( numbers[0], numbers[1] );
                break;
        };
    };
    typeBox.textContent = manageFloat(answer);
    previousAnswer = manageFloat(answer);
    playShiftAnim();

    if (silently) {
        typeBoxB.textContent = userInput;
        displayingAnswer = false;
        shiftUp();
        typeBoxB.textContent="";        
    } else {
        displayingAnswer = true;
        cursorVisibility(false);
        typeBoxB.textContent = userInput;
        typeBox.classList.remove("green");
        typeBox.classList.add("yellow");
        lineA.classList.add("right");
        lineB.classList.add("shift");
    }

    userInput = "";
};