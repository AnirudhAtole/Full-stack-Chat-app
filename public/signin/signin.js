const myForm = document.getElementById('myForm');

myForm.onsubmit = async(e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    let result = await axios.post('http://localhost:3000/user/checkUser',{email,password});

    if(result.data.success){
        localStorage.setItem('token',result.data.token)
        alert(result.data.message);
        window.location.href = '../chatpage/chatpage.html';
    }
    else{
        alert(result.data.message);
    }
}