import React, {useState, useEffect} from 'react';
import axios from 'axios';
import $ from 'jquery/dist/jquery';

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'inherit'},
})

export default function Profile201() {
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [username, setUsername] = useState("");
    const [newpassword, setNewPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [userpic, setUserpic] = useState("");
    const [message, setMessage] = useState("");
    const [qrcode, setQrcode] = useState("");
    var idno = sessionStorage.getItem('USERID');
    var token = sessionStorage.getItem('TOKEN');

    const fetchProfile = () => {
        api.get("/api/v1/getuserid/" + idno,{headers: {
            Authorization: `Bearer ${token}`
        }}).then(res => {
                setLastname(res.data.user.lastname);
                setFirstname(res.data.user.firstname);
                setMobile(res.data.user.mobile);
                setEmail(res.data.user.email);
                setUsername(res.data.user.username);
                setMobile(res.data.user.mobile);
                setUserpic(res.data.user.userpic);

                if (res.data.user.qrcodeurl) {
                    $("#otp1").hide();
                    setQrcode(res.data.user.qrcodeurl);
                    xcode = true;
                } else {
                    xcode = false;
                    $("#otp3").hide();
                    $("#otp1").show();
                    setQrcode("http://127.0.0.1:8000/images/qrcode.png");
                }
        }, (error) => {
            window.location.href="/";
            return;
        });                
    }

    useEffect(() => {
        if (!$('#change').is(":checked")) {
            $("#change").hide();
        }
        if (!$('#onetime-password').is(":checked")) {
            $("#otp3").hide();
            $("#otp1").hide();
            $("#otp2").hide();
        }
        fetchProfile();
    },[]);

    const submitProfile = (e) => {
        e.preventDefault();
        if ($('#change').is(":checked")) {
            if (newpassword.length == 0) {
                setMessage("Please enter New Password");
                return;
            } else if (confirmpassword.length == 0) {
                setMessage("Please confirm Password");
                return;
            }
        }

        var today = new Date();
        var xdate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var xtime = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        var xdatetime = xdate + " " + xtime;

        const data =JSON.stringify({ 
            lastname: lastname,
            firstname: firstname,
            mobile: mobile,
            password: newpassword,
            updated_at : xdatetime
        });

        api.put("/api/v1/updateuser/" + idno, data, {headers: {
            Authorization: `Bearer ${token}`
        }}).then((res) => {
            if (res.data.statuscode == 200) {
                sessionStorage.setItem('USERNAME', firstname);
                setMessage(res.data.message);
                window.setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                setMessage(res.data.message);
                window.setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }    
        }, (error) => {
            setMessage(error.message);
            return;
        });
    }

    $("#change-password").change(function() {
        if ($('#change-password').is(":checked")) {
            $("#otp1").hide();
            $("#otp2").hide();
            $("#otp3").hide();
            $("#change").show();
            $('#onetime-password').prop('checked', false);
            $('#change-password').prop('checked', true);
        } else {
            setNewPassword("");
            setConfirmPassword("");
            $("#change").hide();
            $('#change-password').prop('checked', false);
        }        
    });

    $("#onetime-password").change(function() {
        if ($('#onetime-password').is(":checked")) {
            $('#change-password').prop('checked', false);
            $("#otp1").hide();
            $("#otp3").show();
            $("#otp2").show();
            $("#change").hide();
            if (qrcode) {
                var html = $.parseHTML(qrcode);
                $("#otp3").html(html).css('opacity', 0.9);  
            } else {
                $("#otp3").css({"background-image": "url(http://127.0.0.1:8000/images/qrcode.png)"}).css('opacity', 0.2);  
            }

        } else {
            $("#otp1").hide();
            $("#otp2").hide();
            $("#otp3").hide();
            $('#onetime-password').prop('checked', false);
        }        
    });    

    const changePic = (e) => {
        e.preventDefault();
        $("#userpic").attr('src',URL.createObjectURL(e.target.files[0]));

            const form = $('#profileForm')[0];
            const profileFormVal = new FormData(form);

            api.post("/api/v1/updateuserpicture/" + idno, profileFormVal, {headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }}).then((res) => {            
                if (res.data.statuscode == 200) {
                    setMessage(res.data.message);
                    window.setTimeout(() => {
                        window.location.reload();
                    }, 3000);
    
                } else {
                    setMessage(res.data.message);
                }
        
            }, (error) => {
                setMessage(error.message);
                return;
            });
    }

    const Disable = (e) => {
        e.preventDefault();
        const data =JSON.stringify({ 
            enableqrcode: 0,
        });
        
        api.put("/api/v1/updateqrcode", data, {headers: {
            Authorization: `Bearer ${token}`
        }}).then((res) => {            
            if (res.data.statuscode == 200) {
                setMessage("Two Factor Authenticator has been disabled.");
                window.setTimeout(() => {
                    window.location.reload();
                }, 3000);

            } else {
                setMessage(res.data.message);
            }
    
        }, (error) => {
            setMessage(error.message);
            return;
        });
    }

    const Enable = (e) => {
        e.preventDefault();
        const data =JSON.stringify({ 
            enableqrcode: 1,
        });
        api.put("/api/v1/updateqrcode", data, {headers: {
            Authorization: `Bearer ${token}`
        }}).then((res) => {            
            if (res.data.statuscode == 200) {
                setMessage('Two Factor Authentication has been enabled.');
                window.setTimeout(() => {
                    window.location.reload();
                }, 3000);

            } else {
                setMessage(res.data.message);
            }
    
        }, (error) => {
            setMessage(error.message);
            return;
        });
    }
    return(
        <>
        <div className="card profile">
        <div className="card-header bg-primary text-white">
          User Profile
        </div>
        <div className="card-body">

        <form id="profileForm" onSubmit={submitProfile} enctype="multipart/form-data" >
        <div className="row">
          <div className="col-9">
            <div className="mb-3">
                <label for="firstname" className="form-label fsize">First Name</label>
                <input type="text" value={firstname} onChange={e => setFirstname(e.target.value)} className="form-control fsize" id="firstname" autoComplete='off' required={true}/>
            </div>

            <div className="mb-3 less">
                <label for="lastname" className="form-label fsize">Last Name</label>
                <input type="text" value={lastname} onChange={e => setLastname(e.target.value)} className="form-control fsize" id="lastname" autoComplete='off' required={true}/>
            </div>
            <div className="mb-3 less">
                <label for="emailadd" className="form-label fsize">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control fsize" id="emailadd" readOnly={true}/>
            </div>

          </div>      
          <div className="col">
            <img id="userpic" className="user" src={userpic} alt="user" />
            <div class="mb-3">
                <label for="formFileSm" class="form-label">Change Picture</label>
                <input onChange={changePic} class="form-control form-control-sm" id="formFile" name="formFile" type="file"/>
            </div>            

          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="mb-3 less">
                <label for="username" className="form-label fsize">User Name</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="form-control fsize" id="username" readOnly={true}/>
            </div>
          </div>
          <div className="col">
            <div className="mb-3 less">
                <label for="mobileno" className="form-label fsize">Mobile No.</label>
                <input type="text" value={mobile} onChange={e => setMobile(e.target.value)} className="form-control fsize" id="mobileno" autoComplete='off' required={true}/>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
           <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="change-password"/>
            <label class="form-check-label" for="flexCheckDefault">
                Change Password
            </label>
           </div>
          </div>
          <div className="col">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="onetime-password"/>
              <label class="form-check-label" for="flexCheckDefault">
                One Time Password
              </label>
            </div>

          </div>
        </div>

        <div className="row">
          <div className="col">

            <div id="change">
                <div className="mb-3">
                    <label for="newpassword" className="form-label fsize">New Password.</label>
                    <input type="password" value={newpassword} onChange={e => setNewPassword(e.target.value)} className="form-control fsize" id="new-password" name="new-password" autoComplete='off'/>
                </div>
                <div className="mb-3 less">
                    <label for="confirmpassword" className="form-label fsize">Confirm Password.</label>
                    <input type="password" value={confirmpassword} onChange={e => setConfirmPassword(e.target.value)} className="form-control fsize" id="confirm-password" name="confirm-password" autoComplete='off'/>
                </div>
            </div>

                     <div id="otp3" style={{ marginTop: -30, width: 200, height: 200, float: 'right'}}>
                     </div>
 
          </div>
          <div className="col">
            <div id="otp2">
                <div className="fsize text-center mb-3">
                    Please install <strong>Google or Microsoft Authenticator app</strong> from your mobile phone, once installed, 
                    click <strong>Enable Button</strong> to display QRCODE, scan this <strong>QRCODE</strong> using your mobile phone 
                    Authenticator, then everytime you login to this application, you need to open your mobile authenticator and enter 
                    the 6 digit OTP code in the OTP windows authentication.
                </div>
                    <button onClick={Enable} type="submit" className="btn btn-success fsize" style={{marginRight: 10}}>Enable</button>
                    <button onClick={Disable} type="button" className="btn btn-secondary fsize">Disable</button>
            </div>            
          </div>
        </div>

            <button type='submit' className='btn btn-primary mt-3'>save</button>
        </form>

        </div>
        <div className="card-footer text-center text-danger fsize">
            {message}
        </div>
      </div>
      </>
    );
}