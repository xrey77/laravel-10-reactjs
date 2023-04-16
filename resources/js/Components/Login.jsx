import { useState, useEffect } from 'react'
import axios from 'axios'
import $ from 'jquery/dist/jquery'
import Forgot from './Forgot'

// axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'inherit'},
})

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [remember, setRemember] = useState("0");

    useEffect(() => {
        try {
            var isremember = sessionStorage.getItem('REMEMBER');
            if (isremember == "0") {
                $('#rememberme').prop('checked', false);
            } else {
                $('#rememberme').prop('checked', true);
            }
        } catch(e) {
            sessionStorage.setItem('REMEMBER', "0");
        }
    });

    $("#rememberme").click(function() {
        if ($('#rememberme').is(":checked")) {
            setRemember("1");
            sessionStorage.setItem('REMEMBER', "1");
            $('#rememberme').prop('checked', true);
        } else {
            setRemember("0");
            $('#rememberme').prop('checked', false);
            sessionStorage.setItem('REMEMBER', "0");
        }        
    });

    const submitLogin = (e) => {
        e.preventDefault();

        const data =JSON.stringify({ 
            username: username,
            password: password,
            remember: remember
        });
        
        api.post("/api/signin",data)
           .then((res) => {            
            if (res.data.statuscode == 200) {
             if (res.data.activateotp == 1) {
                sessionStorage.setItem('TOKEN',res.data.jwt.token);
                window.location.href="/otpdiaglog";
             } else {
                sessionStorage.setItem('REMEMBER', remember);
                sessionStorage.setItem('USERID', res.data.userid);
                sessionStorage.setItem('USERNAME', res.data.username);
                sessionStorage.setItem('USERPIC', res.data.userpic);
                sessionStorage.setItem('TOKEN',res.data.jwt.token);
                setMessage(res.data.message);
                window.setTimeout(() => {
                    window.location.reload();
                }, 3000);
             }
            } else {
                setMessage(res.data.message);
            }
    
        }, (error) => {
            setMessage(error.message);
            return;
        });
    }

    const closeDiaglog = (e) => {
        e.preventDefault();
        setUsername("");
        setPassword("");
        setMessage("");
        setRemember("0");
    }

    return(
        <>
        <Forgot/>
        <div className="modal fade" id="staticLogin" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticLoginLabel" aria-hidden="true">
        <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header bg-success">
                <h1 className="modal-title fs-5 text-white" id="staticLoginLabel">User's Login</h1>
                <button onClick={closeDiaglog} type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <form onSubmit={submitLogin}>
                    <div class="mb-3">
                        <input type="text" class="form-control" id="userName" value={username} onChange={e => setUsername(e.target.value)} placeholder="enter Username"  autoComplete="off" required={true}/>
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control" id="passWord" value={password} onChange={e => setPassword(e.target.value)} placeholder="enter Password" autoComplete="off" required={true}/>
                    </div>

                    <div class="form-check mb-4" style={{marginTop: -10, fontStyle: 'italic'}}>
                        <input class="form-check-input fsize" type="checkbox" value={remember} onChange={e => setRemember(e.target.value)} name="rememberme" id="rememberme" />
                        <label class="form-check-label fsize" for="flexCheckChecked">
                            Remember
                        </label>
                    </div>


                    <button type="submit" className="btn btn-success">login</button>
                    <div class="form-check floatRight" style={{marginTop: 20, fontStyle: 'italic'}}>
                        <label class="form-check-label fsize" for="flexCheckChecked">
                            <a href="#" data-bs-toggle="modal" data-bs-target="#staticForgot" >Forgot Password</a>
                        </label>
                    </div>


                </form>
            </div>
            <div className="modal-footer">
                <div id="msgLogin" className="w-100 text-center text-danger fsize">{message}</div>
            </div>
            </div>
        </div>
        </div>
        </>        
    );
}

export default Login;