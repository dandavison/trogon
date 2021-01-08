/// <reference types="Cypress" />

describe("Control panel", () => {
  it("Has a trip switch that makes a map marker appear", () => {
    cy.visit("http://localhost:8000");
    cy.contains("Show control panel").click();
    cy.contains("Trips").click();
    cy.get(".leaflet-marker-icon").should("not.exist");
    cy.contains("Araracuara Jan 2021").click();
    cy.get(".leaflet-marker-icon");
  });
  it("Has a show-all-sites switch that makes a map marker appear", () => {
    cy.visit("http://localhost:8000");
    cy.contains("Show control panel").click();
    cy.get(".leaflet-marker-icon").should("not.exist");
    cy.contains("Show all sites").click();
    cy.get(".leaflet-marker-icon")
      .first()
      .click();
    cy.contains("guide");
  });
  it("Has a show-all-hotspots switch that makes a map circle appear", () => {
    cy.visit("http://localhost:8000");
    cy.contains("Show control panel").click();
    cy.get(".leaflet-marker-icon").should("not.exist");
    cy.contains("Show eBird hotspots").click();
    cy.get(".leaflet-interactive")
      .last()
      .click();
    cy.contains("species");
  });
});
describe("Sites panel", () => {
  it("Highlights a visible site", () => {
    cy.visit("http://localhost:8000");
    // Display some sites and check not highlighted
    cy.contains("Show control panel").click();
    cy.contains("Show all sites").click();
    cy.get(".leaflet-marker-icon").last().click();

    cy.contains("Show site list").click();
    cy.contains("Moroco");
    cy.get("path.leaflet-interactive").should("not.exist"); // no site is highlighted
    cy.get("section.site-card")
      .first()
      .trigger("mouseover");
    cy.get("path.leaflet-interactive"); // a site is highlighted
  });
  it("Does not highlight invisible sites", () => {
    cy.visit("http://localhost:8000");
    cy.get(".leaflet-marker-icon").should("not.exist"); // no sites visible on map
    cy.contains("Show site list").click();
    cy.contains("Moroco");
    cy.get("path.leaflet-interactive").should("not.exist"); // no site highlights
    cy.get("section.site-card")
      .first()
      .trigger("mouseover");
    cy.get("section.site-card")
      .first()
      .trigger("mouseleave");
    cy.get("path.leaflet-interactive").should("not.exist");
  });
});
