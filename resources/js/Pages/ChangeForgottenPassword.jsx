import React, { useState, useEffect } from "react";
import $ from 'jquery/dist/jquery';
import axios from 'axios'
import '../../css/mailtoken.css';

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'inherit'},
})

export default function ChangeForgottenPassword() {
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("")
    const [changeMessage, setChangeMessage] = useState("");

    var mtoken =  sessionStorage.getItem('MTOKEN');

    const showModal = () => {
        $("#modal2").click();
    }

    useEffect(() => {
        setChangeMessage(mtoken);
        showModal();
    },[]);

    const submitNewPassword = (e) => {
        e.preventDefault();
        if (password != confirmation)  {
            setChangeMessage("New password did not matched..");
            return;
        } else {

            const data =JSON.stringify({ 
                mailtoken: mtoken,
                password: password,
            });
            
            api.post("/api/updatepassword", data)
               .then((res) => {
                if (res.data != null) {
                    if (res.data.statuscode == 200) {
                        setChangeMessage(res.data.message);
                    } else {
                        setChangeMessage(res.data.message);
                    }
                } else {
                    setChangeMessage("no data....");
                }
            }, (error) => {
                setChangeMessage(error.message);
                return;
            });
        }
    }

    const closeDiaglog = () => {
        setPassword("");
        setConfirmation("");
        setChangeMessage("");
        window.location.href="/";
    }

    return (
        <>
        <button id="modal2" className="hideModal" type="button" data-bs-toggle="modal" data-bs-target="#staticChangeForgotten">&nbsp;</button>
        <div className="modal fade" id="staticChangeForgotten" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticChangeForgottenLabel" aria-hidden="true">
        <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header bg-warning">
                <h1 className="modal-title fs-5 text-white" id="staticChangeForgottenLabel">Forgotten Password</h1>
                <button onClick={closeDiaglog} type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">

                <form onSubmit={submitNewPassword}>
                    <div class="mb-3">
                        <input type="password" name="new-password" class="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="enter new-password"  autoComplete="off" required={true}/>
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control" value={confirmation} onChange={e => setConfirmation(e.target.value)} placeholder="confirm new-password"  autoComplete="off" required={true}/>
                    </div>

                    <button type="submit" className="btn btn-warning text-white fsize">submit</button>
                </form>

            </div>
            <div className="modal-footer">
                <div id="msgForgot" className="w-100 text-center text-danger fsize">{changeMessage}</div>
            </div>
            </div>
        </div>
        </div>
        </>
    );
}