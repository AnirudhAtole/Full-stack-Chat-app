const myForm = document.getElementById('myForm');

myForm.addEventListener('submit',saveUser);

async function saveUser(e){
    e.preventDefault();
    console.log("im in")

    const password = document.getElementById('password').value;
    const confPassword = document.getElementById('password2').value;
    if(password === confPassword){
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const user ={
        name : name,
        email : email,
        password : password
    }
    console.log(user);
    let result = await axios.post('http://localhost:3000/user/addUser',user);
    if(result.data.success){
        alert(result.data.message);
        window.location.href ='../signin/signin.html';
    }
    else{
        alert(result.data.message)
    }

    }
    else{
        alert("password not matching")
    }
}
