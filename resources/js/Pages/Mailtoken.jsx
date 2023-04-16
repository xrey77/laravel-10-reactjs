import React, { useState, useEffect } from "react";
import $ from 'jquery/dist/jquery';
import '../../css/mailtoken.css';
import axios from 'axios';

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'inherit'},
})

function Mailtoken() {
    const [mailtoken, setMailtoken] = useState("");
    const [msgMailtoken, setMsgMailtoken] = useState("");

    const showModal = () => {
        $("#modal1").click();
    }

    useEffect(() => {        
            showModal();
    }, []);
    
    const submitMailtoken = (e) => {
        e.preventDefault();
        if (window.isNaN(mailtoken)) {
            setMsgMailtoken("Please enter numeric only..");
            setMailtoken("");
            return;
        } else {
            if (mailtoken.length < 6  || mailtoken.length > 6) {
                setMsgMailtoken("Please enter 6 digit only..");
            } else {

                sessionStorage.setItem('MTOKEN', mailtoken);

                const data =JSON.stringify({ 
                    mailtoken: mailtoken,
                });
                
                api.post("/api/checkmailtoken", data)
                   .then((res) => {
                    if (res.data != null) {
                        if (res.data.statuscode == 200) {
                            setMsgMailtoken(res.data.message);
                            sessionStorage.setItem('MTOKEN', mailtoken);                            
                            window.setTimeout(() => {
                                window.location.href="http://127.0.0.1:8000/chnageforgottenpassword";                                
                            }, 3000);

                        } else {
                            setMsgMailtoken(res.data.message);
                        }
                    } else {
                        setMsgMailtoken("no data....");
                    }
                }, (error) => {
                    setMsgMailtoken(error.message);
                    return;
                });

            }
        }
    }
    
    const closeDiaglog = () => {
        setMailtoken("");
        setMsgMailtoken("");
        window.location.href="/";
    }

    return(
        <>
        <button id="modal1" className="hideModal" type="button" data-bs-toggle="modal" data-bs-target="#staticMailtoken">&nbsp;</button>
        <div className="modal" id="staticMailtoken" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticMailtokenLabel" aria-hidden="true">
        <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header bg-warning">
                <h1 className="modal-title fs-5 text-white" id="staticForgotLabel">Mail Token</h1>
                <button onClick={closeDiaglog} type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">

                <form onSubmit={submitMailtoken} autoComplete="off">
                    <div class="mb-3">
                        <input type="text" class="form-control" value={mailtoken} onChange={e => setMailtoken(e.target.value)} placeholder="enter 6 digit mail token" required={true} />
                    </div>
                    <button type="submit" className="btn btn-warning text-white fsize">submit</button>
                </form>

            </div>

            <div className="modal-footer">
                <div id="msgMailtoken" className="w-100 text-center text-danger fsize">{msgMailtoken}</div>
            </div>
            </div>
        </div>
        </div>        
      </>      
    );
} 

export default Mailtoken;