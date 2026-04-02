Feature: AdFinity Login Page

    Scenario: Verify user can login
        Given I visit the login page
        When I enter email "test@test.com"
        And I select organisation "Organisation A"
        And I submit the login form
        Then I am redirected to the home page

    Scenario: Verify user cannot login if form is invalid
        Given I visit the login page
        When I enter email "test@test.com"
        And I submit the login form
        Then An error is displayed
