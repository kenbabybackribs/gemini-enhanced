// 1. Constants and Variables
const API_KEY = 'AIzaSyBA1j_5Pb_5kG-4_Xi3pp6YG1DzZIvS8RE'
const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key'
const typingForm = document.querySelector('.typing-form');
const typingInput = document.querySelector('.typing-input');
const chatList = document.querySelector('.chat-list');
const greeting = document.querySelector('.header-wrapper .title');
const profilePicture = document.querySelector('.user-chosen-profile-picture');
const profilePictureBtn = document.querySelector('#choose-picture');
const userSubmitForm = document.querySelector('.gemini-input-form');
const userSubmitBtn = document.querySelector('.gemini-btn-submit');
const userNameInput = document.querySelector('.gemini-input-wrapper input');
const overlay = document.querySelector('.overlay');
const geminiLogIn = document.querySelector('.gemini-log-in');
const geminiReturningUser = document.querySelector('.gemini-returning-user');
const suggestions = document.querySelector('.suggestion-list');
const headerWrapper = document.querySelector('.header-pic-wrapper');
const headerTitles = document.querySelector('.header-titles');
const userTitle = document.querySelector('.header-wrapper .title');
const headerPic = document.createElement('img');
headerPic.classList.add('header-pic');
const chosenProfilePicture = document.querySelector('.user-chosen-profile-picture');
const changeName = document.querySelector('.change-name')
const editBtn = document.querySelector('.edit-icon')
const editInputForm = document.querySelector('.edit-input-form')
const edit = document.querySelector('.edit-input')
const cancelBtn = document.querySelector('.cancel')
const editedInput = edit.querySelector('.edited-input') 
const updateBtn = document.querySelector('.update')
const toggleThemeBtn = document.querySelector('#toggle-theme')
const deleteChatBtn = document.querySelector('#delete-chat')
const suggestionList = document.querySelector('.suggestion-list')
let light
let showSuggested = true


let user = {
    photoSrc: `images/person.jpg`,
    firstName: null,
    currentMessage: null,
    messagesSent: 0,
};


const gemini = {
    url:   `${API_URL}=${API_KEY}`,
    currentResponse: null,
    firstName: 'Gemini',
    responsesSent:  0, 
}


// 2. Utility Functions
const setLocalStorage = function (key, content) {
    return localStorage.setItem(key, JSON.stringify(content));
};

const getLocalStorage = function (key) {
    const userString = localStorage.getItem(key);
    if (!userString) return revealUser();
    const userData = JSON.parse(userString);
    user = userData;
    returningUser();
};

const getLocalStorageThemeandChat = function () {
    const mode = localStorage.getItem('theme')
    const modeFound = JSON.parse(mode)
    
    if (modeFound === 'light_mode') {
        document.body.classList.toggle('light_mode')
        toggleThemeBtn.innerText = 'light_mode'
    }

    else {
        toggleThemeBtn.innerText = 'dark_mode'
    }
    const oldChats = localStorage.getItem('savedChats')
    chatList.innerHTML = JSON.parse(oldChats)
}



const formatName = function (name) {
    const result = name[0].toUpperCase() + name.slice(1).toLowerCase();
    return user.firstName = result;
};

// 3. User-related Functions
const returningUser = function () {
    setTimeout(() => {
        getLocalStorageThemeandChat()
        if (chatList.children.length >= 1) {
            showSuggested = false
            suggestionList.classList.add('hidden-2')
        }
    },600)
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.addEventListener('transitionend', () => {
            if (showSuggested) {
                suggestions.classList.remove('hidden-2');
            }
            userTitle.innerText = `Welcome Back, ${user.firstName}`;
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 900);
            headerPic.src = user.photoSrc;
            headerWrapper.appendChild(headerPic);
        });
    }, 900);
    geminiLogIn.style.display = 'none';
};

const revealUser = function () {
    setTimeout(() => {
        overlay.classList.remove('hidden');
        geminiLogIn.classList.remove('hidden');
    }, 350);
};

const successfullyLogIn = function () {
    headerPic.src = user.photoSrc;
    headerWrapper.appendChild(headerPic);
    userTitle.innerText = `Nice to meet you, ${user.firstName}`;
    overlay.style.animation = 'blur .65s ease';
    geminiLogIn.style.animation = 'blur .65s ease';
    overlay.addEventListener('animationend', () => { 
        overlay.style.display = 'none';
        suggestions.classList.remove('hidden-2');
    });
    geminiLogIn.addEventListener('animationend', () => geminiLogIn.style.display = 'none');
    setLocalStorage('user', user);
};

