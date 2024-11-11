let keys = document.querySelectorAll(".key");
let userInput = document.querySelector("#user-input");

let values = [];
let curIndex=0;

keys.forEach( key => key.addEventListener("click", keyPress) );


function keyPress(e) {
    console.log( e.target.id );

    // IT'S A NUMBER
    if (parseInt(e.target.id).toString() == e.target.id ) {
        values[curIndex] += e.target.id;
        userInput.textContent = userInput.textContent + e.target.id;
        // console.log( userInput.textContent );

    } else {
        curIndex += 1;
        switch( e.target.id) {
            case "clear":
                break;
            case "del":
                break;
            case "perc":
                break;
            case "divide":
                break;
            case "mult":
                break;
            case "minus":
                break;
            case "add":
                break;
            case "zero":
                break;
            case "point":
                break;
            case "calc":
                break;
        }
    }

    updateLine();
};

function updateLine() {
}