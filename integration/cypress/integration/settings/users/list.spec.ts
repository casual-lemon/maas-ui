import { makeUIURL, login } from "../../utils";

context("User list", () => {
  beforeEach(() => {
    login();
    cy.setCookie("skipintro", "true");
    cy.visit(makeUIURL("/settings/users"));
  });

  afterEach(() => {
    cy.clearCookie("skipintro");
  });

  it("the side nav highlights correctly", () => {
    const navItem = ".p-side-navigation__link.is-active";
    cy.get(navItem).should("exist");
    cy.get(navItem).contains("Users");
  });
});
