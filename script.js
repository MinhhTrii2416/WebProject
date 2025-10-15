const clear = document.getElementById("clear");
const back = document.getElementById("back");
const divide = document.getElementById("divide");
const time = document.getElementById("time");
const minus = document.getElementById("minus");
const plus = document.getElementById("plus");
const result = document.getElementById("result");
const number = [document.getElementById("zero"),
    document.getElementById("one"), document.getElementById("two"), document.getElementById("three"),
    document.getElementById("four"), document.getElementById("five"), document.getElementById("six"),
    document.getElementById("seven"), document.getElementById("eight"), document.getElementById("nine")
];

clear.addEventListener('click', () => {
    result.textContent = "0";
});
for(let i=0; i<10; i++) {
    number[i].addEventListener('click', () => {
        result.textContent = i;
    });
}