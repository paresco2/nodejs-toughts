const form = document.getElementById("formregister");
const nameInput = document.getElementById("name");
const nameValue = nameInput.value.trim();
const emailInput = document.getElementById("email");
const emailValue = emailInput.value.trim();
const passwordIput = document.getElementById("password");
const passwordValue = passwordIput.value.trim();
const confirmPasswordInput = document.getElementById("confirmpassword");
const confirmPasswordValue = confirmPasswordInput.value.trim();
form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (nameValue === "") {
    //alert("Nome precisa ser preenchido");
    errorInput(nameInput, "Preencha esse campo por favor");
    nameInput.focus();
    return;
  }
  if (emailValue === "") {
    alert("Email precisa ser preenchido");
    emailInput.focus();
    return;
  }
  if (passwordValue === "") {
    alert("Senha precisa ser preenchido");
    passwordIput.focus();
    return;
  }
  if (passwordValue != confirmPasswordValue) {
    alert("As senhas precisam ser iguais");
    confirmPasswordInput.value = "";
    confirmPasswordInput.focus();

    return;
  }

  form.submit();
});

function errorInput(input, message) {
  const formItem = input.parentElement;
  const textMessage = formItem.querySelector("a");
  textMessage.innerText = message;
  formItem.className = "form-control error";
}
