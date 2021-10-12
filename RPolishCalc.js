import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { math_operation, RPLCalc } from './RPLCalc.js';

const LINE = '................................*******************************.......................................';
const START = `${LINE}
This is a sample Reverse Polish calculator
Currently it Just takes 4 mathematical operators + * / -
Enter 'q' to Quit
Enter 'r' to Reset
${LINE}`;
const QUIT = '\nCioa!';
const QUIT_SYMBOL = 'q';
const RESET = 'r';
const REGEX = /[qr]{1}|^[\d\s+\-*/.]+$/;
const print = (str) => console.log(str); 

//The readline module provides an interface for reading data from a Readable stream (such as process.stdin) one line at a time.
const readline = require("readline");

//Reference https://nodejs.org/api/readline.html
export default class RPolishCalc{
  constructor(inputStream, outputStream){
    this.r1 = readline.createInterface({
      input: inputStream,
      output: outputStream,
    });
    this.stack = [];
  }

  start(){
    print(START);
    this.r1.on('line', this.For_Input.bind(this));
    this.r1.on('close', this.For_Close.bind(this));
    this.r1.prompt();
  }

  For_Input(input){
    const validInp = input.trim();  //remove the white space

    try{
      if (!validInp.match(REGEX)){   //Check for the regular expression
        throw new Error('Error not a valid input');
      }
      this.validStatements(validInp);
    } catch(e){
      print(`ERROR: ${e.message}`);
      this.reset();
    } finally{
      this.r1.prompt();
    }
  }

  For_Close(){
    print(QUIT);
    process.exit(0);
  }

  /**
   * Returns True if last element in stack is an operator.
   * Check if the stack lenght is greater than 1 or not.
   * Number of operators has to be 1 less than the number of operands.
   * The reducer walks through the array element-by-element, at each step adding the current array value to the result 
   from the previous step (this result is the running sum of all the previous steps) — until there are no more elements to add.
   // reference https://learnyousomeerlang.com/functionally-solving-problems
   */
  checkConditions(){
    const reducer = (previousValue, currentValue) => previousValue + ((currentValue == +currentValue) ? 1 : -1);
    const lastElement = this.stack[this.stack.length - 1];
    const symbLast = Object.values(math_operation).join('').indexOf(lastElement) !== -1;
    const operatorCount = this.stack.length > 1
      && this.stack.reduce(reducer, 0) === 1;
    return symbLast && operatorCount;
  }
  

  // Only if the given input expression is valid
  validStatements(validInp){
    if (validInp === QUIT_SYMBOL){
      this.r1.close();
    } else if (validInp === RESET){
      this.reset();
      return;
    }

    this.stack = this.stack.concat(validInp.split(' '));

    let response = '';

    if (this.checkConditions()){
      response = this.remb_calc();
    } else{
      response = validInp;
    }

    print(response);
  }
  
  //Remember the calculations
  remb_calc(){
    const result = RPLCalc(this.stack.join(' '));
    this.stack = [result];
    return result;
  }
  
  //Reset the stack and accept new input expression for calculation
  reset(){
    this.stack = [];
    print(LINE);
  }
}