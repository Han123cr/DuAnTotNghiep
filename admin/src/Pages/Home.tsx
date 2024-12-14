// import { useEffect } from 'react';
// import '/public/js/sb-admin-2'
import Clock from '../Components/Clock'
import { HeaderUl, HeaderNav } from './Header'
import Report from '../Components/Report/Report'
import ReportDefault from '../Components/Report/DefaultReport'
// import { API_Url } from "../../../tsconfig.json"

const Home = () => {

  const role = localStorage.getItem('role')

  return (
    <div id="page-top">
      {/* Page Wrapper */}
      <div id="wrapper">
        {/* Sidebar */}
        <HeaderUl />
        {/* End of Sidebar */}
        {/* Content Wrapper */}
        <div id="content-wrapper" className="d-flex flex-column">
          {/* Main Content */}
          <div id="content">
            {/* Topbar */}
            <HeaderNav />
            {/* End of Topbar */}
            {/* Begin Page Content */}
            <div className="container-fluid">
              <div className="app-title">
                <ul className="app-breadcrumb breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#">
                      <b className='colorweb'>Thống kê báo cáo</b>
                    </a>
                  </li>
                </ul>
                < Clock />
              </div>
              {/* Content Row */}
              <div className="row">
                {/* Earnings (Monthly) Card Example */}
                {role === 'admin' && (
                  <ReportDefault/>
                )}
                {/* Content Row */}
                <div className="row">
                  {/* Area Chart */}
                    <Report/>
                </div>
              </div>
            </div>
            {/* End of Main Content */}
            <a className="scroll-to-top rounded" href="#page-top">
              <i className="fas fa-angle-up"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Home
