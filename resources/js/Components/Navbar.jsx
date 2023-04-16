import Login from './Login';
import Register from './Register';
import logo from '../../assets/images/logo.gif';

export default function Navbar() {
    var usernamex = sessionStorage.getItem('USERNAME');
    var userpic = sessionStorage.getItem('USERPIC');

    const signout = (e) => {
        e.preventDefault();
        sessionStorage.removeItem("USERID");
        sessionStorage.removeItem("USERNAME");
        sessionStorage.removeItem("TOKEN");
        sessionStorage.removeItem("USERPIC");
        userpic="";
        usernamex="";
        window.location.href = "/signout";
    };

    return(
    <>
        <Login/>
        <Register/>    
        <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
            <a className="navbar-brand" href="/"><img className='logo' src={logo} /></a>
            <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/about">About Us</a>
                </li>
                <li className="nav-item">
                <a className="nav-link" href="/v1/services">Services</a>
                </li>
                <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Products
                </a>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="/v1/sst">Self Service Terminals</a></li>
                    <li><a className="dropdown-item" href="/v1/onlinebanking">Online Banking</a></li>
                    <li><hr className="dropdown-divider"/></li>
                    <li><a className="dropdown-item" href="/v1/bankingsolutions">Banking Solutions</a></li>
                </ul>
                </li>
                <li className="nav-item">
                <a className="nav-link" href='/contact'>Contact Us</a>
                </li>
            </ul>

            <ul className="navbar-nav mr-auto">

            {
                usernamex ? (
                    <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={userpic} className='usrpic' alt="'" />&nbsp;{usernamex}
                    </a>
                    <ul className="dropdown-menu">
                        <li><a onClick={signout} className="dropdown-item" href="/signout">LogOut</a></li>
                        <li><a className="dropdown-item" href="/profile201">Profile</a></li>
                        <li><hr className="dropdown-divider"/></li>
                        <li><a className="dropdown-item" href="#">Messenger</a></li>
                    </ul>
                </li>                        

                ) :
                <>
                    <li className="nav-item">
                        <a className="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#staticLogin">Login</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#staticRegister">Register</a>
                    </li>
                </>
            }

            </ul>

            </div>
        </div>
        </nav>

            {/* START DRAWER MENU */}
            <div className="w-50 offcanvas offcanvas-end hideOffmenu" data-bs-backdrop="static" tabindex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header bg-primary">
                    <h5 className="offcanvas-title text-white" id="staticBackdropLabel">Drawer Menu</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <div>
                        <ul className="nav flex-column navbar-expand-lg bg-light">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/about">About Us</a>
                            </li>
                            <li><hr/></li>
                            <li className="nav-item">
                                <a className="nav-link" href="/v1/services">Services</a>
                            </li>
                            <li><hr/></li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Products
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="/v1/sst">Self Service Terminals</a></li>
                                    <li><a className="dropdown-item" href="/v1/onlinebanking">Online Banking</a></li>
                                    <li><hr className="dropdown-divider"/></li>
                                    <li><a className="dropdown-item" href="/v1/bankingsolutions">Banking Solutions</a></li>
                                </ul>
                            </li>                        
                            <li><hr/></li>
                            <li className="nav-item">
                                <a className="nav-link" href='/contact'>Contact Us</a>
                            </li>
                            <li><hr/></li>                           

                            {
                            usernamex ? (
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src={userpic} className='usrpic' alt="'" />&nbsp;{usernamex}
                                   </a>
                                    <ul className="dropdown-menu">
                                        <li><a onClick={signout} className="dropdown-item" href="#">LogOut</a></li>
                                        <li><hr className="dropdown-divider"/></li>                                        
                                        <li><a className="dropdown-item" href="/profile201">Profile</a></li>
                                        <li><hr className="dropdown-divider"/></li>
                                        <li><a className="dropdown-item" href="#">Messenger</a></li>
                                    </ul>
                                </li>                        
                            ) :
                                <>
                                <li className="nav-item">
                                    <a className="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#staticLogin">Login{usernamex}</a>
                                </li>
                                <li><hr/></li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#staticRegister">Register</a>
                                </li>
                                </>
                            }

                        </ul>
                    </div>

                </div>
            </div>
            {/* END DRAWER MENU */}

    </>
    )
}