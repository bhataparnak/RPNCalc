import { createRequire } from 'module';
const require = createRequire(import.meta.url);

//big.js library is used to perform calculations to avoid floating point accuracy error.
//Reference https://mikemcl.github.io/big.js/
const Big = require('big.js');

/**
 * Create an array of the Mathematical operations supported. Add new operations here to this list.
 Freeze the objects so that it's properties can't be changed
 */
export const math_operation = Object.freeze({
  ADD: '+',
  MULTIPLY: '*',
  DIVIDE: '/',
  SUBTRACT: '-'
});

/**
 * Function takes a string representing mathematical expression in reverse polish notation
 * and returns a result of calculation
 * It throws an errors in case of invalid syntax
 */
export const RPLCalc = (expression) => {
  const PRECISION = 4;     //Precion till 4 decimal places. Change here to increase
  const operands = [];
  const arr = expression.split(' ');  //Split the received epression

  for (let i = 0; i < arr.length; i += 1) {
    const currentValue = arr[i];
    const number = +currentValue; // Do casting to number

    
    if (number == currentValue) { // if casting to number successful then the currentValue is an operand
      operands.push(number);
    } else { // else treat currentValue as an operator
      if (operands.length < 2) {
        throw new Error('Insufficient operands enter a new expression');
      }
      const n2 = operands.pop();    //Second Operand
      const n1 = operands.pop();    //First Operand
      
      //Use switch to match from the list of the supported math operations.
      switch (currentValue) {
        case math_operation.ADD:
          operands.push(Big(n1).plus(n2).toFixed(PRECISION));
          break;
        case math_operation.MULTIPLY:
          operands.push(Big(n1).times(n2).toFixed(PRECISION));
          break;
        case math_operation.DIVIDE:
          operands.push(Big(n1).div(n2).toFixed(PRECISION));
          break;
        case math_operation.SUBTRACT:
          operands.push(Big(n1).minus(n2).toFixed(PRECISION));
          break;
        default:
          throw new Error(`Unknown operator '${currentValue}' found. Please enter new expression`);
      }
    }
  }

  if (operands.length !== 1) {
    throw new Error('Syntax error');
  } else {
    return parseFloat(operands.pop());
  }
};