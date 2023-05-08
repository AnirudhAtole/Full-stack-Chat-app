let textbox = document.getElementById("texts");
const token = localStorage.getItem('token');
const ChatWindow = document.getElementById('chat-Window');
const chatSendBox = document.getElementById('chatSendBox');
const groupTitle = document.getElementById('group-title');
let adminArray = []


var lastId = 0;
var chatQueue;
var selected;

var socket = io();


socket.on("receive-message", data =>{
  console.log(data);
  distributeChat(data);
})



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
    // socket.emit("leave-group",selected);
    selected = e.target.children[0].innerText;
    let check = false;
    for(let admin  of adminArray){
      if(selected == admin){
        check = true;
        break
      }
    }
    console.log(check)
    if(check){
      console.log("IM in")
      document.getElementById("invite-email-container").removeAttribute("hidden")
    }
    else{
      console.log("IM NOT")
      document.getElementById("invite-email-container").setAttribute('hidden',"hidden")
    }
    abletotext(selected);
    // socket.emit('join-group',selected);
  }
  let cards = document.getElementsByClassName('card')
  for(element of cards){
  if(element.id !==`chat${selected}`){
    element.setAttribute('hidden','hidden')
  }
  else{
    element.removeAttribute('hidden')
  }
}
})

function abletotext(selected){
  if(selected){
    document.getElementById('send-file-container').removeAttribute('hidden');
    textbox.removeAttribute('disabled')}
  else{

  }
}

document.getElementById("invite-email-btn").addEventListener('click',inviteMember);
async function inviteMember(e){
  e.preventDefault();
  const email = document.getElementById("invite-email").value;
  const result = await axios.post("http://localhost:3000/user/send-invite",{email:email , groupId:selected},{headers :{"Authorization":token}});
  if(result.data.success){
    email = "";
    alert(result.data.message);
  }

}


