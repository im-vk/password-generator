const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDispaly = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "`~`!@#$%^&*()_-+={[]}}|\:;'''<>,./?";
 
let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
setIndicator('#ccc')

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max-min)+"% 100%" )
} 




function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;


}


function getRandomInteger(min, max)
{
   return  Math.floor(Math.random()*(max-min)) + min;
}


function generateRandomNumber()
{
    return getRandomInteger(0, 9);
}

function generateLowerCase()
{
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase()
{
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol()
{
    const rndNum = getRandomInteger(0, symbols.length);

    return symbols.charAt(rndNum);
}


function calcStrength()
{
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;


    if(upperCaseCheck.checked) hasUpper = true;
    if(lowerCaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym = true;


    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8)
    {
        setIndicator('#0f0');
    }
    else if(
        (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6
    ){
        setIndicator('#ff0');
    }else{
        setIndicator('#f00');
    }

}


async function copyContent()
{
    try{
        await navigator.clipboard.writeText(passwordDispaly.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
     copyMsg.innerText = "failed";        
    }

    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000); 
}

function handleCheckBox()
{
    checkCount = 0;
    allCheckBox.forEach( (checkbox) =>{
        if(checkbox.checked)
        {
            checkCount++;
        }
    } );

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
}

function shufflePass(array)
{
    // Fisher Yates Method

    for(let i = array.length - 1; i>0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) =>(str += el));
    return str;
}


allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBox);
})

inputSlider.addEventListener('input', (e) => {
        passwordLength = e.target.value;
        handleSlider();
})


copyBtn.addEventListener('click', ()=>{
    if(passwordDispaly.value)
    {
        copyContent();
    }
})

generateBtn.addEventListener('click', ()=>{
    if(checkCount <= 0)
    {
        return;
    }

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

    // remove old password:
    password = "";

    // if(upperCaseCheck.checked)
    // {
    //     password += generateUpperCase();
    // }

    // if(lowerCaseCheck.checked)
    // {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked)
    // {
    //     password += generateRandomNumber();
    // }

    // if(symbolCheck.checked)
    // {
    //     password += generateSymbol();
    // }

    let funArrr = [];

    if(upperCaseCheck.checked)
    {
        funArrr.push(generateUpperCase);
    }

    if(lowerCaseCheck.checked)
    {
        funArrr.push(generateLowerCase);
    }

    if(numbersCheck.checked)
    {
        funArrr.push(generateRandomNumber);
    }

    if(symbolCheck.checked)
    {
        funArrr.push(generateSymbol);
    }
    

    for(let i = 0; i<funArrr.length; i++)
    {
        password += funArrr[i]();
    }

    for(let i = 0; i<passwordLength - funArrr.length; i++)
    {
        let randIndex = getRandomInteger(0, funArrr.length);
        password += funArrr[randIndex]();
    }

    // shuffle password
    password = shufflePass(Array.from(password));



    // display password
    passwordDispaly.value = password;


    // calculate strength
    calcStrength();

})