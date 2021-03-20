import React, { Component } from 'react';
import "../../assets/styles/tailwind.css";
import "../../assets/styles/index.css";
import { login } from '../../assets/js/login';

export default function Login() {
    const [Email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    async function handleLogin(event){
        event.preventDefault();
        var Email =  document.getElementById('email').value;
        var password = document.getElementById("password").value;
        await login(Email, password);
    }

    return(
        <>
            <div className="container-fulid h-full card-mid">
                <div className="flex content-center items-center justify-center h-full">
                    <div className="w-full lg:w-12/12">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg border-0">
                    <div className="h-300 bg-black rounded-t py-50-px">
                        <div className="text-center">
                            <h1 className="text-white text-65-px font-bold">
                                WeRaveYou<br/>
                                ADMIN
                            </h1>
                        </div>
                    </div>
                    <div className="flex-auto px-4 lg:px-10 py-16 pt-0">
                        <div className="text-center mb-3" style={{ margin: "100px auto auto auto" }}>
                        <h1 className="text-black text-65-px font-bold">
                            LOGIN
                        </h1>
                        </div>
                        <form onSubmit={handleLogin}>
                            <div className="relative input-w-600 m-a-3">
                                <input
                                type="email"
                                className="h-50-px px-6 text-gray-700 bg-white rounded-10-px text-25-px shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                placeholder="Email address"
                                name="email"
                                id="email" 
                                />
                            </div>

                            <div className="relative input-w-600 m-a-3">
                                <input
                                type="password"
                                className="h-50-px px-6 text-gray-700 bg-white rounded-10-px text-25-px shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                placeholder="Password"
                                name="password"
                                id="password"
                                />
                            </div>
                            
                            <div className="text-center input-w-600 m-a-3" style={{ margin: "100px auto auto auto"}}>
                            <button
                                className="h-50-px bg-black text-white active:bg-gray-700 text-25-px font-bold uppercase rounded-10-px shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                type="submit"
                                >
                                LOGIN
                            </button>
                        </div>
                        </form>
                    </div>
                </div>
                </div>
                </div>
            </div>
        </>
    );
}


