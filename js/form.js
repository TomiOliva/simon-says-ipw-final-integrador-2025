'use strict';
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");

    const nombreInput = document.getElementById("nombre");
    const emailInput = document.getElementById("email");
    const mensajeInput = document.getElementById("mensaje");

    const nombreError = document.getElementById("nombre-error");
    const emailError = document.getElementById("email-error");
    const mensajeError = document.getElementById("mensaje-error");

    // Nombre alfanumérico (letras, números, espacios)
    const nombreRegex = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9\s]+$/;
    // Mail válido básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(input, errorSpan, mensaje) {
        errorSpan.textContent = mensaje;
        errorSpan.classList.remove("hidden");
        input.classList.add("input-invalid");
    }

    function clearError(input, errorSpan) {
        errorSpan.classList.add("hidden");
        input.classList.remove("input-invalid");
    }

    function validarNombre() {
        const valor = nombreInput.value.trim();

        if (valor === "") {
            setError(nombreInput, nombreError, "El nombre es obligatorio.");
            return false;
        }

        if (!nombreRegex.test(valor)) {
            setError(
                nombreInput,
                nombreError,
                "El nombre debe ser alfanumérico (letras y números)."
            );
            return false;
        }

        clearError(nombreInput, nombreError);
        return true;
    }

    function validarEmail() {
        const valor = emailInput.value.trim();

        if (valor === "") {
            setError(emailInput, emailError, "El correo es obligatorio.");
            return false;
        }

        if (!emailRegex.test(valor)) {
            setError(emailInput, emailError, "Ingresá un correo electrónico válido.");
            return false;
        }

        clearError(emailInput, emailError);
        return true;
    }

    function validarMensaje() {
        const valor = mensajeInput.value.trim();

        if (valor.length <= 5) {
            setError(
                mensajeInput,
                mensajeError,
                "El mensaje debe tener más de 5 caracteres."
            );
            return false;
        }

        clearError(mensajeInput, mensajeError);
        return true;
    }

    // Validación en vivo
    nombreInput.addEventListener("input", validarNombre);
    emailInput.addEventListener("input", validarEmail);
    mensajeInput.addEventListener("input", validarMensaje);

    // Validación al enviar
    form.addEventListener("submit", (e) => {
        const okNombre = validarNombre();
        const okEmail = validarEmail();
        const okMensaje = validarMensaje();

        if (!okNombre || !okEmail || !okMensaje) {
            e.preventDefault();

            // foco en el primer error
            if (!okNombre) {
                nombreInput.focus();
            } else if (!okEmail) {
                emailInput.focus();
            } else {
                mensajeInput.focus();
            }
        } else {

        }
    });
});
