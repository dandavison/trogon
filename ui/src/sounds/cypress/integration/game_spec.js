/// <reference types="Cypress" />

describe("Form field behaviour", () => {
  before(() => {
    cy.visit("/sounds/challenge?location=L5845383");
    cy.contains("Start").click();
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

  it("Location info is displayed", () => {
    cy.contains("Cerro Pinturas");
  });

  it("Scientific family autocomplete works", () => {
    cy.contains("Tinamidae").should("not.be.visible");
    cy.contains("Anatidae").should("not.be.visible");
    cy.contains("Cracidae").should("not.be.visible");
    cy.get("#familySciField input").type("{uparrow}");
    cy.contains("Tinamidae").should("be.visible");
    cy.contains("Anatidae").should("be.visible");
    cy.contains("Cracidae").should("be.visible");
    cy.get("#familySciField input").type("T");
    cy.contains("Tinamidae").should("be.visible");
    // TODO: make the same assertion of non-visibility in all cases,
    // remaining agnostic about whether it's in the DOM or not.
    cy.contains("Anatidae").should("not.exist");
    cy.contains("Cracidae").should("not.exist");
  });

  it("English species name autocomplete works", () => {
    const tinamou = "Undulated Tinamou";
    const tanager = "Flame-crested Tanager";
    cy.contains(tinamou).should("not.be.visible");
    cy.contains(tanager).should("not.be.visible");
    cy.get("#speciesEnField input").type("{uparrow}");
    cy.contains(tinamou).should("be.visible");
    cy.contains(tanager).should("not.be.visible");
    cy.contains("Clear").click();
    cy.get("#speciesEnField input").type("Tan");
    // TODO: make the same assertion of non-visibility in all cases,
    // remaining agnostic about whether it's in the DOM or not.
    cy.contains(tinamou).should("not.exist");
    cy.contains(tanager).should("be.visible");
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

  it("English species name autocomplete is filtered when genus filled out", () => {
    cy.get("#genusField input").type("Psarocolius");
    cy.get("#speciesEnField input").type("{uparrow}");
    cy.contains("Russet-backed Oropendola").should("be.visible");
    cy.get("#speciesEnField input").type("Russet");
    cy.contains("Russet-backed Oropendola").should("be.visible");
  });
});
