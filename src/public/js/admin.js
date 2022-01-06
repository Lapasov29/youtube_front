//cheking the token of user
;(async () => {

	let token = window.localStorage.getItem('token')
	if(token) {
		try {
			await request('/users')
		} catch(error) {x
			window.localStorage.removeItem('token')
			window.localStorage.removeItem('userId')
			window.location = '/login'
		}
	} 
	else {
		window.location = '/login'
	}
})();

// uploading a video
form.onsubmit = async event => {
	try {
		event.preventDefault()
		
		let formData = new FormData()

		let currentdate = new Date();
		
		let datetime = currentdate.getFullYear() + '-' +(currentdate.getMonth()+1) + '-' + currentdate.getDate()
		let time = currentdate.getHours() + ":" + currentdate.getMinutes()
		
		formData.append('file', uploadInput.files[0])
		formData.append('title', videoInput.value)
		formData.append('date', datetime)
		formData.append('time', time)
		
		const response = await request('/videos', 'POST', formData)
		
		videoInput.value = null

		renderVideo()
		
	} catch(error) {
		messageText.textContent = error.message
	}
}

// rendering videos
async function renderVideo(){
	const userId = window.localStorage.getItem('userId')
	const response = await request(`/videos?userId=${userId}`)
    let li = ``
	if(response.length != 0){
		for(let video of response){
			li += `
			<li class="video-item">
				<video src="${backendApi+ '/' + video.videoUrl}" controls=" "></video>
				<p class="content" id="${video.videoId}" contenteditable="true">${video.videoTitle}</p>
				<img src="/img/delete.png" width="25px" alt="upload" class="delete-icon" id="${video.videoId}">
			</li>
			`
			videos_list.innerHTML = li
		}
	}else{
		li = "<span>No videos yet!</span>"
		videos_list.innerHTML = null
        videos_list.innerHTML = li
	}
}

renderVideo()

// updating a video
videos_list.onclick = async(event) => {
	if(event.target.nodeName == 'P'){
		let span= event.target
		span.onkeyup = async(event) => {
			if(event.keyCode === 13){
				let body = {
					videoId: span.id,
					videoTitle: span.textContent
				}

				let req = await request('/videos', 'PUT', body)
				if(req.status == 201 || req.status == 200) renderVideo()
			}
		}
	}else if(event.target.nodeName == 'IMG'){
		let body = {
			videoId: event.target.id
		}
		let req = await request('/videos', 'DELETE', body)
		if(req.status == 201 || req.status == 200) renderVideo()
	}
}