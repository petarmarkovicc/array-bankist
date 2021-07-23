'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = '';
  
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) =>{
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}

const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
}

const calcDisplaySummary = function(acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate /100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >=1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`
}



// const user = 'Steven Thomas Williams';
// const username = user.toLocaleLowerCase().split(' ').map(name => name[0]).join('');
// console.log(username);

const createUsernames = function(accs) {
  //we use forEach for side efect when we want to mutate some element and do not return it imidietly
  accs.forEach( acc =>{
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
    // acc.username = acc.owner.toLowerCase().split(' ').join('.') 
  })
}
createUsernames(accounts);
// console.log(accounts);

const updateUI = function(acc) {
      //display movements
      displayMovements(acc.movements);

      //display balance
      calcDisplayBalance(acc);
  
      //display summary
      calcDisplaySummary(acc);
}


//Event hendler
let currentAccount;
btnLogin.addEventListener('click', function(e) {
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display ui and message
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    
    updateUI(currentAccount);
  }
})

//transver amount
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  console.log(amount, reciverAcc);

  if(
    amount > 0 && 
    reciverAcc && 
    currentAccount.balance >= amount && 
    reciverAcc?.username !== currentAccount.username ) {
    // doing the traansfer
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();
    //update UI
    updateUI(currentAccount);
  }
})

btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if( amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
})

//delete acc
btnClose.addEventListener('click', function(e){
  e.preventDefault();

  if(
    currentAccount.username === inputCloseUsername.value && 
    currentAccount.pin === Number(inputClosePin.value)){
      //we will take our accounts array and with splice method which will have parameter 
      //which is index of needed element, and number 1 which means that we wont to delete only one el
      //splice method actually mutates the underlying array itself and there is no need to save the result of this anywhere
      const index = accounts.findIndex(acc => acc.username === currentAccount.username);
      console.log(index);

      accounts.splice(index, 1);

      containerApp.style.opacity = 0;

  }

  inputCloseUsername.value = inputClosePin.value = '';
});


let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})




/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];
/*
//SLICE Method----------
// extract array without changing original array
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
//create shellow copy of array
console.log(arr.slice());
//is equal to
console.log([...arr]);

//SPLICE-------
//works in almost the same way as slice but fundamental 
//difference is that is does actyally change the original array
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
//first argument works the same as in the slice, but second is the number of element which will be deleted
arr.splice(1,2);
console.log(arr);
//in practice most of the time the value that the splice method returns, doesn't even intersted us


// REVERSE-----------
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
//does mutate original array. retunr array in revers order
console.log(arr2.reverse());
console.log(arr2)


//CONCAT----------
const letters = arr.concat(arr2);
console.log(letters);
//equal to, but not mutate the original array
console.log([...arr, ...arr2]);

//JOIN------------
console.log(letters.join('-'));
*/

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()){
  if(movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  }else{
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

console.log('---------foreach---------');
//we give the forEach method instructions by giving it a callback function which contains some isntruction
//diferecnce between forEach and for of is that in forEach we can't brakeout(continue and break statements) forEach will alwaus loop over the entire array
// movements.forEach(function(mov, i, arr) {
  movements.forEach((mov, i, arr) =>{
  if(mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  }else{
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
  }
})
*/

/*
//Map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach((value, key, map) =>{
  console.log(`${key}: ${value}`);
})

//set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach((value, _, map)=>{
  console.log(`${value}: ${value}`);
})
*/


/*
// map method ---------------------
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;

// const movementsUSD = movements.map(mov => mov * eurToUsd);
const movementsUSD = movements.map(function(mov) {
  return mov * eurToUsd;
  // return 23;
})
console.log(movements);
console.log(movementsUSD);

//has equal result but there we loop over the entire array and push elements in new array, 
//on the other side map is closer to functional programming
const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
console.log(movementsUSDfor);

const movementsDescriptions = movements.map(
  (mov, i)=> `Movement ${i+1}: You  ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`
);

console.log(movementsDescriptions);
*/

/*
//filter method -----------------------
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const depostits = movements.filter(function(mov){
  return mov > 0;
})

console.log(movements);
console.log(depostits);

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);
*/


/*
// reduce method --------------------------
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);
// accumulator is like snowball
// const balance = movements.reduce(function(acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`)
//   return acc + cur;
// }, 0)

