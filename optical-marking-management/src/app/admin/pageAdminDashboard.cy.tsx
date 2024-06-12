import React from "react";
import AdminDashboard from "./page";

describe("<AdminDashboard />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AdminDashboard />);
  });
});
