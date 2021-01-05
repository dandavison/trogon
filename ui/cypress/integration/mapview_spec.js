/// <reference types="Cypress" />

describe("Control panel", () => {
  it("Has a trip switch that makes a map marker appear", () => {
    cy.visit("http://localhost:8000/map");
    cy.contains("Open control panel").click();
    cy.contains("Trips").click();
    cy.get(".leaflet-marker-icon").should("not.exist");
    cy.contains("Araracuara Jan 2021").click();
    cy.get(".leaflet-marker-icon");
  });
  it("Has a show-all-sites switch that makes a map marker appear", () => {
    cy.visit("http://localhost:8000/map");
    cy.contains("Open control panel").click();
    cy.get(".leaflet-marker-icon").should("not.exist");
    cy.contains("Show all sites").click();
    cy.get(".leaflet-marker-icon")
      .first()
      .click();
    cy.contains("guide");
  });
  it("Has a show-all-hotspots switch that makes a map circle appear", () => {
    cy.visit("http://localhost:8000/map");
    cy.contains("Open control panel").click();
    cy.get(".leaflet-marker-icon").should("not.exist");
    cy.contains("Show eBird hotspots").click();
    cy.get(".leaflet-interactive")
      .last()
      .click();
    cy.contains("species");
  });
});
