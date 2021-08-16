class Calculator {
  constructor(prevOper, currOper) {
    // Define what elements correspond to previous and current operands
    this.prevOperElem = prevOper;
    this.currOperElem = currOper;

    // Define the 'numbers' to be stored in memory (opposed to the HTML elements)
    this.currNum = '';
    this.prevNum = '';

    // Initialized the type of operation selected
    this.operation = null;
  }

  clear() {
    // Clear all text and operation type
    this.currNum = '';
    this.prevNum = '';
    this.prevOperElem.innerText = '';
    this.currOperElem.innerText = '';
    this.operation = null;
  }

  delete() {
    // Removes single number
    this.currNum = this.currNum.toString().slice(0, -1);
  }

  appendNumber(number) {
    // Display the number the user has already entered

    // Check if we hava already added a decimal point and exit if true
    if (number === '.' && this.currNum.includes('.')) return;

    // Add in numbers as strings (concatenate), is different from computation
    // as this is what we'll show to the user, when adding numbers you do not
    // expect the calculator to operate on them unless you tell it
    // explicitly (i.e. by clicking on the actual operators)
    this.currNum = this.currNum.toString() + number.toString();
  }

  chooseOperation(operation) {
    // When the operations are clicked
    if (this.currNum === '') return;

    // If we have already inserted a previous value, compute it
    // Then change all the values
    if (this.prevNum !== '') this.compute();

    // define operation we want
    // after computing add to memory
    // set new num to empty in order to expect a new value
    this.operation = operation;
    this.prevNum = this.currNum;
    this.currNum = '';
  }

  compute() {
    // Compute single val for what we need to display

    // result
    let computation = 0;

    // numbers
    const prev = parseInt(this.prevNum);
    const current = parseInt(this.currNum);

    // if the inputs are not numbers we can't do anything
    if (isNaN(prev) || isNaN(current)) return;

    // Def type of operation based on operand clicked
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '÷':
        computation = prev / current;
        break;

      default:
        return;
    }

    // set current to computed value, reset operation, delete previous number
    // we don't have a previous number anymore
    this.currNum = computation;
    this.operation = null;
    this.prevNum = '';
  }

  getDisplayNumber(number) {

    const strNumber = number.toString();

    // Choose the pre decimal point part
    // and the post decimal point
    const integerDigits = parseFloat(strNumber.split('.')[0]);
    const decimalDigits = strNumber.split('.')[1];

    let integerDisplay;

    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      // Add the commas, to make it into the locale format for large numbers
      // The options makes it so it doesn't take into account decimals
      integerDisplay = integerDigits.toLocaleString('en', {maximumFractionDigits: 0});
    };

    // Strict equality is BAD here, we want the type coercion to happen
    // because null !== undefined, so it never gets here
    // null == undefined
    // null !== undefined!!!
    // IMPORTANT!!

    if (decimalDigits != null) {
      // return a version with the digits
      return `${integerDisplay}.${decimalDigits}`;
    } else {

      // or just return integerdisplay
      return integerDisplay;
    }
  }

  updateDisplay() {
    // Update the contents of the display to the nums we have stored in memory
    this.currOperElem.innerText = this.getDisplayNumber(this.currNum);

    // Add operand to calculator
    if (this.operation !== null) {
      this.prevOperElem.innerText = `${this.getDisplayNumber(this.prevNum)} ${
        this.operation
      }`;
    } else {
      // clear previous values
      this.prevOperElem.innerText = '';
    }
  }
}

// selecting attributes, without any values
// a way to simplify selection of elements
const numBtns = document.querySelectorAll('[data-number]');
const operBtns = document.querySelectorAll('[data-operation]');
const equalsBtn = document.querySelector('[data-equals]');
const delBtn = document.querySelector('[data-delete]');
const clrBtn = document.querySelector('[data-all-clear]');
const prevOper = document.querySelector('[data-previous-operand]');
const currOper = document.querySelector('[data-current-operand]');

const calculator = new Calculator(prevOper, currOper);

// functionality for the buttons, adds a new number at the end of what we have
for (let btn of numBtns) {
  btn.addEventListener('click', () => {
    calculator.appendNumber(btn.innerText);
    calculator.updateDisplay();
  });
}

for (let btn of operBtns) {
  btn.addEventListener('click', () => {
    calculator.chooseOperation(btn.innerText);
    calculator.updateDisplay();
  });
}

equalsBtn.addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
});

clrBtn.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

delBtn.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});
