// index.js

import RPolishCalc from './RPolishCalc.js';

const calculate = new RPolishCalc(process.stdin, process.stdout);

calculate.start();