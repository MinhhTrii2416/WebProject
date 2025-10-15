// --- Lấy các phần tử từ HTML ---
const result = document.getElementById("result");
const pheptinh = document.getElementById("pheptinh");
const clear = document.getElementById("clear");
const back = document.getElementById("back");
const equal = document.getElementById("equal"); // Thêm nút bằng

// Lấy tất cả các nút số và nút dấu chấm
const numberButtons = document.querySelectorAll(
    "#zero, #one, #two, #three, #four, #five, #six, #seven, #eight, #nine, #point"
);

// Lấy tất cả các nút phép tính
const operatorButtons = document.querySelectorAll(
    "#divide, #time, #minus, #plus"
);

// --- Biến để lưu trạng thái của máy tính ---
let firstOperand = "";      // Số hạng đầu tiên
let secondOperand = "";     // Số hạng thứ hai
let currentOperator = null; // Phép tính hiện tại

// --- Các hàm chức năng ---

// Hàm reset máy tính về trạng thái ban đầu
function resetCalculator() {
    firstOperand = "";
    secondOperand = "";
    currentOperator = null;
    updateDisplay();
}

// Hàm cập nhật hiển thị trên màn hình
function updateDisplay() {
    if (currentOperator) {
        pheptinh.textContent = `${firstOperand}${currentOperator}`;
        result.textContent = secondOperand || "0";
    } else {
        pheptinh.textContent = "";
        result.textContent = firstOperand || "0";
    }
}

// Hàm thực hiện tính toán
function calculate() {
    // Chỉ tính toán khi có đủ 3 thành phần
    if (firstOperand === "" || secondOperand === "" || currentOperator === null) {
        return;
    }

    let computation;
    // Chuyển đổi chuỗi có dấu ',' thành số thực có dấu '.' để tính toán
    const prev = parseFloat(firstOperand.replace(',', '.'));
    const current = parseFloat(secondOperand.replace(',', '.'));

    if (isNaN(prev) || isNaN(current)) return;

    switch (currentOperator) {
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
            if (current === 0) {
                result.textContent = "Error"; // Hiển thị lỗi chia cho 0
                pheptinh.textContent = "";
                firstOperand = "";
                secondOperand = "";
                currentOperator = null;
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }

    // Cập nhật trạng thái: kết quả trở thành số hạng đầu tiên cho phép tính tiếp theo
    firstOperand = String(computation).replace('.', ',');
    secondOperand = "";
    currentOperator = null;
}


// --- Gán sự kiện cho các nút ---

// Sự kiện cho các nút số
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        const number = button.textContent;
        if (currentOperator === null) {
            if (number === ',' && firstOperand.includes(',')) return;
            firstOperand += number;
        } else {
            if (number === ',' && secondOperand.includes(',')) return;
            secondOperand += number;
        }
        updateDisplay();
    });
});

// Sự kiện cho các nút phép tính
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (firstOperand === "") return;

        // Nếu đã có phép tính và số thứ hai, hãy tính kết quả trước (tính toán nối tiếp)
        if (currentOperator !== null && secondOperand !== "") {
            calculate();
        }

        currentOperator = button.textContent;
        updateDisplay();
    });
});

// Sự kiện cho nút = (Equal)
equal.addEventListener('click', () => {
    calculate();
    updateDisplay();
});


// Sự kiện cho nút C (Clear)
clear.addEventListener('click', resetCalculator);

// Sự kiện cho nút xóa lùi (Backspace)
back.addEventListener('click', () => {
    if (secondOperand) {
        secondOperand = secondOperand.slice(0, -1);
    } else if (currentOperator) {
        currentOperator = null;
    } else if (firstOperand) {
        firstOperand = firstOperand.slice(0, -1);
    }
    updateDisplay();
});

// Khởi tạo hiển thị ban đầu
updateDisplay();