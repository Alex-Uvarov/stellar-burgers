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
    ORDER_NUMBER: '[data-cy="order-number"]'
}

describe('Конструктор', () => {
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

    it('Отображение категорий ингредиентов', () => {

        cy.get(selectors.INGREDIENT_CLASS).should('have.length', 3);
    
        cy.contains('Булки').should('exist');
        cy.contains('Начинки').should('exist');
        cy.contains('Соусы').should('exist');
      });

    describe('Добавление ингредиента в конструктор', () => {
        it('Добавление булки', () => {
            cy.get(selectors.INGREDIENT_BUN).first().contains('Добавить').click();
    
            cy.get(selectors.CONSTRUCTOR_BUN_TOP).should('exist');
            cy.get(selectors.CONSTRUCTOR_BUN_BOTTOM).should('exist');
        });

        it('Добавление основной начинки', () => {
            cy.get(selectors.INGREDIENT_BUN).first().contains('Добавить').click();
            cy.get(selectors.INGREDIENT_MAIN).first().contains('Добавить').click();

            cy.get(selectors.CONSTRUCTOR_INGREDIENT).should('exist')
        })

        it('Добавление соуса', () => {
            cy.get(selectors.INGREDIENT_BUN).first().contains('Добавить').click();
            cy.get(selectors.INGREDIENT_MAIN).first().contains('Добавить').click();
            cy.get(selectors.INGREDIENT_SAUCE).first().contains('Добавить').click();

            cy.get(selectors.CONSTRUCTOR_INGREDIENT).should('contain', 'Соус')
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

        it('Жизенный цикл заказа', () => {

            cy.get(selectors.INGREDIENT_BUN).first().contains('Добавить').click();
            cy.get(selectors.INGREDIENT_MAIN).first().contains('Добавить').click();
            cy.get(selectors.INGREDIENT_SAUCE).first().contains('Добавить').click();

            cy.get(selectors.ORDER_BUTTON).click();
            cy.intercept('POST', 'api/orders', {fixture: 'order.json'});

            cy.get(selectors.ORDER_LOADING_MODAL).should('exist');
            cy.get(selectors.ORDER_LOADING_MODAL).should('not.exist');

            cy.get(selectors.MODAL).should('exist');
            cy.get(selectors.ORDER_NUMBER).should('contain', '12345')

            cy.get(selectors.MODAL_CLOSE).click();
            cy.get(selectors.MODAL).should('not.exist');

            cy.get(selectors.CONSTRUCTOR_BUN_BOTTOM).should('not.exist');
            cy.get(selectors.CONSTRUCTOR_BUN_TOP).should('not.exist');
            cy.get(selectors.CONSTRUCTOR_INGREDIENT_ELEMENT).should('not.exist');
        })
    })

    describe('Тест модальных окон', () => {
        beforeEach(() => {
            cy.get(selectors.INGREDIENT_CLASS).first().click();
        })

        it('Открытие модального окна', () => {
            cy.get(selectors.MODAL).should('exist');
            cy.get(selectors.MODAL_OVERLAY).should('exist');
            cy.get(selectors.MODAL_TITLE).should('contain', 'Детали ингредиента');

        })

        it('Закрытие модального окна по клику на кнопку', () => {
            cy.get(selectors.MODAL_CLOSE).click();
            cy.get(selectors.MODAL).should('not.exist');
            cy.get(selectors.MODAL_OVERLAY).should('not.exist');
        })

        it('Закрытие модального окна по клику на оверлей', () => {
            cy.get(selectors.MODAL_OVERLAY).click({ force: true });
            cy.get(selectors.MODAL).should('not.exist');
            cy.get(selectors.MODAL_OVERLAY).should('not.exist');
        })
    })
})