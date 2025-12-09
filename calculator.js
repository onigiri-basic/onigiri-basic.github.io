/**
 * Калькулятор стоимости услуги
 * Файл: calculator.js
 */

// Глобальные переменные для данных и элементов
let serviceData = null;
let quantityInput, optionsGroup, optionsSelect, propertyGroup, propertyCheckbox, totalPrice;
let serviceTypeRadios = [];

// Функция загрузки данных из JSON файла
async function loadServiceData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        serviceData = await response.json();
        console.log('Данные услуг загружены:', serviceData);
        initializeCalculator();
        displayServiceFeatures(); // Отображаем особенности услуг
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        // Используем данные по умолчанию при ошибке
        serviceData = {
            serviceTypes: [
                {
                    id: "basic",
                    name: "Базовая разработка",
                    basePrice: 500,
                    description: "Простая верстка HTML/CSS без дополнительных функций",
                    hasOptions: false,
                    hasProperty: false
                },
                {
                    id: "standard",
                    name: "Стандартная разработка",
                    basePrice: 800,
                    description: "Разработка с использованием JavaScript и базовой функциональностью",
                    hasOptions: true,
                    hasProperty: false,
                    options: [
                        { id: "none", name: "Без дополнительных опций", price: 0 },
                        { id: "responsive", name: "Адаптивная верстка (+200 руб.)", price: 200 },
                        { id: "seo", name: "SEO-оптимизация (+300 руб.)", price: 300 },
                        { id: "cms", name: "Интеграция с CMS (+400 руб.)", price: 400 }
                    ]
                },
                {
                    id: "premium",
                    name: "Премиум разработка",
                    basePrice: 1200,
                    description: "Полнофункциональная разработка с индивидуальным дизайном",
                    hasOptions: false,
                    hasProperty: true,
                    property: {
                        id: "urgent",
                        name: "Срочный заказ (доплата 30%)",
                        multiplier: 1.3
                    }
                }
            ],
            defaultQuantity: 1,
            currency: "руб."
        };
        initializeCalculator();
        displayServiceFeatures(); // Отображаем особенности услуг
    }
}

// Функция для отображения особенностей услуг
function displayServiceFeatures() {
    const serviceFeaturesContainer = document.getElementById('serviceFeatures');
    
    if (!serviceFeaturesContainer || !serviceData || !serviceData.serviceTypes) {
        console.error('Контейнер для особенностей услуг не найден или данные не загружены');
        return;
    }
    
    // Очищаем контейнер
    serviceFeaturesContainer.innerHTML = '';
    
    // Создаем элементы для каждого типа услуги
    serviceData.serviceTypes.forEach(service => {
        const listItem = document.createElement('li');
        listItem.className = 'service-feature-item';
        
        // Создаем заголовок
        const title = document.createElement('strong');
        title.textContent = `${service.name}: `;
        listItem.appendChild(title);
        
        // Добавляем описание
        const description = document.createElement('span');
        description.textContent = service.description || `Базовая цена: ${service.basePrice} ${serviceData.currency}`;
        listItem.appendChild(description);
        
        // Добавляем особенности
        const features = document.createElement('div');
        features.className = 'service-features-details';
        
        // Базовая цена
        const priceInfo = document.createElement('div');
        priceInfo.textContent = `💵 Базовая цена: ${service.basePrice} ${serviceData.currency} за единицу`;
        features.appendChild(priceInfo);
        
        // Доступные опции
        if (service.hasOptions) {
            const optionsInfo = document.createElement('div');
            optionsInfo.textContent = '✅ Доступны дополнительные опции (выбор из списка)';
            features.appendChild(optionsInfo);
            
            // Список опций
            if (service.options && service.options.length > 0) {
                const optionsList = document.createElement('ul');
                optionsList.className = 'options-list';
                
                service.options.forEach(option => {
                    if (option.price > 0) {
                        const optionItem = document.createElement('li');
                        optionItem.textContent = `${option.name}: +${option.price} ${serviceData.currency}`;
                        optionsList.appendChild(optionItem);
                    }
                });
                
                features.appendChild(optionsList);
            }
        } else {
            const noOptionsInfo = document.createElement('div');
            noOptionsInfo.textContent = '❌ Без дополнительных опций';
            features.appendChild(noOptionsInfo);
        }
        
        // Доступные свойства
        if (service.hasProperty) {
            const propertyInfo = document.createElement('div');
            if (service.property) {
                propertyInfo.textContent = `✅ Доступно свойство: ${service.property.name}`;
                if (service.property.multiplier && service.property.multiplier !== 1) {
                    const multiplierInfo = document.createElement('div');
                    const percentIncrease = Math.round((service.property.multiplier - 1) * 100);
                    multiplierInfo.textContent = `📈 Увеличивает стоимость на ${percentIncrease}%`;
                    multiplierInfo.className = 'multiplier-info';
                    features.appendChild(multiplierInfo);
                }
            } else {
                propertyInfo.textContent = '✅ Доступны дополнительные свойства (чекбоксы)';
            }
            features.appendChild(propertyInfo);
        } else {
            const noPropertyInfo = document.createElement('div');
            noPropertyInfo.textContent = '❌ Без дополнительных свойств';
            features.appendChild(noPropertyInfo);
        }
        
        listItem.appendChild(features);
        serviceFeaturesContainer.appendChild(listItem);
    });
}