textbox.addEventListener("keydown", async function(e){  
    if(e.key === "Enter"){
        if(textbox.value !== ''){
          const chat = textbox.value;
          const {name , id} = parseJwt(token)
          const data = {
            name : name,
            userId : id,
            groupId : selected,
            chatmessages : chat,
            createdAt : new Date()
          }
          const chatCard = document.getElementById(`chat${selected}`);
          createChat("user",chat,new Date(),chatCard) 
          socket.emit("send-message" ,data,selected)
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

const isValidUrl = urlString =>{
      var inputElement = document.createElement('input');
      inputElement.type = 'url';
      inputElement.value = urlString;

      if (!inputElement.checkValidity()) {
        return false;
      } else {
        return true;
      }
    } 


async function getGroupMembers(){
  const result = await axios.get(`http://localhost:3000/group/get-members`,{headers :{"Authorization":token}});
  return result.data;
}


async function uploadFile(){
  const selectedFile = document.getElementById("send-files-input").files[0];
  console.log(selectedFile)
  const formdata = new FormData();
  formdata.append('file',selectedFile);
  formdata.append('groupId',selected);
  console.log(parseJwt(token))
  const result = await axios.post("http://localhost:3000/chats/send-file",formdata,{headers :{"Authorization":token}})
  console.log(result)
  const chat = textbox.value;
          const {name , id} = parseJwt(token)
          const data = {
            name : name,
            userId : id,
            groupId : selected,
            chatmessages : result.data.url,
            createdAt : new Date()
          }
          const chatCard = document.getElementById(`chat${selected}`);
          createChat("user",chat,new Date(),chatCard) 
          socket.emit("send-message" ,data,selected)
          sendChat(chat);
    document.getElementById("send-files-input").value = null;
}

const sendFileButton = document.getElementById("send-files-button");
sendFileButton.addEventListener('click',uploadFile)

async function getAllGroups(){
  try{
    const result = await axios.get("http://localhost:3000/user/get-group",{headers :{"Authorization":token}});
    if(result.data){
      const groupArray = result.data;
      const groupids = []
    groupArray.forEach(group => {
      const {groupName , id , createdAt} = group;
      const timeCreated = utcTodate(createdAt);
      createGroupFrontEnd(groupName,id,timeCreated);
      groupids.push(id.toString());
      createCard(id);
    });
    socket.emit("join-groups",groupids);
    const memberandAdminInfo = await axios.get(`http://localhost:3000/group/get-members`,{headers :{"Authorization":token}});
    const {members , adminNames} = await memberandAdminInfo.data;
    const isAdmin = createAdminInfo(adminNames);
    createMembers(members,isAdmin);
    }


  }
  catch(err){
    console.log(err);
  }
}

async function createCard(id){
  const div = document.createElement('div');
  const divInfo = document.createElement('div');
  divInfo.className = 'group-info';
  div.className = 'card';

  div.id = `chat${id}`;
  divInfo.innerHTML = `<label>Group Members</label>
  <ul class="list-inline" id="membersGroup${id}">
  </ul>

  <label>Group Admins</label>
  <ul class="list-inline" id="adminsGroup${id}">
  </ul>` 
  div.appendChild(divInfo);
  div.setAttribute('hidden','hidden');
  ChatWindow.insertBefore(div,chatSendBox);
}

function createAdminInfo(adminInfo){
  let isAdmin = []
  let {id}= parseJwt(token)
  for(let i = 0; i<adminInfo.length ; i++){
    const groupId = adminInfo[i].admingroup.groupId;
    console.log("group id is" + groupId)
    const adminUl = document.getElementById(`adminsGroup${groupId}`);
    const li = document.createElement('li');
    li.className = "list-inline-item bg-warning rounded-3";
    li.appendChild(document.createTextNode(adminInfo[i].adminName));
    if(adminInfo[i].userId === id){
      isAdmin.push(groupId.toString);
      adminArray.push(groupId);
    }
    console.log(li);
    adminUl.appendChild(li);
  }
  return isAdmin;
}

async function createMembers(memberInfo,isAdmin){
  for(let i=0;i < memberInfo.length ; i++){
    const userId = memberInfo[i].id;
    const groupId = memberInfo[i].usergroup.groupId;
    const {id} = parseJwt(token);
    let ul = document.getElementById(`membersGroup${groupId}`)
    let li = document.createElement('li');
    li.className = "list-inline-item bg-info rounded-2";
    li.appendChild(document.createTextNode(memberInfo[i].name));

    if(isAdmin.includes(groupId) && userId !== id ){
      let removeButton = document.createElement('button');
      removeButton.className = "btn-danger";
      removeButton.appendChild(document.createTextNode("X"));
      removeButton.onclick = function(){
        axios.post(`http://localhost:3000/group/remove-member`,{groupId:groupId,userId:userId})
        .then(
          ul.removeChild(li)
        )
      }
      let addAdmin = document.createElement('button');
      addAdmin.className = "btn-secondary";
      addAdmin.appendChild(document.createTextNode("+"));
      addAdmin.onclick =async function(){
      const result = await axios.post("http://localhost:3000/group/add-admin",{groupId:groupId,userId:userId},{headers :{"Authorization":token}});
      if(result.data.success){
        const adminUl = document.getElementById(`adminsGroup${groupId}`);
        const adminLi = document.createElement('li');
        adminLi.className = "list-inline-item bg-warning rounded-3";
        adminLi.appendChild(document.createTextNode(memberInfo[i].name));
        adminUl.appendChild(adminLi);
        ul.removeChild(li);
      }
      }
      li.appendChild(removeButton);
      li.appendChild(addAdmin);
    }
    ul.appendChild(li);
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
  const {id , createdAt} = result.data;
  const memberandAdminInfo = await axios.get(`http://localhost:3000/group/get-members-admins/${id}`);
  const timeCreated = utcTodate(createdAt);
  const {members , adminNames} = memberandAdminInfo.data;
  createGroupFrontEnd(result.data.groupName,id,timeCreated);
  createCard(id);
  const isAdmin = createAdminInfo(adminNames);
  createMembers(members,isAdmin);
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

function distributeChat(chat){
  const {name , userId , groupId , chatmessages , createdAt} = chat;
  console.log(userId )
  const chatCard = document.getElementById(`chat${groupId}`);
  const {id} = parseJwt(token);
  if(id === userId){
    createChat("user",chatmessages,createdAt,chatCard) 
  }
  else{
    createChat(name,chatmessages,createdAt,chatCard) 
  }

}


function createChat(sender,chat,time,chatSection ){
  if(isValidUrl(chat)){
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
          <a href=${chat} => Media sent by you</a>
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
          <a href=${chat} target="_blank"> Media sent by ${sender}</a>
          </div>
        </div>`
    }
    chatSection.appendChild(div);
  }
  else{
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
    chatSection.appendChild(div);
  }
}

console.log(parseJwt(token))

async function sendChat(chat){
  try{
    const result = await axios.post('http://localhost:3000/chat/send-chat',{chat:chat,id:selected},{headers :{"Authorization":token}});
    return(result.data.success);
  }
  catch(err){
    console.log(err);
  }
}

// setInterval(async () => {
//   if(selected){
//   textbox.removeAttribute('disabled');
//   const response = await axios.get(`http://localhost:3000/chats/updated-chats?updation=${lastId}`, {headers:{"Authorization":token}});
//   const {result} = response.data;
//   if(result.length){
//     lastId = result[result.length-1].id;
//     result.forEach(element => {
//       distributeChat(element);
//         if(!chatQueue.enqueue(element)){
//           chatQueue.dequeue();
//           chatQueue.enqueue(element);
//         }
//         else{
//           chatQueue.enqueue();
//         }
//         localStorage.setItem('chats',JSON.stringify(chatQueue.savequeue()));
//     })
//   }
//   }
//   else{


//   }
// }, 1000);



window.addEventListener("DOMContentLoaded",async ()=>{
  await getAllGroups();
  let result = localStorage.getItem('recentChats')
  result = JSON.parse(result);
  console.log(result);
  if(result){
    result = JSON.parse(result);
    const{queue , head , tail} = result;
    chatQueue = new circularQueue(10,queue,head,tail);

    const chats = chatQueue.printCqueue();
    if(chats){
      const id = parseJwt(token);
      chats.forEach(element => {
        distributeChat(element);
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
  const response = await axios.get('http://localhost:3000/chat/get-chats',{headers :{"Authorization":token}});
  const {result} = response.data;
  console.log(result.length)
  if(result.length > 0){
    result.forEach(element => {
      distributeChat(element)
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