const balance = movements.reduce((acc, cur) => acc + cur, 0)
console.log(balance);

let balance2 =0;
for(const mov of movements) balance2 +=mov;
console.log(balance2);

//maximum value 
const maxValue = movements.reduce((acc, mov) => acc > mov ? acc : mov)
console.log(maxValue);
*/

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;

// //PIPELINE (in case that we have bug and dont know in whic method we made it, we can use array parametar 
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map((mov, i, arr)=> {
//     // console.log(arr);
//     return mov * eurToUsd;
//   })
//   // .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);


/*
//find method--------------------------------
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

console.log(accounts);
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

let accountFor = '';
for(const acc of accounts) {
  if(acc.owner === "Jessica Davis") {
    accountFor = acc;
  }
}
console.log(accountFor);
*/

//findIndex method---------------------------
//works almost the same way like find method, but instend of element it return index of finding element of array
//we will try findIndex to delete account form accounts array in bank app. For deleting element from arr we use splice method, 
//but for that method we need index of element which we wont to ddelete



//some and every methods -----------------------
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// //EQUALITY
// console.log(movements.includes(-130));

// //CONDITION(in the case where we have condition. If there is any value for which this condition is true then the some method will return true )
// console.log(movements.some(mov => mov === -130));

// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

// //EVERY method
// //if all elements pass condition inside every method then method will return true
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// //separate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));


//flat and flatMap methods--------------------
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// //flat
// const overalBalance = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc+ mov, 0);
// console.log(overalBalance);

// //flatMap works only with one level nested arrays
// const overalBalance2 = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance2);

/*
//sorting arrays-------------------------
//strings
const owners = ['Jonas', 'Zak', 'Adam', 'Marta'];
//mutate the original arrays
console.log(owners.sort());

//numbers
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//sort method sorting arrays based on string
// console.log(movements.sort());

//return < 0, A, B
//retrurn >0, B, A

//Ascending
// movements.sort((a, b) => {
//   if(a > b)
//     return 1;
//   if (b > a) 
//      return -1;
// });

movements.sort((a, b) => a - b);
console.log(movements);

// Descending
// movements.sort((a, b) => {
//   if(a > b)
//     return -1;
//   if (b > a) 
//      return 1;
// });

movements.sort((a, b) => b - a);
console.log(movements);
*/
/*
//create and fill arrays-------------
const arr = [1,2,3,4,5,6,7];
console.log(new Array(1,2,3,4,5,6,7));

//Empty arrays + fill method
const x = new Array(7);
console.log(x);
// x.fill(1);
//similar to slice method 
x.fill(1, 3, 5);
console.log(x)

arr.fill(23, 2,6);
console.log(arr);

//Array.from (we use from on the Array() constructor. Array is the fuction, and here we call from method on the function object)
const y = Array.from({length: 7}, () => 1);
console.log(y);

const z = Array.from({length: 7}, (_, i) => i + 1);
console.log(z);

const randomDice = Array.from({length: 100}, (_ , i) =>  Math.floor(Math.random() * 6) + 1);
console.log(randomDice);

//with from() method we can crate array from iterables (maps, sets, strings). Another great example
// where we can use from() in the result of using querySelectorAll().querySelectorAll() returns something called a NodeList,
// which is something like an array which contains all the selected elements, but it's not a real array, and so it doesnt have methods like map()...
//We want to get values from UI and store them in the array

//if we do like this there will be only elements which are in the html, not all of them, and because of that we have to put it in some event handler
// const movementsUI = Array.from(document.querySelectorAll('.movements__value'));
// console.log(movementsUI);

labelBalance.addEventListener('click', function(){
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'), el => Number(el.textContent.replace('€', '')));
  // console.log(movementsUI.map(el => el.textContent.replace('€', '')));
  console.log(movementsUI);

  //we can make array form querySelectorAll with spread too, but whit that approach we have to make mapping separatly
  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
})

*/

/*
///////////////////////////////////////
// Array Methods Practice
//1.
// const bankDepositSum = accounts.map(acc => acc.movements).flat();
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur)=> sum + cur, 0);

console.log(bankDepositSum);

//2.
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  // .reduce((count, cur) => cur >= 1000 ? count + 1 : count,0);
  .reduce((count, cur) => cur >= 1000 ? ++count : count,0);

console.log(numDeposits1000);

//3.
const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce((sums, cur) =>{
    // cur > 0 ? sums.deposits += cur : sums.withdrawals += cur;
    sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
    return sums;
}, {deposits: 0, withdrawals: 0});

console.log(sums);

//4.
//this is a nice title -> This Is a Nice Title
const convertTitleCase = function(title) {

  const capitalize = str => str[0].toUpperCase() + str.slice(1)

  const expections = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => 
        expections.includes(word) ? word : capitalize(word)
    ).join(' ');
  
  return capitalize(titleCase);
}

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));

*/

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data 
into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A 
dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following 
things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow 
copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function 
parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a 
puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const juliasArr = [3, 5, 2, 12, 7];
// console.log(juliasArr.slice(1, -2));
// const checkDogs = function(dogsJulia, dogsKate) {
//    const juliaCorrect= dogsJulia.slice(1, -2);
//    const dogs = juliaCorrect.concat(dogsKate);
//   //  console.log(dogsJulia);
//    dogs.forEach((year, num) =>{
//      let aorp = year >=3 ? 'adult' : 'pupi';
//      console.log(`Dog number ${num + 1} is an ${aorp}, and is ${year} years old`);
//    })
// }
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// console.log('------------------------')
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);


///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the 
average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. 
If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = function(ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   const adults = humanAges.filter(age => age >= 18);
//   console.log(humanAges);
//   console.log(adults);

//   // const average = adults.reduce((acc, age, i, arr) => acc + age, 0) / adults.length;

//   const average = adults.reduce((acc, age, i, arr) => acc + age / arr.length, 0);

//   return average;
// }
// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// console.log(avg1, avg2);


///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = ages => 
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);



// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// console.log(avg1, avg2);

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating 
too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, 
and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% 
below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended 
food portion and add it to the object as a new property. Do NOT create a new array, simply 
loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams
   of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: 
Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so 
this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an 
array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice 
and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is 
recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse 
  the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an 
ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture 
to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: 
current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current 
portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

// 1.
dogs.forEach(dog => dog.recPortion = Math.trunc(dog.weight ** 0.75 * 28));
console.log(dogs);

// 2.
const sarahDog = dogs.filter(dog => dog.owners.includes('Sarah'));
console.log(
  `Sarah's dog is eating too ${sarahDog.curFood > sarahDog.recPortion ? 'much' : 'little'}`
);

//3
const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.recPortion).flatMap(dog => dog.owners);
const ownersEatTooLittle = dogs.filter(dog => dog.curFood < dog.recPortion).flatMap(dog => dog.owners);

//4
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

//5
console.log(dogs.some(dog => dog.curFood === dog.recPortion));

//6
// console.log(dogs.some(dog => dog.curFood > (dog.recPortion * 0.90) && dog.curFood < (dog.recPortion * 1.10)));
const checkEatingOkay =  dog => dog.curFood > (dog.recPortion * 0.90) && dog.curFood < (dog.recPortion * 1.10);
console.log(dogs.some(checkEatingOkay));
//7
const okayDogs = dogs.filter(checkEatingOkay);
console.log(okayDogs);

//8

const sortArr = dogs.slice().sort((a, b) => a.recPortion - b.recPortion);
console.log(sortArr);


