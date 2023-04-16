import React, {useState, useEffect} from 'react';
import axios from 'axios';
import $ from 'jquery/dist/jquery';
import '../../css/mailtoken.css';

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'inherit'},
})

export default function TotopDialog() {
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");

    var token =  sessionStorage.getItem('TOKEN');

    useEffect(() => {
        $("#otpModal").click();
    },[]);

    const submitOtp = (e) => {
        e.preventDefault();
        const data =JSON.stringify({ 
            otp: otp,
        });

        api.post("/api/v1/validatetoken", data, {headers: {
            Authorization: `Bearer ${token}`
        }}).then((res) => {
            if (res.data.statuscode == 200) {
                sessionStorage.setItem('USERID', res.data.userid);
                sessionStorage.setItem('USERNAME', res.data.username);
                sessionStorage.setItem('USERPIC', res.data.userpic);
                setMessage(res.data.message);
                window.setTimeout(() => {
                    window.location.href="/";
                }, 3000);
            } else {
                setMessage(res.data.message);
                window.setTimeout(() => {
                    setMessage("");
                }, 3000);
            }    
        }, (error) => {
            setMessage(error.message);
            return;
        });
    }

    const closeDiaglog = () => {
        setMessage("")
        setOtp("");
        sessionStorage.removeItem('REMEMBER');
        sessionStorage.removeItem('USERID');
        sessionStorage.removeItem('USERNAME');
        sessionStorage.removeItem('USERPIC');
        sessionStorage.removeItem('TOKEN');
        window.location.href = "/signout";
    }

    return (
        <>
        <button id="otpModal" className="hideModal" type="button" data-bs-toggle="modal" data-bs-target="#staticOtp">&nbsp;</button>
        <div className="modal fade" id="staticOtp" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticOtpLabel" aria-hidden="true">
        <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header bg-danger">
                <h1 className="modal-title fs-5 text-white" id="staticOtpLabel">OTP Authenticator</h1>
                <button onClick={closeDiaglog} type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">

                <form onSubmit={submitOtp}>
                    <div class="mb-3">
                        <input type="number" name="code" class="form-control" value={otp} onChange={e => setOtp(e.target.value)} placeholder="enter 6 digit OTP token" autoComplete='off' required={true}/>
                    </div>
                    <button type="submit" className="btn btn-danger text-white fsize">submit</button>
                </form>

            </div>
            <div className="modal-footer">
                <div className="w-100 text-center text-danger fsize">{message}</div>
            </div>
            </div>
        </div>
        </div>
        </>
    );
}