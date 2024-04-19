const registerForm = document.querySelector("#registerForm");
registerForm.addEventListener("submit", (e) => {
	e.preventDefault();

	// get user info
	const email = registerForm["registerEmail"].value;
	const password = registerForm["registerPassword"].value;

	console.log(email, password);

	// register user
});
