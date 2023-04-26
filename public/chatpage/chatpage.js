let textbox = document.getElementById("texts");
const token = localStorage.getItem('token');

textbox.addEventListener("keydown", async function(e){

    if(e.key === "Enter"){
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;
        if(textbox.value !== ''){
          const chat = textbox.value;
          if(sendChat(chat)){
            createChat("user",chat,dateTime)
            textbox.value = ""
          }
          else{
            alert("unable to send")
          }
        }
    }
})

function createChat(sender,chat,time){
    let chat1 = document.getElementById('chat1')
    let div = document.createElement('div');
    if(sender === "user"){
        div.className = "chat-user"
        div.innerHTML = `
        <div class="d-flex justify-content-between">
          <p class="small mb-1 text-muted">${time}</p>
          <p class="small mb-1">You</p>
        </div>
        <div class="d-flex flex-row justify-content-end mb-4">
          <div class="p-3 me-3 border" style="border-radius: 15px; background-color: #50C878;">
            <p class="small mb-0">${chat}</p>
          </div>
          <img src="https://img.icons8.com/clouds/1x/mando.png"
            alt="avatar 1" style="width: 45px; height: 100%;">
        </div>`
    }
    else{
        div.className = "chat-other"
        div.innerHTML = `
        <div class="d-flex justify-content-between">
          <p class="small mb-1 text-muted">${sender}</p>
          <p class="small mb-1">${time}</p>
        </div>
        <div class="d-flex flex-row justify-content-start mb-4">
          <img src="https://img.icons8.com/emoji/1x/man-beard.png"
            alt="avatar 1" style="width: 45px; height: 100%;">
          <div class="p-3 ms-3" style="border-radius: 15px; background-color: rgba(57, 192, 237,.2);">
            <p class="small mb-0">${chat}</p>
          </div>
        </div>`
    }
    chat1.appendChild(div);
}


async function sendChat(chat){
  
  const result = await axios.post('http://localhost:3000/chat/send-chat',{chat},{headers :{"Authorization":token}});
  
  return(result.data.success)
}