import { useLocation, useNavigate } from "react-router-dom";
import logoutIcon from '../assets/logout.png';
import jscookie from 'js-cookie';
import { useEffect, useState } from "react";

function HomeComponent() {
    const navigate = useNavigate();
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const userEmail = jscookie.get('user_email');

    useEffect(() => {
        if (userEmail) {
            setUserData(location.state?.userData);
        } else {
            navigate('/');
        }
    }, [location.state?.userData, navigate, userEmail]);

    const handleLogout = () => {
        jscookie.remove('user_email');
        navigate('/');
    };

    return (
        <>
            {userData ? (
                <div className="container-fluid p-5">
                    <div className="container border border-2 shadow-lg p-5">
                        <div className="row justify-content-center align-items-center">
                            <div className="col-auto mb-3">
                                <h1>Welcome {userData.userName}</h1>
                                <h5>{userData.email}</h5>
                                <button
                                    type="button"
                                    className="btn btn-info d-flex align-items-center"
                                    onClick={handleLogout}
                                >
                                    <img
                                        src={logoutIcon}
                                        alt="Logout"
                                        style={{ height: '20px', width: '20px' }}
                                    />
                                    &nbsp;Logout
                                </button>
                            </div>
                            <div className="col-auto">
                                <div
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        overflow: 'hidden'
                                    }}
                                    className="mx-auto"
                                >
                                    <img
                                        src={userData.profileImg}
                                        alt="Profile"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
}

export default HomeComponent;
