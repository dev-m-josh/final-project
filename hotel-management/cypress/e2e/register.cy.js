describe("User Registration and Verification", () => {
    beforeEach(() => {
        cy.visit("/register");
    });

    it("should show error for invalid email", () => {
        cy.get("#firstName").type("John");
        cy.get("#lastName").type("Doe");
        cy.get("#phoneNumber").type("0712345678");
        cy.get("#email").type("invalid-email");
        cy.get("#address").type("Kigali");
        cy.get("#password").type("password123");
        cy.get("#confirmPassword").type("password123");

        cy.get('button[type="submit"]').click();

    });

    it("should show error for invalid phone number", () => {
        cy.get("#firstName").type("John");
        cy.get("#lastName").type("Doe");
        cy.get("#phoneNumber").type("123456");
        cy.get("#email").type("john@example.com");
        cy.get("#address").type("Kigali");
        cy.get("#password").type("password123");
        cy.get("#confirmPassword").type("password123");

        cy.get('button[type="submit"]').click();

        cy.get(".text-red-600").should("be.visible").and("contain", "Invalid phone number");
    });

    it("should show error for mismatched passwords", () => {
        cy.get("#firstName").type("John");
        cy.get("#lastName").type("Doe");
        cy.get("#phoneNumber").type("0712345678");
        cy.get("#email").type("john@example.com");
        cy.get("#address").type("Kigali");
        cy.get("#password").type("password123");
        cy.get("#confirmPassword").type("differentPass");

        cy.get('button[type="submit"]').click();

        cy.get(".text-red-600").should("be.visible").and("contain", "Passwords do not match");
    });

    it("should successfully register and show verification form", () => {
        const randomEmail = `user${Date.now()}@test.com`;

        cy.get("#firstName").type("John");
        cy.get("#lastName").type("Doe");
        cy.get("#phoneNumber").type("0712345678");
        cy.get("#email").type(randomEmail);
        cy.get("#address").type("Kigali");
        cy.get("#password").type("password123");
        cy.get("#confirmPassword").type("password123");

        cy.intercept("POST", "**/auth/register").as("registerRequest");

        cy.get('button[type="submit"]').click();

        cy.wait("@registerRequest").its("response.statusCode").should("eq", 201);

        // After success, verification form should be shown
        cy.contains("Enter Verification Code").should("be.visible");
        cy.get("#verificationCode").should("exist");
    });

    it("should show error for invalid verification code", () => {
        const testEmail = `user${Date.now()}@test.com`;

        // Register first
        cy.get("#firstName").type("Jane");
        cy.get("#lastName").type("Doe");
        cy.get("#phoneNumber").type("0712345678");
        cy.get("#email").type(testEmail);
        cy.get("#address").type("Kigali");
        cy.get("#password").type("password123");
        cy.get("#confirmPassword").type("password123");

        cy.intercept("POST", "**/auth/register").as("registerRequest");

        cy.get('button[type="submit"]').click();

        cy.wait("@registerRequest").its("response.statusCode").should("eq", 201);

        cy.contains("Enter Verification Code").should("be.visible");

        // Try verifying with invalid code
        cy.get("#verificationCode").type("000000");

        cy.intercept("POST", "**/auth/verify").as("verifyRequest");

        cy.get('button[type="submit"]').contains("Verify").click();

        cy.wait("@verifyRequest");

        cy.get(".text-red-600").should("be.visible").and("contain", "Invalid verification code");
    });
});
