describe("Login Form Tests", () => {
    beforeEach(() => {
        cy.visit("/login");
    });

    it("should login with valid credentials", () => {
        // Assert login page is visible
        cy.contains("Welcome back").should("be.visible");

        // Fill email input
        cy.get('input[type="email"]')
            .should("exist")
            .type("mutambukijoshua2@gmail.com");

        // Fill password input
        cy.get('input[type="password"], input[type="text"]').then(($input) => {
            const type = $input.attr("type");
            expect(["password", "text"]).to.include(type); // password or revealed text
        });

        cy.get('input[id="password"]').type("joshuapeter");

        // Click submit button
        cy.get('button[type="submit"]').contains("Sign In").should("be.visible").and("not.be.disabled").click();

        // Wait for navigation
        // cy.url().should("include", "/hotels");
    });

  it("should not login with invalid credentials", () => {
      cy.contains("Welcome back").should("be.visible");

      // Enter valid email but wrong password
      cy.get('input[type="email"]').type("mutambukijoshua2@gmail.com");
      cy.get('input[id="password"]').type("wrongpassword123");

      // Submit
      cy.get('button[type="submit"]').contains("Sign In").click();

      // Check for visible error
      cy.get(".text-red-600")
          .should("be.visible")
          .invoke("text")
          .should("match", /invalid|failed|wrong|unexpected/i);
  });
});