// 4. Event Handlers
const handleProfileSubmit = function (event) {
    event.preventDefault();
    if (!userNameInput.value || isFinite(userNameInput.value) || userNameInput.value.length < 3 || userNameInput.value.length > 10) {
        const userNameSpan = document.querySelector(`.gemini-input-wrapper`).querySelector('span');
        userNameInput.style.animation = `shake .35s ease`;
        userNameSpan.style.opacity = '0';
        userNameInput.style.border = `solid 1px #d96570`;
        userNameInput.addEventListener('animationend', () => {
            userNameInput.style.animation = ``;
            userNameInput.style.border = `#383838`;
            userNameSpan.style.opacity = '1';
        });
        userNameInput.value = '';
        return;
    }
    formatName(userNameInput.value);
    successfullyLogIn();
};

const handleProfileFileUpload = function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profilePicture.src = e.target.result;
            user.photoSrc = profilePicture.src;
            setLocalStorage('user', user);
        };
        reader.readAsDataURL(file);
    }
};

const handleFileUploads = function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            document.querySelectorAll('.message.outgoing .avatar').forEach(avatar => {
                avatar.src = e.target.result;
                user.photoSrc = avatar.src;
                headerPic.src = user.photoSrc;
                setLocalStorage('user', user);
            });
        };
    }
};

const hideEdit  = function () {
    edit.classList.add('not-blurred')
    edit.addEventListener('animationend', () => {
        edit.classList.remove('not-blurred')
        edit.classList.add('hidden-2')
    }, {once: true})
}

const showEdit = function () {
    edit.classList.remove('hidden-2')
    edit.classList.add('blurred')
    edit.addEventListener('animationend', () => edit.classList.remove('blurred'), {once: true})
    edit.querySelector('.display-img').src = user.photoSrc
    editedInput.value = user.firstName
}

const cancelEdit = function () {
    hideEdit()
}

const startUpdate = function () {
    if (!editedInput.value || isFinite(editedInput.value) || editedInput.value.length < 3 || editedInput.value.length > 10) {
        editedInput.style.animation = `shake .35s ease`;
        editedInput.style.border = `solid 1px #d96570`;
        editedInput.addEventListener('animationend', () => {
            editedInput.style.animation = ``;
            editedInput.style.border = `solid 2px rgba(220, 220, 220, 0.538)`;
        });
        editedInput.value = '';
        return
    }
    if (editedInput.value === user.firstName) {
        return hideEdit()
    }
    const oldText = userTitle.innerText
    formatName(editedInput.value)

    if (oldText.startsWith('Welcome')) {
        userTitle.innerText = `Welcome Back, ${user.firstName}`
    }

    if(oldText.startsWith('Nice')) {
                userTitle.innerText = `Nice to meet you, ${user.firstName}`
    }
    hideEdit()
    setLocalStorage('user', user)
    userTitle.classList.add('hidden-2')
    setTimeout(() => {
        userTitle.classList.remove('hidden-2')
        userTitle.classList.add('blurred')
    },250)
}

const showTypingEffect = function (text, textElement, incomingMessageDiv) {
    const words = text.split(' ')
    let currentWordIndex = 0
    const typingInterval = setInterval(() => {
        textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex]
        incomingMessageDiv.querySelector('span.icon').classList.add('hide')
        currentWordIndex++

        chatList.scrollTo({
            top: chatList.scrollHeight,
            left: 0,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            chatList.scrollTop = chatList.scrollHeight;
        }, 500); 
        if (currentWordIndex === words.length){
            clearInterval(typingInterval)
            incomingMessageDiv.querySelector('span.icon').classList.remove('hide')
            setLocalStorage('savedChats', chatList.innerHTML)
        } 
    }, 85)
}

const generateApiResponse = async function (textEl) {
    const responseMessage = textEl.querySelector('.text')
    try {
        const response = await fetch(gemini.url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{text: user.currentMessage}]
                }]
            })
        })
        const data = await response.json()
        const apiResponse = data?.candidates[0].content.parts[0].text.replaceAll('*', '')
        gemini.currentResponse = apiResponse
        gemini.responsesSent++
        showTypingEffect(gemini.currentResponse, responseMessage, textEl)
        
    } catch (err) {
        console.error(err)
    }
    finally {
        textEl.classList.remove('loading')
    }
}


