'use strict';

document.addEventListener('DOMContentLoaded', function () {
    // Inputs y errores del formulario de contacto
    var form = document.getElementById('contact-form');
    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var subjectInput = document.getElementById('subject');
    var messageInput = document.getElementById('message');

    var nameError = document.getElementById('name-error');
    var emailError = document.getElementById('email-error');
    var messageError = document.getElementById('message-error');

    var nameRegex = /^[A-Za-z0-9\s]+$/;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(input, errorSpan, mensaje) {
        if (!input || !errorSpan) {
            return;
        }
        errorSpan.textContent = mensaje;
        errorSpan.classList.remove('hidden');
        input.classList.add('input-invalid');
    }

    function clearError(input, errorSpan) {
        if (!input || !errorSpan) {
            return;
        }
        errorSpan.classList.add('hidden');
        input.classList.remove('input-invalid');
    }

    function validateName() {
        var value;
        var trimmed;
        value = nameInput.value || '';
        trimmed = value.replace(/^\s+|\s+$/g, '');

        if (trimmed === '') {
            setError(nameInput, nameError, 'El nombre es obligatorio.');
            return false;
        }

        if (trimmed.length < 3) {
            setError(nameInput, nameError, 'El nombre debe tener al menos 3 caracteres.');
            return false;
        }

        if (!nameRegex.test(trimmed)) {
            setError(nameInput, nameError, 'Usa solo letras y numeros.');
            return false;
        }

        clearError(nameInput, nameError);
        return true;
    }

    function validateEmail() {
        var value;
        value = emailInput.value || '';
        value = value.replace(/^\s+|\s+$/g, '');

        if (value === '') {
            setError(emailInput, emailError, 'El correo es obligatorio.');
            return false;
        }

        if (!emailRegex.test(value)) {
            setError(emailInput, emailError, 'Ingresa un correo electronico valido.');
            return false;
        }

        clearError(emailInput, emailError);
        return true;
    }

    function validateMessage() {
        var value;
        value = messageInput.value || '';
        value = value.replace(/^\s+|\s+$/g, '');

        if (value.length <= 5) {
            setError(messageInput, messageError, 'El mensaje debe tener mas de 5 caracteres.');
            return false;
        }

        clearError(messageInput, messageError);
        return true;
    }

    function buildMailto() {
        var subject;
        var name;
        var email;
        var message;
        var body;
        var link;

        subject = (subjectInput.value || '').replace(/^\s+|\s+$/g, '');
        name = (nameInput.value || '').replace(/^\s+|\s+$/g, '');
        email = (emailInput.value || '').replace(/^\s+|\s+$/g, '');
        message = (messageInput.value || '').replace(/^\s+|\s+$/g, '');

        body = 'Nombre: ' + name + '\n';
        body += 'Email: ' + email + '\n\n';
        body += message;

        link = 'mailto:?subject=' + encodeURIComponent(subject || 'Consulta sobre Simon Says');
        link += '&body=' + encodeURIComponent(body);
        return link;
    }

    function onSubmit(event) {
        var okName;
        var okEmail;
        var okMessage;
        if (event && event.preventDefault) {
            event.preventDefault();
        }

        okName = validateName();
        okEmail = validateEmail();
        okMessage = validateMessage();

        if (!okName || !okEmail || !okMessage) {
            if (!okName) {
                nameInput.focus();
            } else if (!okEmail) {
                emailInput.focus();
            } else {
                messageInput.focus();
            }
            return;
        }

        window.location.href = buildMailto();
        form.reset();
        clearError(nameInput, nameError);
        clearError(emailInput, emailError);
        clearError(messageInput, messageError);
    }

    if (form) {
        form.addEventListener('submit', onSubmit);
    }
    if (nameInput) {
        nameInput.addEventListener('input', validateName);
    }
    if (emailInput) {
        emailInput.addEventListener('input', validateEmail);
    }
    if (messageInput) {
        messageInput.addEventListener('input', validateMessage);
    }
});
