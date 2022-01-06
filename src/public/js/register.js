form.onsubmit = async event => {
    try {
        event.preventDefault()
        
        let formData = new FormData()
        
        formData.append('file', uploadInput.files[0])
        formData.append('username', usernameInput.value)
        formData.append('password', passwordInput.value)
        
        const response = await request('/auth/register', 'POST', formData)

        usernameInput.value = null
        passwordInput.value = null

        messageText.textContent = response.message
        messageText.style.color = 'green'
        window.localStorage.setItem('token', response.token)
        window.localStorage.setItem('userId', response.userId)
        window.location = '/admin'
        
    } catch(error) {
        messageText.textContent = error.message
    }
}