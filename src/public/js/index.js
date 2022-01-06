// rendering users
async function renderUsers () {
	const users = await request('/users')
    let token = window.localStorage.getItem('token')
    let li = `
    <li class="channel active" data_id="main", id='${0}'>
        <a href="/" id = "${0}>
            <svg viewbox="0 0 24 24" focusable="false" style="pointer-events: none; display: block; width: 30px; height: 30px;"><g><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8" class="style-scope yt-icon"></path></g></svg>
            <span>Home</span>
        </a>
    </li>
    `
    for(let user of users){
        li += `
        <li class="channel" id="${user.userId}">
            <a href="#" id = "${user.userId}">
            <img src="${backendApi + user.imageUrl}" id = "${user.userId}" alt="channel-icon" width="30px" height="30px">
            <span id = "${user.userId}">${user.username}</span>
            </a>
        </li>
        `
        users_place.innerHTML = li


    }
    const res = await request('/checkToken')
    if(res.message === "Ok") {
        const userId = window.localStorage.getItem('userId')
		pro_pic.src = backendApi + users[userId-1].imageUrl
	}
}

renderUsers()

// admin page
account_2.onclick = () => {
    window.location.href = "/admin"
}

// clicking one user
users_place.onclick = (event) => {
    renderVideo(event.target.id)
}

// rendering one user's video 
async function renderVideo(param){
    const response = await request(`/videos?userId=${param}`)
    const users = await request(`/users`)
    let temp = users.find(user => user.userId == param)
    if(+response != 0){
        let li = ''
        for(let i of response){
            li += `
            <li class="iframe">
                <video src="${backendApi+ '/' + i.videoUrl}" controls=" "></video>
                <div class="iframe-footer">
                    <img src="${backendApi + temp.imageUrl}" alt="channel-icon">
                    <div class="iframe-footer-text">
                        <h2 class="channel-name">${temp.username}</h2>
                        <h3 class="iframe-title">${i.videoTitle}</h3>
                        <time class="uploaded-time">${i.uploadedDate} | ${i.uploadedTime}</time>
                        <a class="download" href="${backendApi + '/download/' + i.videoUrl}">
                            <span>${i.size} MB</span>
                            <img src="/img/download.png">
                        </a>
                    </div>                  
                </div>
            </li>  
            `
        }
        iframes_list.innerHTML = null
        iframes_list.innerHTML = li
    }else if(param == 0){
        allVideos()
    }else{
        let li = "<span>No videos yet!</span>"
        iframes_list.innerHTML = null
        iframes_list.innerHTML = li
    }
}

// rendering all videos
async function allVideos(params) {
    iframes_list.innerHTML = null
        const response = await request(`/videos?userId=${params}`)
        const users = await request(`/users`)
        for(let user of users){
            const response = await request(`/videos?userId=${user.userId}`)
            let li = ''
            for(let i of response){
                li += `
                <li class="iframe">
                    <video src="${backendApi+ '/' + i.videoUrl}" controls=" "></video>
                    <div class="iframe-footer">
                        <img src="${backendApi + user.imageUrl}" alt="channel-icon">
                        <div class="iframe-footer-text">
                            <h2 class="channel-name">${user.username}</h2>
                            <h3 class="iframe-title">${i.videoTitle}</h3>
                            <time class="uploaded-time">${i.uploadedDate} | ${i.uploadedTime}</time>
                            <a class="download" href="${backendApi + '/download/' + i.videoUrl}">
                                <span>${i.size} MB</span>
                                <img src="/img/download.png">
                            </a>
                        </div>                  
                    </div>
                </li>  
                `
            }

            iframes_list.innerHTML += li
        }
}

// searching movie by name
search.onkeyup = async(eve) => {
        let req = await request("/videos?title=" + eve.target.value)
        datalist.innerHTML = null
        for(let i of req){
            let opt = document.createElement('option')
            opt.value = i.videoTitle
            datalist.append(opt)
        }
        let list = document.querySelector("#datalist").childNodes;
        for(let i = 0; i < list.length; i++){
            if(list[i].value == eve.target.value){
                let temp = req.filter(v => v.videoTitle == list[i].value)
                let li = ''
                for(let i of temp){
                    const users = await request(`/users`)
                    let tempuser = users.find(user => user.userId == i.userId)
                    li += `
                    <li class="iframe">
                        <video src="${backendApi+ '/' + i.videoUrl}" controls=" "></video>
                        <div class="iframe-footer">
                            <img src="${backendApi + tempuser.imageUrl}" alt="channel-icon">
                            <div class="iframe-footer-text">
                                <h2 class="channel-name">${tempuser.username}</h2>
                                <h3 class="iframe-title">${i.videoTitle}</h3>
                                <time class="uploaded-time">${i.uploadedDate} | ${i.uploadedTime}</time>
                                <a class="download" href="${backendApi + '/download/' + i.videoUrl}">
                                    <span>${i.size} MB</span>
                                    <img src="/img/download.png">
                                </a>
                            </div>                  
                        </div>
                    </li>  
                    `
                    iframes_list.innerHTML = null
                    iframes_list.innerHTML = li
                }
            }
        }
}

microphone.onclick = (event) => {
    //!mikrofon ishlamadi
    const voice = new webkitSpeechRecognition()
    voice.start();
    voice.onaudiostart = () => {
        console.log('started..')
    }
    
    voice.onaudioend = () => {
        console.log('ended..')
    }
    
    voice.onresult = event => {
        personWord = event.results[0][0].transcript
        console.log(personWord); 
    }
}

allVideos(0)