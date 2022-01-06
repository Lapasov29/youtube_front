form.onsubmit = async event => {
	try {
		event.preventDefault()

		let user = {
			username: usernameInput.value,
			password: passwordInput.value,
		}
	
		const response = await request('/auth/login', 'POST', user)
		messageText.textContent = response.message
		messageText.style.color = 'green'
		window.localStorage.setItem('token', response.token)
        window.localStorage.setItem('userId', response.userId)
		window.location = '/admin'
		
	} catch(error) {
		messageText.textContent = error.message
	}
}