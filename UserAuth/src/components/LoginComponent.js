import GoogleLogin from "./GoogleLogin";

function LoginComponent() {
    // const { loginWithRedirect } = useAuth0();
    return (
    <>
      {/* <GoogleLogin
            onSuccess={credentialResponse => {
                console.log(credentialResponse);
            }}
            onError={() => {
                console.log('Login Failed');
            }}
        />; */}
      <div className="container-fluid p-5 ml-5 mr-5">
        <div className="container border border-2 shadow-lg p-5">
          <h1 className="text-center mb-3">Let's Get Started</h1>
          <div className="row justify-content-center">
            <div className="col-auto">
              <GoogleLogin />
            </div>
            <div className="col-auto">
              {/* <AppleComponent /> */}
            </div>
            {/* <div className="col-auto">
            <button onClick={() => loginWithRedirect()}>Log In</button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginComponent;
