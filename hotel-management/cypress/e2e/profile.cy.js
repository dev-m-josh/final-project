describe("Profile Page", () => {
    const mockUser = {
        userId: "user123",
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        contactPhone: "1234567890",
        address: "123 Main St",
        isAdmin: false,
        isVerified: true,
    };

    const mockToken = "fake-jwt-token";

    beforeEach(() => {
        window.localStorage.setItem("myUser", JSON.stringify(mockUser));
        window.localStorage.setItem("myToken", mockToken);
        cy.visit("/profile");
    });

    it("displays user profile data correctly", () => {
        cy.contains(`${mockUser.firstname} ${mockUser.lastname}`).should("exist");
        cy.contains(mockUser.email).should("exist");
        cy.contains(mockUser.contactPhone).should("exist");
        cy.contains(mockUser.address).should("exist");
        cy.contains("Customer").should("exist");
        cy.contains("Yes").should("exist"); // Verified
    });

    it("opens and closes edit modal", () => {
        cy.contains("Edit Profile").click();
        cy.get("input[name=firstName]").should("have.value", mockUser.firstname);
        cy.contains("Cancel").click();
        cy.get("input[name=firstName]").should("not.exist");
    });

    it("submits edit form with updated data", () => {
        cy.intercept("PUT", `**/users/update/${mockUser.userId}`, {
            statusCode: 200,
            body: { ...mockUser, firstname: "Jane" },
        }).as("updateUser");

        cy.contains("Edit Profile").click();
        cy.get("input[name=firstName]").clear().type("Jane");
        cy.contains("Save Changes").click();

        cy.wait("@updateUser").its("request.body.firstName").should("equal", "Jane");
    });

    it("opens and cancels delete modal", () => {
        cy.contains("Delete Account").click();
        cy.contains("Confirm Account Deletion").should("exist");
        cy.contains("Cancel").click();
        cy.contains("Confirm Account Deletion").should("not.exist");
    });

    it("deletes account on confirmation", () => {
        cy.intercept("DELETE", `**/users/delete/${mockUser.userId}`, {
            statusCode: 200,
            body: {},
        }).as("deleteUser");

        cy.contains("Delete Account").click();
        cy.contains("Confirm Delete").click();
        cy.wait("@deleteUser");
    });

    it("redirects to login if no token", () => {
        localStorage.clear();
        cy.visit("/profile");
        cy.contains("Login Required").should("exist");
        cy.contains("OK").click();
        cy.url().should("include", "/login");
    });
});
