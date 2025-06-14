/// <reference types="cypress" />
import type {} from '../support/cypress';
import '../support/commands'

const selectors = {
    INGREDIENT_CLASS: `[data-cy='ingredient-class']`,
    INGREDIENT_BUN: '[data-type="bun"]',
    INGREDIENT_MAIN: '[data-type="main"]',
    INGREDIENT_SAUCE: '[data-type="sauce"]',
    CONSTRUCTOR_BUN_TOP: '[data-cy="constructor-bun-top"]',
    CONSTRUCTOR_BUN_BOTTOM: '[data-cy="constructor-bun-bottom"]',
    CONSTRUCTOR_INGREDIENT: '[data-cy="constructor-ingredient"]',
    CONSTRUCTOR_INGREDIENT_ELEMENT: '[data-cy="constructor-ingredient-element"]',
    MODAL: '[data-cy="modal"]',
    MODAL_OVERLAY: '[data-cy="modal-overlay"]',
    MODAL_TITLE: '[data-cy="modal-title"]',
    MODAL_CLOSE: '[data-cy="modal-close-button"]',
    ORDER_BUTTON: '[data-cy="order-button"]',
    ORDER_LOADING_MODAL: '[data-cy="order-loading-modal"]',
    ORDER_NUMBER: '[data-cy="order-number"]',
}

beforeEach(() => {
    cy.fixture('ingredients.json').then((ingredients) => {
        cy.intercept('GET', '**/api/ingredients', {
            statusCode: 200,
            body: { success: true, data: ingredients }
        }).as('getIngredients');
    });

    cy.visit('/');
  
    cy.wait(['@getIngredients']);
});

afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
});

