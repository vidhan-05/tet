import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import { getBackendURL } from '../../util'



const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalEvents, setTotalEvents] = useState(null);
  const [totalMatrimonial, setTotalMatrimonial] = useState(null);
  const [totalMagazine, setTotalMagazine] = useState(null);
  const [totalBusiness, setTotalBusiness] = useState(null);
  const backendUrl = getBackendURL()
  const navigate = useNavigate();
  useEffect(() => {
    // fetch(`${backendUrl}/apis/totaluser/`)
    fetch(`/apis/totaluser/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "true") {
          setTotalUsers(data.totalUsers);
        } else {
          console.error("Error fetching total users:", data.error || "Unknown error");
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  useEffect(() => {
    // fetch(`${backendUrl}/apis/totalevents/`)
    fetch(`/apis/totalevents/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "true") {
          setTotalEvents(data.totalEvents);
        } else {
          console.error("Error fetching total users:", data.error || "Unknown error");
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);


  useEffect(() => {
    // fetch(`${backendUrl}/apis/totalMatrimonial`)
    fetch(`/apis/totalMatrimonial`)
      .then((response) => response.json())
      .then((data) => {
        setTotalMatrimonial(data.totalProfiles); // assuming the response contains totalMatrimonial
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);


  useEffect(() => {
    // fetch(`${backendUrl}/apis/totalmagazine`)
    fetch(`/apis/totalmagazine`)
      .then((response) => response.json())
      .then((data) => {
        setTotalMagazine(data.totalMagazines); // assuming the response contains totalMagazine
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);


  useEffect(() => {
    // fetch(`${backendUrl}/apis/totalbusiness`)
    fetch(`/apis/totalbusiness`)
      .then((response) => response.json())
      .then((data) => {
        setTotalBusiness(data.total); // assuming the response contains totalBusiness
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);
  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])



  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={
            <>
              {totalUsers !== null ? `${totalUsers} ` : 'Loading...'}
            </>
          }
          title="Total Users"
          onClick={() => navigate('/base/users')}
          style={{ cursor: 'pointer' }}
          chart={
            <div
              className="mt-3 mx-3"
              style={{
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: 'rgba(255, 255, 255, 0.55)',
              }}
            />
          }
        />
      </CCol>
  
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={
            <>
              {totalEvents !== null ? `${totalEvents} ` : 'Loading...'}
            </>
          }
          title="Total Events"
          onClick={() => navigate('/base/events')}
          style={{ cursor: 'pointer' }}
          chart={
            <div
              className="mt-3 mx-3"
              style={{
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: 'rgba(255, 255, 255, 0.55)',
              }}
            />
          }
        />
      </CCol>
  
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={
            <>
              {totalMatrimonial !== null ? `${totalMatrimonial} ` : 'Loading...'}
            </>
          }
          title="Matrimonial Profiles"
          onClick={() => navigate('/base/matrimonial')}
          style={{ cursor: 'pointer' }}
          chart={
            <div
              className="mt-3 mx-3"
              style={{
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: 'rgba(255, 255, 255, 0.55)',
              }}
            />
          }
        />
      </CCol>
  
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="danger"
          value={
            <>
              {totalMagazine !== null ? `${totalMagazine} ` : 'Loading...'}
            </>
          }
          title="Publications"
          onClick={() => navigate('/base/publication')}
          style={{ cursor: 'pointer' }}
          chart={
            <div
              className="mt-3 mx-3"
              style={{
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: 'rgba(255, 255, 255, 0.55)',
              }}
            />
          }
        />
      </CCol>
  
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="success"
          value={
            <>
              {totalBusiness !== null ? `${totalBusiness} ` : 'Loading...'}
            </>
          }
          title="Business"
          onClick={() => navigate('/base/businessconnect')}
          style={{ cursor: 'pointer' }}
          chart={
            <div
              className="mt-3 mx-3"
              style={{
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: 'rgba(255, 255, 255, 0.55)',
              }}
            />
          }
        />
      </CCol>
    </CRow>
  );
  
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
