const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let checkCount = 0;
setIndicator('#ccc')

handleSlider()

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize  =
        ((passwordLength - min) * 100) / (max - min) + "% 100%";

}

function setIndicator(color) {

    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0 0 10px ${color}, 0 0 10px ${color}`;

}

function getRndInteger(min, max) {

    return Math.floor(Math.random() * (max - min)) + min;

}

function generateRandomNumber() {

    return getRndInteger(0, 20);

}

function generateRandomLowercase() {

    return String.fromCharCode(getRndInteger(97, 123));

}

function generateRandomUppercase() {

    return String.fromCharCode(getRndInteger(65, 91));

}

function generateRandomSymbol() {

    const symbols = "!@#$%^&*(){}[]=<>/,.";

    return symbols[getRndInteger(0, symbols.length)];

}

function calcStength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumbers = false;
    let hasSymbols = false;

    if (uppercaseCheck.checked) {
        hasUpper = true;
    }
    if (lowercaseCheck.checked) {
        hasLower = true;
    }
    if (numbersCheck.checked) {
        hasNumbers = true;
    }
    if (symbolsCheck.checked) {
        hasSymbols = true;
    }

    if (hasUpper && hasLower && (hasNumbers || hasSymbols) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasUpper || hasLower) && (hasNumbers || hasSymbols) && passwordLength >= 6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    }
    catch (e) {
        copyMsg.innerText = "Failed to copy!";
    }

    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function handleCheckboxchange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("click", handleCheckboxchange);
});
inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value !== "") {
        copyContent();
    }
});

function passwordSuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((item) => {
        str += item;
    });
    return str;


}
generateBtn.addEventListener("click", () => {
    if (checkCount <= 0)
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    // if(uppercaseCheck.checked){
    //     password += generateRandomUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateRandomLowercase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }   
    // if(symbolsCheck.checked){
    //     password += generateRandomSymbol();
    // }


    let funcArr = [];
    if (uppercaseCheck.checked) {
        funcArr.push(generateRandomUppercase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateRandomLowercase);
    }
    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funcArr.push(generateRandomSymbol);
    }

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    password = passwordSuffle(Array.from(password));
    passwordDisplay.value = password;
    calcStength();
});
