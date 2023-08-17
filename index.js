// Initially set the values

let password = "";
let password_length = 10;
let checkCount = 0;



// Set password length
const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-length-number]");
handleSlider();
function handleSlider() {
    inputSlider.value = password_length;
    lengthDisplay.innerText = password_length;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((password_length - min) * 100 / (max - min)) + "% 100%";
}


// Set indicator color
const indicator = document.querySelector("[data-indicator]")
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `1px 1px 10px 3px ${color}`;
}

// set the color to greyish intially
setIndicator("#ccc");


// This function will return a random integer from min to max;
// Math.random() will return a random value from 0 to 1 
// Math.random() * (max-min) will return a value from 0 to (max-min);
// Math.floor() rounds a number DOWN to the nearest integer.
// Math.floor(Math.random() * (max - min)) + min will return a value from [(0+min) to ((max-min)+min)] i.e. from min to max.

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function generateRndNumb() {
    return getRndInteger(0, 9);  // return random value from 0 to 9
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123)); // return random character from 97 to 123;
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));   // return random character from 97 to 123;
}



// generate symbols string
const symbols = '~`@#$%^&*()_-+={[}]|:;"<,>.?/';
function generateSymbols() {
    const random_index = getRndInteger(0, symbols.length);
    return symbols.charAt(random_index);  // return symbol at random_index
}

// Set indicator color to show the strength
let Upper_case_check = document.querySelector("#uppercase");
let lower_case_check = document.querySelector("#lowercase");
let symbols_check = document.querySelector("#symbols");
let number_check = document.querySelector("#numbers");
function calculate_strength() {
    let Upper_case = false;
    let lower_case = false;
    let symbols = false;
    let numbers = false;

    if (Upper_case_check.checked)
        Upper_case = true;

    if (lower_case_check.checked)
        lower_case = true;

    if (symbols_check.checked)
        symbols = true;

    if (number_check.checked)
        numbers = true;

    // red yellow green according to strength of password

    if (Upper_case && lower_case && (numbers || symbols) && password_length >= 8)
        setIndicator("green");
    else if ((Upper_case || lower_case) && (numbers || symbols) && password_length >= 6)
        setIndicator("yellow");
    else
        setIndicator("red");
}

// copy krna hai clipboard prr

const copy_message = document.querySelector("[data-copy-mssg]");
const display_password = document.querySelector("[data-password-display]")
async function copy_content() {
    try {
        await navigator.clipboard.writeText(display_password.value);
        copy_message.innerText = "copied";
    }
    catch (e) {
        copy_message.innerText = "Failed";
    }


    copy_message.classList.add("active");
    setTimeout(() => {
        copy_message.classList.remove("active");
    }, 2000);
}


// shuffle the password
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// hume checkboxes prr event listener add krna padega to count ki kitne checkboxes tick hai
// because of number of checkboxes ticked=0 then password is not generated.

let allCheckBoxes = document.querySelectorAll("input[type=checkbox]");
function handle_CheckBox_Change() {
    checkCount = 0;
    allCheckBoxes.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    // console.log("this is " + checkCount);
    if (password_length > checkCount) {
        password_length = checkCount;
        handleSlider();
    }
}

allCheckBoxes.forEach((checkbox) => {
    checkbox.addEventListener('change', handle_CheckBox_Change);
})



// Add event listener over the slider
inputSlider.addEventListener('input', (e) => {
    password_length = e.target.value;
    handleSlider();
})

// Add event listener over the copy button
const copy_button = document.querySelector("[copyBtn]");
copy_button.addEventListener('click', () => {
    if (display_password.value)
        copy_content();
})
// Add event listener to the generate password button
const generate_password = document.querySelector(".generatebutton");
generate_password.addEventListener('click', () => {
    // none of the checkbox are selected
    if (checkCount <= 0)
        return;

    if (password_length <= checkCount) {
        password_length = checkCount;
        console.log(password_length);
        handleSlider();
    }


    // start producing password

    // remove old password
    password = "";

    // we create a array which consist those function whose checkbox are tick
    let funcArray = new Array();

    // if uppercase checkbox tick then push generateUpperCase function in the array
    if (Upper_case_check.checked)
        funcArray.push(generateUpperCase);

    if (lower_case_check.checked)
        funcArray.push(generateLowerCase);

    if (symbols_check.checked)
        funcArray.push(generateSymbols);

    if (number_check.checked)
        funcArray.push(generateRndNumb);

    // Firstly add those whose checkbox are tick i.e. compulsory addition
    for (let i = 0; i < funcArray.length; i++) {
        password += funcArray[i]();
        console.log('ncbvcm');
    }

    console.log(funcArray.length);
    for (let i = 0; i < password_length - funcArray.length; i++) {
        let randIndex = getRndInteger(0, funcArray.length);
        password += funcArray[randIndex]();
    }
    // shuffle the password
    password = shufflePassword(Array.from(password));

    // display the password
    display_password.value = password;

    // Call the strenth indicator
    calculate_strength();
})













