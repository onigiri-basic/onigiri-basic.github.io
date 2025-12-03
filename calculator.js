/**
 * Калькулятор стоимости заказа
 * Файл: calculator.js
 */

// Функция для валидации ввода количества
function validateQuantity(quantity) {
    const quantityRegex = /^[1-9]\d*$/;
    return quantityRegex.test(quantity);
}

// Функция для расчета стоимости и отображения результата
function calculateOrder(event) {
    event.preventDefault();
    
    const productSelect = document.getElementById('productSelect');
    const quantityInput = document.getElementById('quantityInput');
    
    const productValue = productSelect.value;
    const quantityValue = quantityInput.value.trim();
    
    // Проверяем, выбран ли товар
    if (!productValue) {
        alert('Ошибка: Пожалуйста, выберите товар из списка');
        return;
    }
    
    // Проверяем, введено ли количество
    if (!quantityValue) {
        alert('Ошибка: Пожалуйста, введите количество товара');
        return;
    }
    
    // Проверяем корректность ввода количества
    if (!validateQuantity(quantityValue)) {
        alert('Ошибка: Количество должно быть целым положительным числом (например: 1, 5, 10)');
        return;
    }
    
    // Получаем данные для расчета
    const productPrice = parseInt(productSelect.value, 10);
    const quantity = parseInt(quantityValue, 10);
    
    // Получаем название товара
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    const productName = selectedOption.text.split(' - ')[0];
    
    // Рассчитываем стоимость
    const totalCost = productPrice * quantity;
    
    // Форматируем числа для красивого отображения
    const formattedPrice = productPrice.toLocaleString('ru-RU');
    const formattedTotal = totalCost.toLocaleString('ru-RU');
    
    // Показываем результат в alert
    alert(
        `РАСЧЕТ СТОИМОСТИ ЗАКАЗА\n\n` +
        `Товар: ${productName}\n` +
        `Цена за единицу: ${formattedPrice} руб.\n` +
        `Количество: ${quantity} шт.\n` +
        `------------------------\n` +
        `ИТОГО: ${formattedTotal} руб.`
    );
}

// Функция для обработки нажатия Enter в поле ввода
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        calculateOrder(event);
    }
}

// Инициализация после загрузки DOM
window.addEventListener('DOMContentLoaded', function(event) {
    console.log("DOM fully loaded and parsed");
    
    // Получаем кнопку расчета и назначаем обработчик
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', calculateOrder);
    
    // Добавляем обработчик на форму
    const orderForm = document.getElementById('orderForm');
    orderForm.addEventListener('submit', calculateOrder);
    
    // Добавляем обработчик нажатия Enter в поле ввода
    const quantityInput = document.getElementById('quantityInput');
    quantityInput.addEventListener('keypress', handleEnterKey);
    
    console.log('Калькулятор инициализирован. Результаты будут показываться в alert.');
});
