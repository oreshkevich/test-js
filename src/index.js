import './main.scss';
import IMask from 'imask';
let phoneInput = document.querySelector('.phone');
let btn = document.querySelector('.feedback__button');
const phoneMask = new IMask(phoneInput, {
  mask: '+{7}(000)000-00-00',
});

phoneInput.addEventListener('input', phoneInputHandler);

const firstName = document.getElementById('name');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const textarea = document.getElementById('textarea');
const form = document.querySelector('.feedback__form');
const feedbackErrorName = document.querySelector('.feedback__error_name');
const feedbackErrorEmail = document.querySelector('.feedback__error_email');
const feedbackErrorPhone = document.querySelector('.feedback__error_phone');
const feedbackErrorText = document.querySelector('.feedback__error_text');
const feedbackSuccess = document.querySelector('.feedback__success');
const feedbackErrorServer = document.querySelector('.feedback__error_server');
const button = document.getElementById('button');
const validateName = (name) => {
  let regularExpressionName = /^(?:[a-zA-Z\s]{3,10})|(?:[а-яА-Я\s]{3,10})$/;
  return regularExpressionName.test(name);
};

function validateEmail(email) {
  let regularExpressionEmail =
    /^([a-zA-Z][a-zA-Z0-9-_]{2,15})*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regularExpressionEmail.test(email);
}
function validateTextarea(textarea) {
  return textarea.length > 5;
}

textarea?.addEventListener('input', () => {
  handleValidate(
    validateTextarea(form.textarea.value),
    textarea,
    feedbackErrorText
  );
  handleButtonDisabled();
});

firstName?.addEventListener('input', () => {
  handleValidate(validateName(form.name.value), firstName, feedbackErrorName);
  handleButtonDisabled();
});

email?.addEventListener('input', () => {
  handleValidate(validateEmail(form.email.value), email, feedbackErrorEmail);
  handleButtonDisabled();
});

function handleValidate(checkValidate, nameInput, nameValueText) {
  if (!checkValidate) {
    nameInput.style.border = '1px solid red';
    nameInput.style.color = 'red';
    nameValueText.classList.add('active');
  } else {
    nameInput.style.border = '';
    nameInput.style.color = 'black';
    nameValueText.classList.remove('active');
  }
}

function phoneInputHandler() {
  handleValidate(phoneMask.masked.isComplete, phone, feedbackErrorPhone);
}

function handleButtonDisabled() {
  if (
    validateName(form.name.value) &&
    validateEmail(form.email.value) &&
    validateTextarea(form.textarea.value)
  ) {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
}

const formUrl = 'http://localhost:9090/api/registration';

form?.addEventListener('submit', (event) => {
  const formData = {};
  event.preventDefault();

  for (let {name, value} of form.elements) {
    if (name) {
      formData[name] = value;
    }
  }

  fetch(formUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.status === 'success') {
        feedbackSuccess.classList.add('active');
        feedbackSuccess.innerText = data.message;
        form.reset();
        button.disabled = true;
        setTimeout(() => feedbackSuccess.classList.remove('active'), 2000);
      } else {
        let errorServer = data.fields;
        let inputNameError = errorServer?.inputName;
        if (inputNameError) {
          nameInput.style.border = '1px solid red';
          nameValueText.innerText = inputNameError;
        }
        throw new Error(data.message);
      }
    })
    .catch((error) => {
      feedbackErrorServer.classList.add('active');
      feedbackErrorServer.innerText = error.message;
      setTimeout(() => feedbackErrorServer.classList.remove('active'), 2000);
    });
});

const body = document.querySelector('.body');
const modalBtn = document.querySelector('.more');
const modal = document.querySelector('.feedback-modal__overlay');
modalBtn?.addEventListener('click', () => {
  modal.classList.remove('hidden');
  body.classList.add('overflow');
});

modal?.addEventListener('click', (event) => {
  const target = event.target;
  if (
    target.classList.contains('feedback-modal__overlay') ||
    target.classList.contains('feedback-modal__close')
  ) {
    modal.classList.add('hidden');
    body.classList.remove('overflow');
  }
});
