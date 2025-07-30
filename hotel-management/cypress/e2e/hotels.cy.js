describe("Hotels Page", () => {
    beforeEach(() => {
        cy.intercept("GET", "https://final-project-api-q0ob.onrender.com/hotels", { fixture: "hotels.json" }).as(
            "fetchHotels"
        );
        cy.visit("/hotels");
        cy.wait("@fetchHotels");
    });

    it("displays hotels correctly", () => {
        cy.get('[data-testid^="hotel-card-"]').should("exist");
    });

    it("should display hotels correctly", () => {
        cy.get("[data-testid^=hotel-card-]").should("have.length.greaterThan", 0);

        cy.fixture("hotels.json").then((hotels) => {
            hotels.forEach((hotel) => {
                cy.get(`[data-testid=hotel-name-${hotel.hotelId}]`).should("contain", hotel.name);
                cy.get(`[data-testid=hotel-rating-${hotel.hotelId}]`).should("contain", hotel.rating);
                cy.get(`[data-testid=hotel-location-${hotel.hotelId}]`).should("contain", hotel.location);
                cy.get(`[data-testid=hotel-phone-${hotel.hotelId}]`).should("contain", hotel.contactPhone);
            });
        });
    });

    it("should open hotel details popup with correct content", () => {
        cy.fixture("hotels.json").then((hotels) => {
            const hotel = hotels[0];

            cy.intercept("GET", `https://final-project-api-q0ob.onrender.com/hotels/details/${hotel.hotelId}`, hotel).as(
                "getHotelDetails"
            );
            cy.get(`[data-testid=view-details-${hotel.hotelId}]`).click();
            cy.wait("@getHotelDetails");

            cy.get("[data-testid=details-name]").should("contain", hotel.name);
            cy.get("[data-testid=details-location]").should("contain", hotel.location);
            cy.get("[data-testid=details-address]").should("contain", hotel.address);
            cy.get("[data-testid=details-phone]").should("contain", hotel.contactPhone);
            cy.get("[data-testid=details-category]").should("contain", hotel.category);
            cy.get("[data-testid=details-rating]").should("contain", hotel.rating);
            cy.get("[data-testid=details-hotel-id]").should("contain", hotel.hotelId);

            // Close modal
            cy.get("[data-testid=details-book-now]").should("exist");
        });
    });

    it("should start booking flow", () => {
        cy.fixture("hotels.json").then((hotels) => {
            const hotel = hotels[0];
            cy.get(`[data-testid=book-now-${hotel.hotelId}]`).click();

            });
    });

    it("should show loading state", () => {
        cy.intercept("GET", "https://final-project-api-q0ob.onrender.com/hotels", {
            delay: 1000,
            body: [],
        }).as("delayedHotels");
        cy.visit("/hotels");
        cy.get("[data-testid=loading-state]").should("exist");
        cy.wait("@delayedHotels");
    });

    it("should show error state and retry", () => {
        // 1. Fail the first request
        cy.intercept("GET", "**/hotels", { forceNetworkError: true }).as("errorHotels");

        // cy.visit("/hotels");

        // 2. Assert error message is visible
        cy.get(".text-red-600").should("contain", ""); // TODO: insert real error text here

        // 3. Prepare success response BEFORE retry is triggered
        cy.intercept("GET", "https://final-project-api-q0ob.onrender.com/hotels", {
            fixture: "hotels.json",
        }).as("fetchHotelsAfterRetry");

        // 4. Click "Try Again"
        cy.contains("Try Again").click();

        // 5. Wait for the retry request
        cy.wait("@fetchHotelsAfterRetry");

        // 6. Assert hotels load
        cy.get("[data-testid^=hotel-card-]").should("have.length.greaterThan", 0);
    });

});
