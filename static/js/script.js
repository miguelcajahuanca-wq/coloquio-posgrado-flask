document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const yearSpan = document.getElementById("year");
    const form = document.getElementById("proposal-form");
    const successMessage = document.getElementById("form-success");

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Navegación responsive
    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("nav-open");
        });

        navLinks.querySelectorAll("a").forEach(a => {
            a.addEventListener("click", () => {
                navLinks.classList.remove("nav-open");
            });
        });
    }

    function showError(fieldName, message) {
        const errorElement = document.querySelector(`.form-error[data-for="${fieldName}"]`);
        if (errorElement) {
            errorElement.textContent = message || "";
        }
    }

    function clearErrors() {
        document.querySelectorAll(".form-error").forEach(el => {
            el.textContent = "";
        });
    }

    function validateForm(form) {
        clearErrors();
        let valid = true;

        const requiredFields = [
            "nombre",
            "email",
            "programa",
            "institucion",
            "idioma",
            "titulo",
            "resumen",
        ];

        requiredFields.forEach(name => {
            const field = form.elements[name];
            if (!field) return;
            if (!field.value || !field.value.trim()) {
                showError(name, "Este campo es obligatorio.");
                valid = false;
            }
        });

        const consentimiento = form.elements["consentimiento"];
        if (consentimiento && !consentimiento.checked) {
            showError("consentimiento", "Debes aceptar el uso de tus datos para continuar.");
            valid = false;
        }

        const email = form.elements["email"];
        if (email && email.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                showError("email", "Por favor ingresa un correo válido.");
                valid = false;
            }
        }

        return valid;
    }

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (!validateForm(form)) {
                return;
            }

            const formData = new FormData(form);
            const proposal = {};
            formData.forEach((value, key) => {
                proposal[key] = value.trim();
            });

            try {
                const response = await fetch("/api/propuestas", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(proposal),
                });

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    const msg = data.error || "Hubo un problema al enviar la propuesta. Intenta nuevamente.";
                    alert(msg);
                    return;
                }

                if (successMessage) {
                    successMessage.hidden = false;
                }
                form.reset();
                clearErrors();
            } catch (error) {
                console.error("Error enviando propuesta:", error);
                alert("No se pudo contactar con el servidor. Verifica tu conexión o intenta más tarde.");
            }
        });
    }
});
/* ============================================
   SLIDER DE IMÁGENES LADO DERECHO
============================================ */

document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".hero-slide");
    let index = 0;

    function nextSlide() {
        slides[index].classList.remove("active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("active");
    }

    setInterval(nextSlide, 4500);
});


