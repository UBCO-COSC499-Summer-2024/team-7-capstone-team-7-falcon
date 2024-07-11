import React from "react";
import AdminDashboard from "./page";
import { mount } from "@cypress/react";

describe("<AdminDashboard />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AdminDashboard />);
    cy.contains("Number of Courses"); // Check if the "Number of Courses" text is rendered
  });
});
