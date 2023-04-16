import React, {useState} from "react";
import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'inherit'},
})

function Forgotpwd() {
    const [message, setMessage] = useState("");
    const [emailadd, setEmailadd] = useState("");

    const submitForgot = (e) => {
        e.preventDefault();
        setMessage("please wait..");
        const data =JSON.stringify({ 
            email: emailadd,
        });
        
        api.post("/api/sendmailtoken",data)
           .then((res) => {
            if (res.data.statuscode == 200) {
                setMessage(res.data.message);
            } else {
                setMessage(res.data.message);
            }            
        }, (error) => {
            setMessage(error.message);
            return;
        });
    }

    const closeDiaglog = () => {
        $("#staticForgot").modal('hide');
        setEmailadd("");
        setMessage("");
    }

    return(
        <div className="modal fade" id="staticForgot" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticForgotLabel" aria-hidden="true">
        <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header bg-warning">
                <h1 className="modal-title fs-5 text-white" id="staticForgotLabel">Forgot Password</h1>
                <button onClick={closeDiaglog} type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">

                <form onSubmit={submitForgot} autoComplete="off">
                    <div class="mb-3">
                        <input type="email" class="form-control" value={emailadd} onChange={e => setEmailadd(e.target.value)} placeholder="enter Email Address" required={true}/>
                    </div>
                    <button type="submit" className="btn btn-warning text-white fsize">submit</button>
                </form>

            </div>
            <div className="modal-footer">
                <div id="msgForgot" className="w-100 text-center text-danger fsize">{message}</div>
            </div>
            </div>
        </div>
        </div>
    )
}

export default Forgotpwd;