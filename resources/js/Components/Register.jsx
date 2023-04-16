import {useState} from 'react'
import axios from 'axios'

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'inherit'},
})

function Register() {
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const submitRegistration = (e) => {
        e.preventDefault();
        const data =JSON.stringify({ 
            lastname: lastname,
            firstname: firstname,
            email: email,
            mobile: mobile,
            username: username,
            password: password
        });
        
        api.post("/api/signup", data)
           .then((res) => {
            if (res.data != null) {
                if (res.data.statuscode == 201) {
                    setMessage(res.data.message);
                } else {
                    setMessage(res.data.message);
                }
            } else {
                setMessage("no data....");
            }
        }, (error) => {
            setMessage(error.message);
            return;
        });
    }

    const closeDiaglog = (e) => {
        e.preventDefault();
        setMessage("")
        setLastname("");
        setFirstname("");
        setEmail("");
        setMobile("");
        setUsername("");
        setPassword("");
    }

    return(
        <div className="modal fade" id="staticRegister" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticRegisterLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header bg-primary">
                <h1 className="modal-title fs-5 text-white" id="staticRegisterLabel">Account Registration</h1>
                <button onClick={closeDiaglog} type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <form onSubmit={submitRegistration}>

                    <div className="row">
                        <div className="col">
                            <div class="mb-3">
                                <input type="text" class="form-control" id="lastName" value={lastname} onChange={e => setLastname(e.target.value)} placeholder="enter Last Name" autoComplete="off" required={true}/>
                            </div>
                        </div>
                        <div className="col">
                            <div class="mb-3">
                                <input type="text" class="form-control" id="firstName" value={firstname} onChange={e => setFirstname(e.target.value)} placeholder="enter First Name" autoComplete="off" required={true}/>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <div class="mb-3">
                                <input type="text" class="form-control" id="emailAdd" value={email} onChange={e => setEmail(e.target.value)} placeholder="enter Email Address" autoComplete="off" required={true}/>
                            </div>
                        </div>
                        <div className="col">
                            <div class="mb-3">
                                <input type="text" class="form-control" id="mobileNo" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="enter Mobile No" autoComplete="off"/>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <div class="mb-3">
                                <input type="text" class="form-control" id="usrName" value={username} onChange={e => setUsername(e.target.value)} placeholder="enter Username" autoComplete="off" required={true}/>
                            </div>
                        </div>
                        <div className="col">
                            <div class="mb-3">
                                <input type="password" class="form-control" id="pasWd" value={password} onChange={e => setPassword(e.target.value)} placeholder="enter Password" autoComplete="off" required={true}/>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary">register</button>
                </form>
                
            </div>
            <div className="modal-footer">
                <div id="regMsg" className="w-100 text-center text-danger fsize">{message}</div>
            </div>
            </div>
        </div>
        </div>
    )
}

export default Register;