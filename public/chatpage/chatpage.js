let textbox = document.getElementById("texts");
const token = localStorage.getItem('token');
var lastId;
var chatQueue;
var selected;

document.getElementById('closeModal').click = ()=>{
  document.getElementById('userList').innerHTML = '';
}

document.getElementById('groupList').addEventListener("click",function(e){
  if(e.target && e.target.tagName==="LI" ){
    console.log(e.target.innerHTML)
    let current = document.getElementsByClassName("active");
    if(current.length > 0){
      current[0].classList.remove("active");
    }
    e.target.classList.add('active');
    selected = e.target.children[0].innerText;
  }

})




textbox.addEventListener("keydown", async function(e){  
    if(e.key === "Enter"){
        if(textbox.value !== ''){
          const chat = textbox.value;
          sendChat(chat);
          textbox.value = '';
        }
    }
})

const Group = document.getElementById('createGroup');
Group.addEventListener('click', createGroup)


function selectedMembers(){
  const members = []
  var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
  for (var i = 0; i < checkboxes.length; i++) {
  members.push(parseInt(checkboxes[i].value));
}
 return members;

}
function utcTodate(Utcdate){
  var dateObj = new Date(Utcdate);
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  return(year + "/" + month + "/" + day);
}

function createGroupFrontEnd(name,id,timeCreated){
  const groupList = document.getElementById('groupList');
  const li  = document.createElement('li');
  li.className = "list-group-item list-group-item-action"
  li.innerHTML = `<p id="hiddenId" hidden>${id}</p>
  <div class="media"><img src="https://img.icons8.com/?size=1x&id=TmBeo7H4cjCl&format=png" alt="user" width="50" class="rounded-circle">
    <div class="media-body ml-4">
      <div class="d-flex align-items-center justify-content-between mb-1">
        <h6 class="mb-0">${name}</h6><small class="small font-weight-bold">${timeCreated}</small>
      </div>
    </div>
  </div>`
groupList.appendChild(li);
document.getElementById('userList').innerHTML = '';
}

async function getAllGroups(){
  try{
    const result = await axios.get("http://localhost:3000/user/get-group",{headers :{"Authorization":token}});
    const groupArray = result.data;
    groupArray.forEach(group => {
      const {groupName , id , createdAt} = group;
      const timeCreated = utcTodate(createdAt);
      createGroupFrontEnd(groupName,id,timeCreated);
    });
  }
  catch(err){
    console.log(err);
  }
}


async function createGroup(){
  try{
  const groupName = document.getElementById('groupname').value;
  const memberList = selectedMembers();
  const groupData = {
    name : groupName,
    users : memberList
  }
  const result = await axios.post('http://localhost:3000/group/create-group',groupData,{headers :{"Authorization":token}})
  const {id , createdAt} = result.data
  const timeCreated = utcTodate(createdAt);
  createGroupFrontEnd(result.data.groupName,id,timeCreated);
  alert("group created succesfully");
  }
  catch(err){
    console.log(err);
  }

}


const openCreateGroup = document.getElementById('openCreateGroup');
openCreateGroup.addEventListener('click',showMembers);

async function showMembers(){
  const memberList = await axios.get('http://localhost:3000/user/showMembers',{headers :{"Authorization":token}});
  const userList = document.getElementById('userList');
  memberList.data.forEach(member => {
    const{name , id} = member
    console.log(member)
    const li = document.createElement('li');
    li.className = 'list-group-item';

    li.innerHTML = `<li class="list-group-item">
    <input class="form-check-input me-1" type="checkbox" value="${id}" aria-label="...">
    ${name}
  </li>`
  userList.appendChild(li);
  });
}









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
    if(selected){
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
    }
    else{

    }
  }, 1000);



window.addEventListener("DOMContentLoaded",async ()=>{
  await getAllGroups();
  let result = localStorage.getItem('recentChats')
  console.log(result);
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
    if(recentChats.length > 0){
      chatQueue = new circularQueue(recentChats.length);
    recentChats.forEach(element => {
      chatQueue.enqueue(element);
    });

    lastId = recentChats[recentChats.length-1].id;

    localStorage.setItem('chats',JSON.stringify(chatQueue.savequeue()));
    }
    else{
      
    }
    
  }
})


async function getandShowChats(token){
  const {id} = parseJwt(token);
  const response = await axios.get('http://localhost:3000/chat/get-chats',{headers :{"Authorization":token}});
  const {result} = response.data;
  console.log(result.length)
  if(result.length > 0){
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
  else{
    return result;
  }
  
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

