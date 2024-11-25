// import { useEffect } from 'react';
// import '/public/js/sb-admin-2'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { API_Url } from "../../../tsconfig.json"

import AdminFormLogin from "../Components/Login/AdminLogin";

const LoginPage = () => {

    return (
        <>
            <div
                className="page-wrapper"
                id="main-wrapper"
                data-layout="vertical"
                data-navbarbg="skin6"
                data-sidebartype="full"
                data-sidebar-position="fixed"
                data-header-position="fixed"
            >
                <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="d-flex align-items-center justify-content-center w-100">  
                        <AdminFormLogin/>
                    </div>
                </div>
            </div>

        </>
    )
}

export default LoginPage;
