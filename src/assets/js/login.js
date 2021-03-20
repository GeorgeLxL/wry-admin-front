import axios from 'axios';
const apiurl = process.env.REACT_APP_API_BASE_URL;
const publicurl = process.env.REACT_APP_PUBLIC_BASE_URL;
const adminurl = process.env.REACT_APP_ADMIN_BASE_URL;

export function login(Email, password){
  console.log(apiurl);
    if(Email && password){        
        var data = JSON.stringify({"Email":Email,"Password":password});        
        var config = {
          method: 'post',
          url: `${apiurl}/login`,
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
        
        axios(config)
        .then(function (response) {
            localStorage.setItem("userData", JSON.stringify(response.data))
            window.location.assign('/admin');
        })
        .catch(function (error) {
          alert("login failed")
        });
    }
}

export function logout(){
    localStorage.removeItem("userData");
}

export function getCurrentUser(){
    return JSON.parse(localStorage.getItem("userData"));
  }