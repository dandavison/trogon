/// <reference types="Cypress" />

describe("Form field autofill behaviour", () => {
  before(() => {
    cy.visit("/sounds/challenge?location=L5845383");
    cy.contains("Family (scientific)");
    cy.contains("Family (English)");
    cy.contains("Genus");
    cy.contains("Species (scientific)");
    cy.contains("Species (English)");
    cy.get("input").should("have.value", "");
  });

  afterEach(() => {
    cy.contains("Clear").click();
    cy.get("input").should("have.value", "");
  });

  it("English family autofills on entering scientific family", () => {
    cy.get("#familySciField input").type("Columbidae");
    cy.get("#familyEnField input").should("have.value", "Pigeons and Doves");
  });

  it("Scientific family autofills on entering english family", () => {
    cy.get("#familyEnField input").type("Pigeons and Doves");
    cy.get("#familySciField input").should("have.value", "Columbidae");
  });

  it("Family names autofill on entering genus", () => {
    cy.get("#genusField input").type("Patagioenas");
    cy.get("#familySciField input").should("have.value", "Columbidae");
    cy.get("#familyEnField input").should("have.value", "Pigeons and Doves");
  });

  it("Family, genus and English species autofill on entering scientific species", () => {
    cy.get("#speciesSciField input").type("Patagioenas subvinacea");
    cy.get("#familySciField input").should("have.value", "Columbidae");
    cy.get("#familyEnField input").should("have.value", "Pigeons and Doves");
    cy.get("#speciesEnField input").should("have.value", "Ruddy Pigeon");
  });

  it("Family, genus and scientific species autofill on entering English species", () => {
    cy.get("#speciesEnField input").type("Ruddy Pigeon");
    cy.get("#familySciField input").should("have.value", "Columbidae");
    cy.get("#familyEnField input").should("have.value", "Pigeons and Doves");
    cy.get("#speciesSciField input").should(
      "have.value",
      "Patagioenas subvinacea"
    );
  });
});
