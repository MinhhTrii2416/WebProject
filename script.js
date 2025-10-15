const clear = document.getElementById("clear");
const back = document.getElementById("back");
const divide = document.getElementById("divide");
const time = document.getElementById("time");
const minus = document.getElementById("minus");
const plus = document.getElementById("plus");
const result = document.getElementById("result");
const pheptinh = document.getElementById("pheptinh");
const number = [document.getElementById("zero"),
    document.getElementById("one"), document.getElementById("two"), document.getElementById("three"),
    document.getElementById("four"), document.getElementById("five"), document.getElementById("six"),
    document.getElementById("seven"), document.getElementById("eight"), document.getElementById("nine"),
    document.getElementById("point")
];
let buff = ["", ""]; // số thứ nhất và số thứ 2
let check = false; // có đang sài phép tính ?
let calculation = "";
// xử lí nút clear
clear.addEventListener('click', () => {
    buff[0] = ""; buff[1] = "";
    check = false;
    result.textContent = "0";
});
// xử lí các nút số
for(let i=0; i<11; i++) {
    number[i].addEventListener('click', () => {
        if(i == 10) {
            if(!check) {
                buff[0] = buff[0] + ",";
                result.textContent = buff[0];
                duplicate++;
            }else{
                buff[1] = buff[1] + ",";
                result.textContent = calculation + buff[1];
                duplicate++;
            }
        }else {
            if(!check) {
                buff[0] = buff[0] + i;
                result.textContent = buff[0];
            }else{
                buff[1] = buff[1] + i;
                result.textContent = calculation + buff[1];
            }
        }
    });
}
// xử lí nút xóa 1
back.addEventListener('click', () => {
    if(buff[1] != ""){
        buff[1] = buff[1].slice(0, -1);
        result.textContent = calculation + buff[1];
    }
    else if(calculation != "") {
        calculation = "";
        result.textContent = buff[0];
    }
    else if(buff[0] != ""){
        buff[0] = buff[0].slice(0, -1);
        if(buff[0] != "") result.textContent = buff[0];
        else result.textContent = "0";
    }
});

// xử lí calculation
if(!check){ // chưa sài phép tính
    divide.addEventListener('click', () => {
        calculation = "/";
        check = true;
    });
    time.addEventListener('click', ()=> {
        calculation = "*";
        check = true;
    });
    minus.addEventListener('click', ()=> {
        calculation = "-";
        check = true;
    });
    plus.addEventListener('click', () => {
        calculation = "+";
        check = true;
    });
}
else{
    divide.addEventListener('click', () => {
        calculation = "/";
        check = true;
    });
    time.addEventListener('click', ()=> {
        calculation = "*";
        check = true;
    });
    minus.addEventListener('click', ()=> {
        calculation = "-";
        check = true;
    });
    plus.addEventListener('click', () => {
        calculation = "+";
        check = true;
    });
}