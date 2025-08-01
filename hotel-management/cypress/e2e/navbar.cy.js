describe("Navbar Component", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    context("Desktop View", () => {
        beforeEach(() => {
            cy.viewport(1280, 800); // simulate desktop
        });

        it("shows public links", () => {
            cy.get('[data-testid="home-desktop"]').should("exist");
            cy.get('[data-testid="about-desktop"]').should("exist");
            cy.get('[data-testid="hotels-desktop"]').should("exist");
        });

        it("shows login/register when logged out", () => {
            cy.get('[data-testid="login-desktop"]').should("exist");
            cy.get('[data-testid="register-desktop"]').should("exist");
        });

        it("shows dashboard/profile/logout when logged in", () => {
            window.localStorage.setItem("myToken", "mock-token");
            window.localStorage.setItem("myUser", JSON.stringify({ isAdmin: false }));
            cy.reload();

            cy.get('[data-testid="dashboard-desktop"]').should("exist");
            cy.get('[data-testid="profile-desktop"]').should("exist");
            cy.get('[data-testid="logout-desktop"]').should("exist");
        });

        it("shows admin link when user is admin", () => {
            window.localStorage.setItem("myToken", "mock-token");
            window.localStorage.setItem("myUser", JSON.stringify({ isAdmin: true }));
            cy.reload();

            cy.get('[data-testid="admin-desktop"]').should("exist");
        });

        it("logs out user", () => {
            window.localStorage.setItem("myToken", "mock-token");
            window.localStorage.setItem("myUser", JSON.stringify({ isAdmin: false }));
            cy.reload();

            cy.get('[data-testid="logout-desktop"]').click({ force: true });

            cy.url().should("include", "/login");
        });
    });

    context("Mobile View", () => {
        beforeEach(() => {
            cy.viewport("iphone-6");
        });

        it("toggles mobile menu", () => {
            cy.get('[data-testid="mobile-menu-toggle"]').click();
            cy.get('[data-testid="home-mobile"]').should("exist");
        });

        it("shows correct links for logged-out user", () => {
            cy.get('[data-testid="mobile-menu-toggle"]').click();

            cy.get('[data-testid="login-mobile"]').should("exist");
            cy.get('[data-testid="register-mobile"]').should("exist");
        });

        it("shows dashboard and logout when logged in", () => {
            window.localStorage.setItem("myToken", "mock-token");
            window.localStorage.setItem("myUser", JSON.stringify({ isAdmin: false }));
            cy.reload();

            cy.get('[data-testid="mobile-menu-toggle"]').click();

            cy.get('[data-testid="dashboard-mobile"]').should("exist");
            cy.get('[data-testid="logout-mobile"]').click({ force: true });

            cy.url().should("include", "/login");
        });

        it("shows admin link for admin users", () => {
            window.localStorage.setItem("myToken", "mock-token");
            window.localStorage.setItem("myUser", JSON.stringify({ isAdmin: true }));
            cy.reload();

            cy.get('[data-testid="mobile-menu-toggle"]').click();
            cy.get('[data-testid="admin-mobile"]').should("exist");
        });
    });
});
