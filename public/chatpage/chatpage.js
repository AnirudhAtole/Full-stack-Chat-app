let textbox = document.getElementById("texts");
const token = localStorage.getItem('token');
var lastId;
var chatQueue;

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
  const response = await axios.get(`http://localhost:3000/chats/updated-chats?updation=${lastId}`, {headers:{"Authorization":token}});
  const {result} = response.data;
  const {id} = parseJwt(token);
  if(result.length){
    lastId = result[result.length-1].id;
    result.forEach(element => {
      if(element.userId !== id){
        createChat(element.name,element.chatmessages,element.createdAt)
        if(!chatQueue.enqueue(element)){
          chatQueue.dequeue();
          chatQueue.enqueue(element);
        }
        else{
          chatQueue.enqueue();
        }
        localStorage.setItem('chats',JSON.stringify(chatQueue.savequeue()));

      }
      else{
        createChat("user",element.chatmessages,element.createdAt)
        if(!chatQueue.enqueue(element)){
          chatQueue.dequeue();
          chatQueue.enqueue(element);
        }
        else{
          chatQueue.enqueue();
        }
        localStorage.setItem('chats',JSON.stringify(chatQueue.savequeue()));
      }
    })
  }
}, 1000);


window.addEventListener("DOMContentLoaded",async ()=>{
  let result = localStorage.getItem('recentChats')
  if(result){
    result = JSON.parse(result);
    const{queue , head , tail} = result;
    chatQueue = new circularQueue(10,queue,head,tail);

    const chats = chatQueue.printCqueue();
    if(chats){
      const id = parseJwt(token);
      chats.forEach(element => {
        if(element.userId === id){
          createChat("user",element.chatmessages,element.createdAt)
        }
        else{
          createChat(element.name,element.chatmessages,element.createdAt)
        }
      });
  
      lastId = chats[chats.length-1].id
    }
  }
  else{
    const recentChats = await getandShowChats(token);
    chatQueue = new circularQueue(recentChats.length);
    recentChats.forEach(element => {
      chatQueue.enqueue(element);
    });

    lastId = recentChats[recentChats.length-1].id;

    localStorage.setItem('chats',JSON.stringify(chatQueue.savequeue()));
  }
})


async function getandShowChats(token){
  const {id} = parseJwt(token);
  const response = await axios.get('http://localhost:3000/chat/get-chats',{headers :{"Authorization":token}});
  const {result} = response.data;
  result.forEach(element => {
    if(element.userId === id){
      createChat("user",element.chatmessages,element.createdAt)
    }
    else{
      createChat(element.name,element.chatmessages,element.createdAt)
    }
  });
  return result.slice(-10);
}








// for creating queue to store and access localstorage messages
class circularQueue{
  constructor(size,queue=[],head=-1,tail=-1){
      this.size = size;
      if(queue){
      this.queue = queue;
      this.head = head;
      this.tail = tail;
      }
      else{
      this.queue = new Array(size)
      this.head = -1;
      this.tail = -1;
      }
      
  }

  enqueue(element){
      if((this.tail + 1) % this.size == this.head){
          return(false)
      }

      else if(this.head === -1){
          this.head = 0;
          this.tail = 0;
          this.queue[this.tail] = element;
      }
      else{
          this.tail = (this.tail + 1) % this.size;
          this.queue[this.tail] = element;
      }
      return(true)
  }

  dequeue(){
      if(this.head === -1){
          return(false);
      }

      else if(this.head === this.tail){
          this.temp = this.queue[this.head];
          this.head = -1;
          this.tail = -1;
          return true;
      }
      else{
          this.temp = this.queue[this.head];
          this.head = (this.head + 1) % this.size;
          return true;
      }
  }

  printCqueue(){
      if(this.head === -1){
          return(false)
      }

      else if(this.tail >= this.head){
          const arr = []
          for(let i= this.head ; i <= this.tail ; i++){
              arr.push(this.queue[i])
          }
          return(arr);
      }
      else{
          const arr = []
          for(let i = this.head ; i < this.size ; i++){
              arr.push(this.queue[i])
          }
          for(let i = 0 ; i <= this.tail ; i++){
              arr.push(this.queue[i])
          }
          return(arr);
      }
  }

  savequeue(){
      return ({queue:this.queue , head : this.head , tail : this.tail})
  }
}

