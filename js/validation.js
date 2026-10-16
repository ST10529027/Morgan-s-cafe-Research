/*
 * Morgan's Café
 * WEDE5020 - Formative Part 3
 * Form Validation
 *
 * Morgan's Café - Form Validation
 * Client-side form validation and user feedback.
 * Reference: MDN Web Docs (n.d.), Client-side form validation.
 */

document.addEventListener("DOMContentLoaded", function () {

    // -----------------------------------------
    // ENQUIRY FORM VALIDATION
    // -----------------------------------------

    const enquiryForm = document.getElementById("enquiryForm");

    if (enquiryForm) {
        enquiryForm.addEventListener("submit", function (event) {

            const name = enquiryForm.querySelector('[name="name"]');
            const email = enquiryForm.querySelector('[name="email"]');
            const message = enquiryForm.querySelector('[name="message"]');

            if (!name || !email || !message) {
                event.preventDefault();
                alert("The enquiry form is missing a required field.");
                return;
            }

            if (
                name.value.trim() === "" ||
                email.value.trim() === "" ||
                message.value.trim() === ""
            ) {
                event.preventDefault();
                alert("Please complete your name, email address and enquiry.");
                return;
            }

            if (!email.validity.valid) {
                event.preventDefault();
                alert("Please enter a valid email address.");
                email.focus();
                return;
            }

            event.preventDefault();

            alert(
                "Your enquiry has passed validation. " +
                "Thank you for contacting Morgan's Café."
            );
        });
    }

    // -----------------------------------------
    // CONTACT FORM VALIDATION
    // -----------------------------------------

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {

            const name = contactForm.querySelector('[name="name"]');
            const email = contactForm.querySelector('[name="email"]');
            const message = contactForm.querySelector('[name="message"]');

            if (!name || !email || !message) {
                event.preventDefault();
                alert("The contact form is missing a required field.");
                return;
            }

            if (
                name.value.trim() === "" ||
                email.value.trim() === "" ||
                message.value.trim() === ""
            ) {
                event.preventDefault();
                alert(
                    "Please complete your name, email address and message."
                );
                return;
            }

            if (!email.validity.valid) {
                event.preventDefault();
                alert("Please enter a valid email address.");
                email.focus();
                return;
            }

            event.preventDefault();

            alert(
                "Your contact form has passed validation. " +
                "Your message has not been emailed yet."
            );
        });
    }

});

