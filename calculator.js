/**
 * Калькулятор стоимости заказа
 * Файл: calculator.js
 * Автор: Сергей Синица
 * Год: 2023
 */

// Инициализация после полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы DOM
    const calculateBtn = document.getElementById('calculateBtn');
    const productSelect = document.getElementById('productSelect');
    const quantityInput = document.getElementById('quantityInput');
    const resultOutput = document.getElementById('resultOutput');
    const errorMessage = document.getElementById('errorMessage');
    const orderForm = document.getElementById('orderForm');
    
    // Регулярное выражение для проверки ввода количества (только целые положительные числа)
    const quantityRegex = /^[1-9]\d*$/;
    
    /**
     * Проверяет корректность введенных данных
     * @returns {boolean} true если данные корректны, false если есть ошибки
     */
    function validateInput() {
        const productValue = productSelect.value;
        const quantityValue = quantityInput.value.trim();
        
        // Сбрасываем предыдущие сообщения об ошибках
        errorMessage.textContent = '';
        quantityInput.style.borderColor = '';
        
        // Проверяем, выбран ли товар
        if (!productValue) {
            errorMessage.textContent = 'Пожалуйста, выберите товар из списка';
            productSelect.style.borderColor = '#e74c3c';
            return false;
        } else {
            productSelect.style.borderColor = '';
        }
        
        // Проверяем, введено ли количество
        if (!quantityValue) {
            errorMessage.textContent = 'Пожалуйста, введите количество товара';
            quantityInput.style.borderColor = '#e74c3c';
            return false;
        }
        
        // Проверяем соответствие регулярному выражению
        if (!quantityRegex.test(quantityValue)) {
            errorMessage.textContent = 'Количество должно быть целым положительным числом (например: 1, 5, 10)';
            quantityInput.style.borderColor = '#e74c3c';
            return false;
        }
        
        quantityInput.style.borderColor = '';
        return true;
    }
    
    /**
     * Рассчитывает стоимость заказа
     */
    function calculateOrderCost() {
        // Проверяем корректность ввода
        if (!validateInput()) {
            resultOutput.textContent = 'Пожалуйста, исправьте ошибки в форме';
            resultOutput.style.color = '#e74c3c';
            return;
        }
        
        // Получаем значения из формы
        const productPrice = parseInt(productSelect.value, 10);
        const quantity = parseInt(quantityInput.value.trim(), 10);
        
        // Рассчитываем стоимость
        const totalCost = productPrice * quantity;
        
        // Получаем название товара
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        const productName = selectedOption.text.split(' - ')[0];
        
        // Форматируем результат
        const formattedCost = totalCost.toLocaleString('ru-RU');
        
        // Выводим результат
        resultOutput.innerHTML = `
            <div style="text-align: center;">
                <div>Товар: <strong>${productName}</strong></div>
                <div>Количество: <strong>${quantity}</strong> шт.</div>
                <div>Цена за единицу: <strong>${productPrice}</strong> руб.</div>
                <div style="margin-top: 10px; font-size: 2.2rem; color: #2c3e50;">
                    Итого: <strong>${formattedCost}</strong> руб.
                </div>
            </div>
        `;
        resultOutput.style.color = '#2c3e50';
    }
    
    /**
     * Обработчик события нажатия на кнопку расчета
     */
    function handleCalculateClick() {
        calculateOrderCost();
    }
    
    /**
     * Обработчик события отправки формы (предотвращает стандартное поведение)
     * @param {Event} event - событие отправки формы
     */
    function handleFormSubmit(event) {
        event.preventDefault();
        calculateOrderCost();
    }
    
    /**
     * Обработчик события ввода в поле количества (для валидации в реальном времени)
     */
    function handleQuantityInput() {
        const quantityValue = quantityInput.value.trim();
        
        if (!quantityValue) {
            errorMessage.textContent = '';
            quantityInput.style.borderColor = '';
            return;
        }
        
        if (!quantityRegex.test(quantityValue)) {
            errorMessage.textContent = 'Количество должно быть целым положительным числом';
            quantityInput.style.borderColor = '#e74c3c';
        } else {
            errorMessage.textContent = '';
            quantityInput.style.borderColor = '#4CAF50';
        }
    }
    
    /**
     * Обработчик события изменения выбора товара
     */
    function handleProductChange() {
        if (productSelect.value) {
            productSelect.style.borderColor = '';
            errorMessage.textContent = '';
        }
    }
    
    // Назначаем обработчики событий
    calculateBtn.addEventListener('click', handleCalculateClick);
    orderForm.addEventListener('submit', handleFormSubmit);
    quantityInput.addEventListener('input', handleQuantityInput);
    productSelect.addEventListener('change', handleProductChange);
    
    // Добавляем обработчик нажатия клавиши Enter в поле ввода
    quantityInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            calculateOrderCost();
        }
    });
    
    // Инициализация формы при загрузке
    console.log('Калькулятор стоимости заказа инициализирован');
});