// Функция для инициализации калькулятора после загрузки данных
function initializeCalculator() {
    console.log("Инициализация калькулятора стоимости услуги");
    
    // Получаем DOM элементы
    quantityInput = document.getElementById('quantityInput');
    optionsGroup = document.getElementById('optionsGroup');
    optionsSelect = document.getElementById('optionsSelect');
    propertyGroup = document.getElementById('propertyGroup');
    propertyCheckbox = document.getElementById('propertyCheckbox');
    totalPrice = document.getElementById('totalPrice');
    const radioContainer = document.querySelector('.radio-group');
    
    // Очищаем контейнер с радиокнопками
    radioContainer.innerHTML = '';
    
    // Создаем радиокнопки на основе данных из JSON
    serviceData.serviceTypes.forEach((service, index) => {
        const radioId = `service-${service.id}`;
        const radioLabel = document.createElement('label');
        radioLabel.className = 'radio-label';
        
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'serviceType';
        radioInput.value = service.id;
        radioInput.id = radioId;
        
        // Устанавливаем первый элемент по умолчанию
        if (index === 0) {
            radioInput.checked = true;
        }
        
        const radioSpan = document.createElement('span');
        radioSpan.textContent = `${service.name} (${service.basePrice} ${serviceData.currency})`;
        
        radioLabel.appendChild(radioInput);
        radioLabel.appendChild(radioSpan);
        radioContainer.appendChild(radioLabel);
        
        // Сохраняем ссылку на радиокнопку
        serviceTypeRadios.push(radioInput);
    });
    
    // Назначаем обработчики на радиокнопки
    serviceTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const serviceType = this.value;
            const service = serviceData.serviceTypes.find(s => s.id === serviceType);
            updateFormBasedOnService(service);
            calculateTotal();
        });
    });
    
    // Назначаем обработчики на другие элементы формы
    quantityInput.addEventListener('input', calculateTotal);
    optionsSelect.addEventListener('change', calculateTotal);
    propertyCheckbox.addEventListener('change', calculateTotal);
    
    // Устанавливаем значение по умолчанию для количества
    quantityInput.value = serviceData.defaultQuantity;
    
    // Инициализируем отображение для выбранного по умолчанию типа
    const defaultService = serviceData.serviceTypes[0];
    updateFormBasedOnService(defaultService);
    
    // Выполняем первоначальный расчет
    calculateTotal();
    
    console.log('Калькулятор инициализирован с данными из JSON.');
}

// Функция для обновления формы в зависимости от выбранного типа услуги
function updateFormBasedOnService(service) {
    // Обновляем опции для стандартной услуги
    if (service.hasOptions && service.options) {
        optionsGroup.style.display = 'block';
        optionsSelect.innerHTML = '';
        
        service.options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.price;
            optionElement.textContent = option.name;
            optionsSelect.appendChild(optionElement);
        });
    } else {
        optionsGroup.style.display = 'none';
    }
    
    // Обновляем свойство для премиум услуги
    if (service.hasProperty && service.property) {
        propertyGroup.style.display = 'block';
        const checkboxLabel = propertyGroup.querySelector('span');
        checkboxLabel.textContent = service.property.name;
    } else {
        propertyGroup.style.display = 'none';
        propertyCheckbox.checked = false;
    }
}

// Функция для расчета стоимости
function calculateTotal() {
    if (!serviceData) return;
    
    // Получаем выбранный тип услуги
    const selectedRadio = document.querySelector('input[name="serviceType"]:checked');
    if (!selectedRadio) return;
    
    const serviceType = selectedRadio.value;
    const service = serviceData.serviceTypes.find(s => s.id === serviceType);
    
    // Получаем количество
    const quantity = parseInt(quantityInput.value) || serviceData.defaultQuantity;
    
    // Базовая цена за единицу
    let basePrice = service.basePrice;
    
    // Дополнительные опции (для стандартной услуги)
    let optionsPrice = 0;
    if (service.hasOptions) {
        optionsPrice = parseInt(optionsSelect.value) || 0;
    }
    
    // Свойство "Срочный заказ" (для премиум услуги)
    let propertyMultiplier = 1;
    if (service.hasProperty && propertyCheckbox.checked) {
        propertyMultiplier = service.property.multiplier || 1;
    }
    
    // Рассчитываем итоговую стоимость
    let total = (basePrice + optionsPrice) * quantity * propertyMultiplier;
    
    // Округляем до целого числа
    total = Math.round(total);
    
    // Обновляем отображение цены
    updatePriceDisplay(total);
}

// Функция для обновления отображения цены
function updatePriceDisplay(price) {
    totalPrice.textContent = `${price.toLocaleString('ru-RU')} ${serviceData.currency}`;
    
    // Добавляем анимацию
    totalPrice.style.animation = 'none';
    setTimeout(() => {
        totalPrice.style.animation = 'priceUpdate 0.5s ease';
    }, 10);
}

// Инициализация после загрузки DOM
window.addEventListener('DOMContentLoaded', loadServiceData);
