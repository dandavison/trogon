/// <reference types="Cypress" />

describe("Game", () => {
  it("English family name autofills on entering scientific family name", () => {
    cy.visit("/sounds/challenge?location=L5845383");
    cy.contains("Family (scientific)");
    cy.contains("Family (English)");
    cy.get("#familyEnField input").should(
      "not.have.value",
      "Pigeons and Doves"
    );
    cy.get("#familySciField input").type("Columbidae");
    cy.get("#familyEnField input").should("have.value", "Pigeons and Doves");
  });
});
