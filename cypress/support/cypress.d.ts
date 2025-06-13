import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      userAuthorization(): Chainable<void>;
    }
  }
}