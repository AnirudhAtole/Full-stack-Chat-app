let textbox = document.getElementById("texts");
const token = localStorage.getItem('token');
var updated ;

textbox.addEventListener("keydown", async function(e){

    if(e.key === "Enter"){
        if(textbox.value !== ''){
          const chat = textbox.value;
          sendChat(chat);
          textbox.value = '';
        }
    }
})

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

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
  try{
    const result = await axios.post('http://localhost:3000/chat/send-chat',{chat},{headers :{"Authorization":token}});
    return(result.data.success);
  }
  catch(err){
    console.log(err);
  }
}

setInterval(async () => {
  const response = await axios.get(`http://localhost:3000/chats/updated-chats?updation=${updated}`, {headers:{"Authorization":token}});
  const {result} = response.data;
  const {id} = parseJwt(token);
  console.log(result);
  updated += result.length;
  result.forEach(element => {
    if(element.userId !== id){
       createChat(element.name,element.chatmessages,element.createdAt)
    }
    else{
      createChat("user",element.chatmessages,element.createdAt)
    }
  })
}, 1000);


window.addEventListener("DOMContentLoaded",async ()=>{
  const {id} = parseJwt(token);
  const response = await axios.get('http://localhost:3000/chat/get-chats',{headers :{"Authorization":token}});
  const {result} = response.data;
  updated = result.length;
  console.log(updated);
  result.forEach(element => {
    if(element.userId === id){
      createChat("user",element.chatmessages,element.createdAt)
    }
    else{
      createChat(element.name,element.chatmessages,element.createdAt)
    }
  });
})