const showLoadingAnimation = function () {
    
    const html = `
      <div class="message-content">
                    <div class="avatar-wrapper">
                        <img src="images/gemini.svg" alt="Gemini Image" class="avatar">
                        </div>
                        <p class="text"></p>
                    <div class="loading-indicator">
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                    </div>
                </div>
                <span onclick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>
    `;
    const incomingMessage = createMessage(html, "incoming");
    chatList.appendChild(incomingMessage);
    chatList.scrollTo({
        top: chatList.scrollHeight,
        left: 0,
        behavior: 'smooth'
    });
    suggestionList.style.animation = ' leFadeOutTop  .8s ease'
    suggestionList.addEventListener('animationend', () => {
        suggestionList.style.animation = ''
        suggestionList.classList.add('hidden-2')
    })
    
    
    setTimeout(() => {
        chatList.scrollTop = chatList.scrollHeight;
    }, 500); 
    generateApiResponse(incomingMessage)
}

const copyMessage = (copyIcon) => {
    const messageText = copyIcon.parentElement.querySelector('.text')
    navigator.clipboard.writeText(messageText.innerText)
    copyIcon.innerText = 'done'
    setTimeout(() => copyIcon.innerText = 'content_copy', 1000)
}

const handleOutgoingChat = () => {
    user.currentMessage = typingInput.value;
    chatList.scrollTo({
        top: chatList.scrollHeight,
        left: 0,
        behavior: 'smooth'
    });
    
    setTimeout(() => {
        chatList.scrollTop = chatList.scrollHeight;
    }, 500); 
    if (!user.currentMessage) return;
    user.messagesSent++;
    const html = ` 
    <div class="message-content">
        <div class="avatar-wrapper">
            <label for="avatar-file">
                <img src="${user.photoSrc}" alt="User image" class="avatar">
                <div class="upload-icon"></div>
            </label>
            <input type="file" id="avatar-file" accept="images/*" style="display: none;">
        </div>
        <p class="text"></p>
    </div>`;
    const outgoingMessage = createMessage(html, "outgoing");
    outgoingMessage.querySelector('.text').innerText = user.currentMessage;
    user.photoSrc = outgoingMessage.querySelector('img').src;
    chatList.appendChild(outgoingMessage);
    handleInputReset();
    if (chatList.children.length > 0) addEventFileUploads();
    setTimeout(showLoadingAnimation, 850)
};

// 5. Main Logic
const createMessage = (content, mssgType) => {
    const message = document.createElement('div');
    message.classList.add('message', mssgType);
    if (mssgType === 'outgoing' || mssgType === 'incoming') message.classList.add('new-message');
    if (mssgType === 'incoming') message.classList.add('loading')
    message.innerHTML = content;
    return message;
};

const handleInputReset = () => {
    typingInput.value = '';
    typingInput.blur();
};

const addEventFileUploads = function () {
    const files = document.querySelectorAll('#avatar-file');
    files.forEach(file => file.addEventListener('change', handleFileUploads));
};

// 6. Event Listeners
profilePictureBtn.addEventListener('change', handleProfileFileUpload);
userSubmitForm.addEventListener('submit', handleProfileSubmit);
userSubmitBtn.addEventListener('click', handleProfileSubmit);
typingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleOutgoingChat();
});
editBtn.addEventListener('click', showEdit)
cancelBtn.addEventListener('click', cancelEdit)
updateBtn.addEventListener('click', startUpdate)
editInputForm.addEventListener('submit', (e) => {
    e.preventDefault()
    startUpdate()
})
headerTitles.addEventListener('click', showEdit)
toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light_mode')
    if (document.body.classList.contains('light_mode')) {
         light = true
    }
    else {
        light = false
    }

    if (light === true) {
        toggleThemeBtn.innerText = 'light_mode'
    }

    else {
        toggleThemeBtn.innerText = 'dark_mode'
    }
    setLocalStorage('theme' , light === true ? 'light_mode' : 'dark_mode')
})
deleteChatBtn.addEventListener('click', () => {
    chatList.innerHTML = ''
    localStorage.removeItem('savedChats')
    suggestionList.classList.remove('hidden-2')
})
suggestionList.addEventListener('click', (e) =>{
    const suggested = e.target.closest('.suggestion')
    if (!suggested) return
    typingInput.value = suggested.querySelector('.text').innerText
  handleOutgoingChat()
} )




// Initialize user data
getLocalStorage('user');