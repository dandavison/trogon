/// <reference types="Cypress" />

describe("Game", () => {
  it("English family name autofills on entering scientific family name", () => {
    cy.visit("/sounds/L2697642");
    cy.contains("Family (scientific)");
    cy.get("#familySciField input").type("Columbidae");
    cy.contains("Family (English)");
    cy.get("#familyEnField input").should("have.text", "Pigeons and Doves");
  });
});