describe('Конструктор', () => {

    it('Отображение категорий ингредиентов', () => {

        cy.get(selectors.INGREDIENT_CLASS).should('have.length', 3);
    
        cy.contains('Булки').should('exist');
        cy.contains('Начинки').should('exist');
        cy.contains('Соусы').should('exist');
      });

    describe('Добавление ингредиента в конструктор', () => {
        it('Добавление булки', () => {

            cy.get(selectors.CONSTRUCTOR_BUN_TOP).should('not.contain', 'Краторная булка N-200i');
            cy.get(selectors.CONSTRUCTOR_BUN_BOTTOM).should('not.contain', 'Краторная булка N-200i');

            cy.get(selectors.INGREDIENT_BUN).first().contains('Добавить').click();
    
            cy.get(selectors.CONSTRUCTOR_BUN_TOP).should('contain', 'Краторная булка N-200i');
            cy.get(selectors.CONSTRUCTOR_BUN_BOTTOM).should('contain', 'Краторная булка N-200i');
        });

        it('Добавление котлеты совместно с булками', () => {

            //Добавление булки
            cy.get(selectors.CONSTRUCTOR_BUN_TOP).should('not.contain', 'Краторная булка N-200i');
            cy.get(selectors.CONSTRUCTOR_BUN_BOTTOM).should('not.contain', 'Краторная булка N-200i');

            cy.get(selectors.INGREDIENT_BUN).first().contains('Добавить').click();

            cy.get(selectors.CONSTRUCTOR_BUN_TOP).should('contain', 'Краторная булка N-200i');
            cy.get(selectors.CONSTRUCTOR_BUN_BOTTOM).should('contain', 'Краторная булка N-200i');

            //Добавление котлеты
            cy.get(selectors.CONSTRUCTOR_INGREDIENT).should('not.contain', 'Биокотлета из марсианской Магнолии');

            cy.get(selectors.INGREDIENT_MAIN).first().contains('Добавить').click();

            cy.get(selectors.CONSTRUCTOR_INGREDIENT).should('contain', 'Биокотлета из марсианской Магнолии');
        })

        it('Добавление соуса совместно с основной начинкой и булками', () => {
            
            //Добавление булки
            cy.get(selectors.CONSTRUCTOR_BUN_TOP).should('not.contain', 'Краторная булка N-200i');
            cy.get(selectors.CONSTRUCTOR_BUN_BOTTOM).should('not.contain', 'Краторная булка N-200i');

            cy.get(selectors.INGREDIENT_BUN).first().contains('Добавить').click();

            cy.get(selectors.CONSTRUCTOR_BUN_TOP).should('contain', 'Краторная булка N-200i');
            cy.get(selectors.CONSTRUCTOR_BUN_BOTTOM).should('contain', 'Краторная булка N-200i');

            //Добавление котлеты
            cy.get(selectors.CONSTRUCTOR_INGREDIENT).should('not.contain', 'Биокотлета из марсианской Магнолии');

            cy.get(selectors.INGREDIENT_MAIN).first().contains('Добавить').click();

            cy.get(selectors.CONSTRUCTOR_INGREDIENT).should('contain', 'Биокотлета из марсианской Магнолии');

            //Добавление соуса
            cy.get(selectors.CONSTRUCTOR_INGREDIENT).should('not.contain', 'Соус традиционный галактический');

            cy.get(selectors.INGREDIENT_SAUCE).first().contains('Добавить').click();

            cy.get(selectors.CONSTRUCTOR_INGREDIENT).should('contain', 'Соус традиционный галактический');
        })
    })

    describe('Создание заказа', () => {
        beforeEach(() => {
            cy.intercept('GET', '**/api/auth/user', {
                fixture: 'user.json'
            }).as('getUser')
            window.localStorage.setItem('accessToken', 'testAccessToken');
            cy.setCookie('refreshToken', 'testRefreshToken')
            cy.reload()
            cy.wait('@getUser')
        })
        
        afterEach(() => {
            cy.clearLocalStorage();
            cy.clearCookies();
        });

        it('Жизенный цикл заказа', () => {

            //Проверили, что конструктор пуст
            cy.get(selectors.CONSTRUCTOR_BUN_TOP).should('not.contain', 'Краторная булка N-200i');
            cy.get(selectors.CONSTRUCTOR_BUN_BOTTOM).should('not.contain', 'Краторная булка N-200i');
            cy.get(selectors.CONSTRUCTOR_INGREDIENT).should('not.contain', 'Биокотлета из марсианской Магнолии');
            cy.get(selectors.CONSTRUCTOR_INGREDIENT).should('not.contain', 'Соус традиционный галактический');

            //Добавили ингридиенты
            cy.get(selectors.INGREDIENT_BUN).first().contains('Добавить').click();
            cy.get(selectors.INGREDIENT_MAIN).first().contains('Добавить').click();
            cy.get(selectors.INGREDIENT_SAUCE).first().contains('Добавить').click();

            //Проверили, что ингридиенты появились в конструкторе
            cy.get(selectors.CONSTRUCTOR_BUN_TOP).should('contain', 'Краторная булка N-200i');
            cy.get(selectors.CONSTRUCTOR_BUN_BOTTOM).should('contain', 'Краторная булка N-200i');
            cy.get(selectors.CONSTRUCTOR_INGREDIENT).should('contain', 'Биокотлета из марсианской Магнолии');
            cy.get(selectors.CONSTRUCTOR_INGREDIENT).should('contain', 'Соус традиционный галактический');

            //Нажали на кнопку отправки заказа
            cy.get(selectors.ORDER_BUTTON).click();
            cy.intercept('POST', 'api/orders', {fixture: 'order.json'});

            //Отерылось модальное окно с загрузкой
            cy.get(selectors.ORDER_LOADING_MODAL).should('exist');
            cy.get(selectors.ORDER_LOADING_MODAL).should('not.exist');

            //Проверили, что конструктор пуст сразу после отправки заказа
            cy.get(selectors.CONSTRUCTOR_BUN_TOP).should('not.contain', 'Краторная булка N-200i');
            cy.get(selectors.CONSTRUCTOR_BUN_BOTTOM).should('not.contain', 'Краторная булка N-200i');
            cy.get(selectors.CONSTRUCTOR_INGREDIENT).should('not.contain', 'Биокотлета из марсианской Магнолии');
            cy.get(selectors.CONSTRUCTOR_INGREDIENT).should('not.contain', 'Соус традиционный галактический');

            //Проверили наличие модпльного окна с номером заказа
            cy.get(selectors.MODAL).should('exist');
            cy.get(selectors.ORDER_NUMBER).should('contain', '12345')

            //Проверили клик по кнопке закрытия модального окна заказа
            cy.get(selectors.MODAL_CLOSE).click();
            cy.get(selectors.MODAL).should('not.exist');
        })
    })

    describe('Тест модальных окон', () => {
        beforeEach(() => {
            //Проверили, что модальное окно закрыто
            cy.get(selectors.MODAL).should('not.exist')
            //Нажали на ингридиент
            cy.get(selectors.INGREDIENT_BUN).first().click();
        })

        it('Открытие модального окна', () => {
            //Проверили, что модальное окно открывается после клика по ингредиенту
            cy.get(selectors.MODAL).should('exist');
            //Проверили, что у модального окна есть оверлей
            cy.get(selectors.MODAL_OVERLAY).should('exist');
            //Проверили, что правильно отображается заголовок модального окна
            cy.get(selectors.MODAL_TITLE).should('contain', 'Детали ингредиента');
            //Проверили наличие наименования ингредиента в модальном окне
            cy.get(selectors.MODAL).should('contain', 'Краторная булка N-200i');
            //Проверили наличие информации о количестве калорий в модальном окне ингредиента
            cy.get(selectors.MODAL).should('contain', 'Калории, ккал');
            cy.get(selectors.MODAL).should('contain', '420');
            //Проверили наличие информации о содержании белка в модальном окне ингредиента
            cy.get(selectors.MODAL).should('contain', 'Белки, г');
            cy.get(selectors.MODAL).should('contain', '80');
            //Проверили наличие информации о содержании жиров в модальном окне ингрединента
            cy.get(selectors.MODAL).should('contain', 'Жиры, г');
            cy.get(selectors.MODAL).should('contain', '24');
            //Проверили наличие информации о содержании углеводов в модальном окне ингредиента
            cy.get(selectors.MODAL).should('contain', 'Углеводы, г');
            cy.get(selectors.MODAL).should('contain', '53');
        })

        it('Закрытие модального окна по клику на кнопку', () => {
            //Проверили, что модальное окно открывается после клика по ингредиенту
            cy.get(selectors.MODAL).should('exist');
            //Проверили, что у модального окна есть кнопка закрытия
            cy.get(selectors.MODAL_CLOSE).should('exist');
            //Кликнули на кнопку закрытия
            cy.get(selectors.MODAL_CLOSE).click();
            //Проверили, что нет ни модального окна, на оверлея
            cy.get(selectors.MODAL).should('not.exist');
            cy.get(selectors.MODAL_OVERLAY).should('not.exist');
        })

        it('Закрытие модального окна по клику на оверлей', () => {
            //Проверили, что модальное окно открывается после клика по ингредиенту
            cy.get(selectors.MODAL).should('exist');
            //Проверили, что у модального окна есть оверлей
            cy.get(selectors.MODAL_OVERLAY).should('exist');
            //Кликнули на оверлей
            cy.get(selectors.MODAL_OVERLAY).click({ force: true });
            //Проверили, что нет ни модального окна, на оверлея
            cy.get(selectors.MODAL).should('not.exist');
            cy.get(selectors.MODAL_OVERLAY).should('not.exist');
        })
    })
})