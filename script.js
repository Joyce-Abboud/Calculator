const operators = document.querySelectorAll(".operator");
const numbers = document.querySelectorAll(".number");
const controls = document.querySelectorAll(".control");
const display = document.querySelector(".output");

function add(a, b) { return a + b; }
function substract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return a / b; }

let firstOperand = null;
let currentOperator = null;
let shouldResetDisplay = false;

display.textContent = "0";

// Pure calculation — no more parsing the display string, just uses the arguments
function operate(a, op, b) {
    switch (op) {
        case "+": return add(a, b);
        case "-": return substract(a, b);
        case "*": return multiply(a, b);
        case "/": return b === 0 ? "Error" : divide(a, b);
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(display.textContent);

    if (currentOperator && !shouldResetDisplay) {
        // A real second number was typed since the last operator -> evaluate the pending pair
        const result = operate(firstOperand, currentOperator, inputValue);
        display.textContent = result;
        firstOperand = result;
    } else {
        // Either the first operator being set, OR the user pressed
        // another operator right after one without typing a digit.
        // In that case we just overwrite currentOperator below —
        // this is what makes "only the last operator pressed" win.
        firstOperand = inputValue;
    }

    shouldResetDisplay = true;
    currentOperator = (nextOperator === "=") ? null : nextOperator;
}

function updateNumber() {
    if (shouldResetDisplay) {
        display.textContent = "";
        shouldResetDisplay = false;
    }
    if (display.textContent === "0") {
        display.textContent = this.textContent;
    } else {
        display.textContent += this.textContent;
    }
}

function addDecimal() {
    // If we're about to start a fresh number, clear first so the check
    // below looks at the NEW number, not leftover text from before
    if (shouldResetDisplay) {
        display.textContent = "";
        shouldResetDisplay = false;
    }
    if (display.textContent === "") {
        display.textContent = "0.";
    } else if (!display.textContent.includes(".")) {
        display.textContent += ".";
    }
    // if it already includes ".", do nothing — this blocks a 2nd decimal point
}

numbers.forEach((number) => {
    number.addEventListener("click", updateNumber);
});

operators.forEach((op) => {
    op.addEventListener("click", () => handleOperator(op.textContent));
});

controls.forEach(button => {
    button.addEventListener("click", () => {
        if (button.classList.contains('ac')) {
            display.textContent = "0";
            firstOperand = null;
            currentOperator = null;
            shouldResetDisplay = false;
        } else if (button.classList.contains('equal')) {
            handleOperator("=");
        } else if (button.classList.contains('virgule')) {
            addDecimal();
        } else if (button.classList.contains('backspace')) {
            display.textContent = display.textContent.slice(0, -1) || "0";
        }
    });
});

document.addEventListener("keydown", (event) => {
    const digitKeys = "0123456789";
    const opKeys = { "+": "+", "-": "-", "*": "*", "/": "/" };

    if (digitKeys.includes(event.key)) {
        updateNumber.call({ textContent: event.key });
    } else if (opKeys[event.key]) {
        handleOperator(opKeys[event.key]);
    } else if (event.key === "Enter" || event.key === "=") {
        handleOperator("=");
    } else if (event.key === "Backspace") {
        display.textContent = display.textContent.slice(0, -1) || "0";
    } else if (event.key === ".") {
        addDecimal();
    }
});