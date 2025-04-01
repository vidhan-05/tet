// import React, { useState, useEffect, useCallback } from 'react'
// import {
//   CFormSwitch,
//   CPagination,
//   CPaginationItem,
//   CAvatar,
//   CButton,
//   CButtonGroup,
//   CCard,
//   CCardBody,
//   CCardFooter,
//   CCardHeader,
//   CCol,
//   CRow,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
//   CSpinner,
//   CCollapse,
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import { cilCloudDownload, cilPeople, cilBriefcase, cilBook, cilTrash } from '@coreui/icons'
// import { Line } from 'react-chartjs-2'
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js'
// import axiosInstance from '../base/services/axiosInstance'
// import WidgetsBrand from '../widgets/WidgetsBrand'
// import WidgetsDropdown from '../widgets/WidgetsDropdown'
// import MainChart from './MainChart'
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// )

// const colorScheme = {
//   users: '#4CAF50',
//   events: '#2196F3',
//   matrimonials: '#E91E63',
//   magazines: '#FF9800',
//   businesses: '#9C27B0',
// }

// const imageUrl = import.meta.env.VITE_IMAGE_URL;
// const pdfUrl = import.meta.env.VITE_PDF_URL;
// import { getBackendURL } from '../../util'


// const Dashboard = () => {
//   const [chartData, setChartData] = useState(null)
//   const [timeFilter, setTimeFilter] = useState('Month')
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [users, setUsers] = useState([])
//   const [businesses, setBusinesses] = useState([])
//   const [magazines, setMagazines] = useState([])
//   const [userPage, setUserPage] = useState(1)
//   const [businessPage, setBusinessPage] = useState(1)
//   const [magazinePage, setMagazinePage] = useState(1)
//   const [userTotalPages, setUserTotalPages] = useState(1)
//   const [businessTotalPages, setBusinessTotalPages] = useState(1)
//   const [magazineTotalPages, setMagazineTotalPages] = useState(1)
//   const [selectedUserId, setSelectedUserId] = useState(null)
//   const [selectedBusinessId, setSelectedBusinessId] = useState(null)
//   const [selectedMagazineId, setSelectedMagazineId] = useState(null)
//   const backendUrl = getBackendURL();
//   const fetchAllData = useCallback(async () => {
//     setIsLoading(true)
//     setError(null)
//     try {
//       const endpoints = [
//         `${backendUrl}/apis/totaluser/`,
//         `${backendUrl}/apis/totalevents/`,
//         `${backendUrl}/apis/totalMatrimonial`,
//         `${backendUrl}/apis/totalmagazine`,
//         `${backendUrl}/apis/totalbusiness`,


//         // `/apis/totaluser/`,
//         // `/apis/totalevents/`,
//         // `/apis/totalMatrimonial`,
//         // `/apis/totalmagazine`,
//         // `/apis/totalbusiness`,
//       ]

//       const results = await Promise.all(endpoints.map(url => fetch(url).then(res => res.json())))
      
//       const processedData = {
//         users: processCreatedDates(results[0].createdDates),
//         events: processCreatedDates(results[1].createdDates),
//         matrimonials: processCreatedDates(results[2].createdDates),
//         magazines: processCreatedDates(results[3].createdDates),
//         businesses: processCreatedDates(results[4].createdDates),
//       }
      
//       updateChartData(timeFilter, processedData)
//     } catch (error) {
//       console.error('Error fetching data:', error)
//       setError('Failed to fetch data. Please try again later.')
//     } finally {
//       setIsLoading(false)
//     }
//   }, [timeFilter])

//   useEffect(() => {
//     fetchAllData()
//   }, [fetchAllData])

//   const processCreatedDates = (dates) => {
//     return dates.reduce((acc, dateString) => {
//       if (!dateString) return acc
//       const d = new Date(dateString)
//       const year = d.getFullYear()
//       const month = d.getMonth()
//       const day = d.getDate()
//       const hour = new Date(d.getTime() - (5 * 60 + 30) * 60 * 1000).getHours()

//       if (!acc[year]) acc[year] = {}
//       if (!acc[year][month]) acc[year][month] = {}
//       if (!acc[year][month][day]) acc[year][month][day] = {}
//       if (!acc[year][month][day][hour]) acc[year][month][day][hour] = 0

//       acc[year][month][day][hour]++
//       return acc
//     }, {})
//   }

//   const updateChartData = (filter, rawData) => {
//     const labels = []
//     const datasets = Object.keys(rawData).map((key) => ({
//       label: key.charAt(0).toUpperCase() + key.slice(1),
//       data: [],
//       borderColor: colorScheme[key],
//       backgroundColor: `${colorScheme[key]}33`,
//       tension: 0.4,
//       fill: true,
//     }))

//     const currentDate = new Date()
//     const currentYear = currentDate.getFullYear()
//     const currentMonth = currentDate.getMonth()
//     const currentDay = currentDate.getDate()

//     if (filter === 'Year') {
//       const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//       for (let month = 0; month <= currentMonth; month++) {
//         labels.push(monthNames[month])
//         datasets.forEach((dataset) => {
//           const categoryData = rawData[dataset.label.toLowerCase()]
//           const yearData = categoryData && categoryData[currentYear]
//           const monthData = yearData && yearData[month]
//           let total = 0
//           if (monthData) {
//             Object.values(monthData).forEach((dayData) => {
//               Object.values(dayData).forEach((hourData) => {
//                 total += hourData
//               })
//             })
//           }
//           dataset.data.push(total)
//         })
//       }
//     } else if (filter === 'Month') {
//       const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
//       for (let day = 1; day <= daysInMonth; day++) {
//         labels.push(day.toString())
//         datasets.forEach((dataset) => {
//           const categoryData = rawData[dataset.label.toLowerCase()]
//           const yearData = categoryData && categoryData[currentYear]
//           const monthData = yearData && yearData[currentMonth]
//           const dayData = monthData && monthData[day]
//           let total = 0
//           if (dayData) {
//             Object.values(dayData).forEach((hourData) => {
//               total += hourData
//             })
//           }
//           dataset.data.push(total)
//         })
//       }
//     } else if (filter === 'Day') {
//       for (let hour = 0; hour < 24; hour++) {
//         labels.push(hour.toString().padStart(2, '0') + ':00')
//         datasets.forEach((dataset) => {
//           const categoryData = rawData[dataset.label.toLowerCase()]
//           const yearData = categoryData && categoryData[currentYear]
//           const monthData = yearData && yearData[currentMonth]
//           const dayData = monthData && monthData[currentDay]
//           const total = (dayData && dayData[hour]) || 0
//           dataset.data.push(total)
//         })
//       }
//     }

//     setChartData({ labels, datasets })
//   }

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Community App Statistics',
//         font: {
//           size: 20,
//           weight: 'bold',
//         },
//       },
//       tooltip: {
//         mode: 'index',
//         intersect: false,
//       },
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: timeFilter === 'Year' ? 'Month' : timeFilter === 'Month' ? 'Day of Month' : 'Hour',
//           font: {
//             size: 14,
//             weight: 'bold',
//           },
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'Count',
//           font: {
//             size: 14,
//             weight: 'bold',
//           },
//         },
//         beginAtZero: true,
//       },
//     },
//     interaction: {
//       mode: 'nearest',
//       axis: 'x',
//       intersect: false,
//     },
//   }

//   const fetchUsers = async (page) => {
//     try {
//       const response = await axiosInstance.get(`${backendUrl}/apis/userstatuszero?page=${page}`)
//       // const response = await axiosInstance.get(`/apis/userstatuszero?page=${page}`)
//       setUsers(response.data.users)
//       setUserTotalPages(response.data.totalPages)
//     } catch (error) {
//       console.error('Error fetching users:', error)
//       setError('Failed to fetch users')
//     }
//   }

//   const fetchBusinesses = async (page) => {
//     try {
//       const response = await axiosInstance.get(`${backendUrl}/apis/businessstatuszero?page=${page}`)
//       // const response = await axiosInstance.get(`/apis/businessstatuszero?page=${page}`)
//       setBusinesses(response.data.businesses)
//       setBusinessTotalPages(response.data.totalPages)
//     } catch (error) {
//       console.error('Error fetching businesses:', error)
//       setError('Failed to fetch businesses')
//     }
//   }

//   const fetchMagazines = async (page) => {
//     try {
//       const response = await axiosInstance.get(`${backendUrl}/apis/magazinesstatuszero?page=${page}`)
//       // const response = await axiosInstance.get(`/apis/magazinesstatuszero?page=${page}`)
//       setMagazines(response.data.publications)
//       setMagazineTotalPages(response.data.totalPages)
//     } catch (error) {
//       console.error('Error fetching magazines:', error)
//       setError('Failed to fetch magazines')
//     }
//   }

//   useEffect(() => {
//     fetchUsers(userPage)
//     fetchBusinesses(businessPage)
//     fetchMagazines(magazinePage)
//   }, [userPage, businessPage, magazinePage])

//   const handleRowClick = (id, type) => {
//     if (type === 'user') {
//       setSelectedUserId(selectedUserId === id ? null : id)
//       setSelectedBusinessId(null)
//       setSelectedMagazineId(null)
//     } else if (type === 'business') {
//       setSelectedBusinessId(selectedBusinessId === id ? null : id)
//       setSelectedUserId(null)
//       setSelectedMagazineId(null)
//     } else {
//       setSelectedMagazineId(selectedMagazineId === id ? null : id)
//       setSelectedUserId(null)
//       setSelectedBusinessId(null)
//     }
//   }

//   const handleDelete = async (id, type) => {
//     try {
//       const response = await axiosInstance.put(`${backendUrl}/apis/delete${type}/${id}`)
//       // const response = await axiosInstance.put(`/apis/delete${type}/${id}`)
//       if (response.data.status === 'true') {
//         if (type === 'user') {
//           fetchUsers(userPage)
//         } else if (type === 'business') {
//           fetchBusinesses(businessPage)
//         } else if (type === 'magazine') {
//           fetchMagazines(magazinePage)
//         }
//       } else {
//         console.error(`Failed to delete ${type}:`, response.data.message)
//       }
//     } catch (error) {
//       console.error(`Error deleting ${type}:`, error)
//     }
//   }

//   const handleToggle = async (id, type) => {
//     try {
//       const response = await axiosInstance.put(`${backendUrl}/apis/toggle${type}status/${id}`)
//       // const response = await axiosInstance.put(`/apis/toggle${type}status/${id}`)
//       if (response.data.status === 'true') {
//         if (type === 'user') {
//           fetchUsers(userPage)
//         } else if (type === 'business') {
//           fetchBusinesses(businessPage)
//         } else if (type === 'magazine') {
//           fetchMagazines(magazinePage)
//         }
//       } else {
//         console.error(`Failed to toggle ${type} status:`, response.data.message)
//       }
//     } catch (error) {
//       console.error(`Error toggling ${type} status:`, error)
//     }
//   }

//   const renderPagination = (currentPage, totalPages, setPage) => (
//     <div className="d-flex justify-content-end align-items-center mt-4">
//       {totalPages > 1 && (
//         <CPagination size="sm" className="mb-0">
//           <CPaginationItem
//             aria-label="Previous"
//             disabled={currentPage === 1}
//             onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//           >
//             Previous
//           </CPaginationItem>
//           {[...Array(totalPages).keys()].map((number) => (
//             <CPaginationItem
//               key={number + 1}
//               active={number + 1 === currentPage}
//               onClick={() => setPage(number + 1)}
//             >
//               {number + 1}
//             </CPaginationItem>
//           ))}
//           {currentPage < totalPages && (
//             <CPaginationItem
//               aria-label="Next"
//               onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//             >
//               Next
//             </CPaginationItem>
//           )}
//         </CPagination>
//       )}
//     </div>
//   )

//   const renderDetails = (item, type) => {
//     if (type === 'user') {
//       return (
//         <CCard className="bg-dark text-white border-0 mt-2">
//           <CCardBody>
//             <CRow>
//               <CCol md={6}>
//                 <p><strong>First Name:</strong> {item.firstName}</p>
//                 <p><strong>Last Name:</strong> {item.lastName}</p>
//                 <p><strong>Contact Number:</strong> {item.contactNumber}</p>
//                 <p><strong>Email:</strong> {item.email}</p>
//                 <p><strong>Date of Birth:</strong> {item.dateOfBirth}</p>
//                 <p><strong>Age:</strong> {item.age}</p>
//               </CCol>
//               <CCol md={6}>
//                 <p><strong>Education:</strong> {item.education}</p>
//                 <p><strong>Gender:</strong> {item.gender}</p>
//                 <p><strong>Address:</strong> {item.address}</p>
//                 <p><strong>Blood Group:</strong> {item.bloodGroup}</p>
//                 <p><strong>Country:</strong> {item.countryName}</p>
//                 <p><strong>State:</strong> {item.stateName}</p>
//                 <p><strong>City:</strong> {item.cityName}</p>
//               </CCol>
//             </CRow>
//             <strong>Photo :</strong>{' '}
//             {item.photo && (
//                                           <>
//                                             <div>
//                                               <img
//                                                 src={`${imageUrl}/${item.photo}`}
//                                                 alt="User Photo"
//                                                 style={{
//                                                   maxWidth: '100px',
//                                                   maxHeight: '100px',
//                                                   marginTop: '10px',
//                                                 }}
//                                               />
//                                             </div>
//                                           </>
//                                         )}
//           </CCardBody>
//         </CCard>
//       )
//     } else if (type === 'business') {
//       return (
//         <CCard className="bg-dark text-white border-0 mt-2">
//           <CCardBody>
//             <CRow>
//               <CCol md={6}>
//                 <p><strong>Business Title:</strong> {item.businessTitle}</p>
//                 <p><strong>Business Type:</strong> {item.businessType}</p>
//                 <p><strong>Contact Number:</strong> {item.contactNumber}</p>
//                 <p><strong>Email:</strong> {item.email}</p>
//                 <p><strong>Address:</strong> {item.address}</p>
//               </CCol>
//               <CCol md={6}>
//                 <p><strong>Description:</strong> {item.description}</p>
//                 <p><strong>Country:</strong> {item.countryName}</p>
//                 <p><strong>State:</strong> {item.stateName}</p>
//                 <p><strong>City:</strong> {item.cityName}</p>
//                 <p>
//                   <strong>Website:</strong>{' '}
//                   {item.website ? (
//                     <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-info">
//                       {item.website}
//                     </a>
//                   ) : (
//                     'N/A'
//                   )}
//                 </p>
//               </CCol>
//             </CRow>
//             <strong>Photo :</strong>{' '}
//             {item.photo && (
//                                           <>
//                                             <div>
//                                               <img
//                                                 src={`${imageUrl}/${item.photo}`}
//                                                 alt="Business Photo"
//                                                 style={{
//                                                   maxWidth: '100px',
//                                                   maxHeight: '100px',
//                                                   marginTop: '10px',
//                                                 }}
//                                               />
//                                             </div>
//                                           </>
//                                         )}
//           </CCardBody>
//         </CCard>
//       )
//     } else if (type === 'magazine') {
//       return (
//         <CCard className="bg-dark text-white border-0 mt-2">
//           <CCardBody>
//             <CRow>
//               <CCol md={6}>
//                 <p><strong>Title:</strong> {item.title}</p>
//                 <p><strong>Description:</strong> {item.description}</p>
//                 <p><strong>User Name:</strong> {item.userName}</p>
//                 <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
//               </CCol>
//               <CCol md={6}>
//                 <p>
//                   <strong>Magazine File:</strong>{' '}
//                   <a href={`${pdfUrl}/${item.magazine}`} target="_blank" rel="noopener noreferrer" className="text-info">
//                     View Magazine
//                   </a>
//                 </p>
//               </CCol>
//             </CRow>
//             <strong>Cover Photo :</strong>{' '}
//             {item.photo && (
//                                           <>
//                                             <div>
//                                               <img
//                                                 src={`${imageUrl}/${item.photo}`}
//                                                 alt="Cover Photo"
//                                                 style={{
//                                                   maxWidth: '100px',
//                                                   maxHeight: '100px',
//                                                   marginTop: '10px',
//                                                 }}
//                                               />
//                                             </div>
//                                           </>
//                                         )}
//           </CCardBody>
//         </CCard>
//       )
//     }
//   }

//   const renderTable = (data, type, currentPage, totalPages, setPage) => (
//     <CCard className="mb-5 shadow-sm border-0" style={{ borderRadius: '15px' }}>
//       <CCardHeader className="bg-transparent border-bottom-0 pt-4 pb-3">
//         <h4 className="mb-0 d-flex align-items-center text-primary">
//           <CIcon
//             icon={
//               type === 'user'
//                 ? cilPeople
//                 : type === 'business'
//                 ? cilBriefcase
//                 : cilBook
//             }
//             className="me-2"
//             size="xl"
//           />
//           {type === 'user'
//             ? 'Inactive Users'
//             : type === 'business'
//             ? 'Inactive Businesses'
//             : 'Inactive Magazines'}
//         </h4>
//       </CCardHeader>
//       <CCardBody className="px-4">
//         <CTable align="middle" borderless hover responsive className="mb-0">
//           <CTableHead>
//             <CTableRow className="text-uppercase small">
//               <CTableHeaderCell className="border-top-0 py-3">
//                 Name
//               </CTableHeaderCell>
//               <CTableHeaderCell className="border-top-0 py-3 text-end">
//                 Actions
//               </CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {data.map((item) => (
//               <React.Fragment
//                 key={
//                   type === 'user'
//                     ? item.userId
//                     : type === 'business'
//                     ? item.businessId
//                     : item.magazineId
//                 }
//               >
//                 <CTableRow
//                   onClick={() =>
//                     handleRowClick(
//                       type === 'user'
//                         ? item.userId
//                         : type === 'business'
//                         ? item.businessId
//                         : item.magazineId,
//                       type
//                     )
//                   }
//                   style={{ cursor: 'pointer' }}
//                 >
// <CTableDataCell>
//   <div className="d-flex align-items-center py-2">
//     {/* Conditional rendering for different types */}
//     {type === 'user' ? (
//       item.photo ? (
//         <img
//           src={`${imageUrl}/${item.photo}` || ''}
//           alt="photo"
//           style={{
//             width: '50px',
//             height: '50px',
//             objectFit: 'cover',
//             borderRadius: '50%',
//           }}
//         />
//       ) : (
//         <CAvatar color="primary" size="md" className="me-3">
//           {`${item.firstName[0].toUpperCase()}${item.lastName[0].toUpperCase()}`}
//         </CAvatar>
//       )
//     ) : type === 'business' ? (
//       item.photo ? (
//         <img
//           src={`${imageUrl}/${item.photo}`}
//           alt="photo"
//           style={{
//             width: '50px',
//             height: '50px',
//             objectFit: 'cover',
//             borderRadius: '50%',
//           }}
//         />
//       ) : (
//         <CAvatar color="info" size="md" className="me-3">
//           {item.businessTitle[0].toUpperCase()}
//         </CAvatar>
//       )
//     ) : item.photo ? (
//       <img
//         src={`${imageUrl}/${item.photo}`}
//         alt="photo"
//         style={{
//           width: '50px',
//           height: '50px',
//           objectFit: 'cover',
//           borderRadius: '50%',
//         }}
//       />
//     ) : (
//       <CAvatar color="warning" size="md" className="me-3">
//         {item.title[0].toUpperCase()}
//       </CAvatar>
//     )}
    
//     {/* Text content with added spacing */}
//     <div className="ms-3">
//       <div className="fw-semibold mb-1">
//         {type === 'user'
//           ? `${item.firstName} ${item.lastName}`
//           : type === 'business'
//           ? item.businessTitle
//           : item.title}
//       </div>
//       <div className="small text-medium-emphasis">
//         {type === 'user'
//           ? item.email
//           : type === 'business'
//           ? item.businessType
//           : item.userName}
//       </div>
//     </div>
//   </div>
// </CTableDataCell>

                  
//                   <CTableDataCell className="text-end">
//                     <div className="d-flex justify-content-end align-items-center">
//                     <div>
//                       <CFormSwitch
//                         className="me-3"
//                         checked={false}
//                         onChange={(e) => {
//                           e.stopPropagation();
//                           handleToggle(
//                             type === 'user'
//                               ? item.userId
//                               : type === 'business'
//                               ? item.businessId
//                               : item.magazineId,
//                             type
//                           );
//                         }}
//                       />
//                       </div>
//                       <CButton
//                         color="danger"
//                         size="sm"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDelete(
//                             type === 'user'
//                               ? item.userId
//                               : type === 'business'
//                               ? item.businessId
//                               : item.magazineId,
//                             type
//                           );
//                         }}
//                       >
//                         <CIcon icon={cilTrash} />
//                       </CButton>
//                     </div>
//                   </CTableDataCell>
//                 </CTableRow>
//                 <CTableRow>
//                   <CTableDataCell colSpan={2} className="p-0">
//                     <CCollapse
//                       visible={
//                         type === 'user'
//                           ? selectedUserId === item.userId
//                           : type === 'business'
//                           ? selectedBusinessId === item.businessId
//                           : selectedMagazineId === item.magazineId
//                       }
//                     >
//                       {renderDetails(item, type)}
//                     </CCollapse>
//                   </CTableDataCell>
//                 </CTableRow>
//               </React.Fragment>
//             ))}
//           </CTableBody>
//         </CTable>
//         {renderPagination(currentPage, totalPages, setPage)}
//       </CCardBody>
//     </CCard>
//   );

//   useEffect(() => {
//     if (users.length === 0 && userPage > 1) {
//       setUserPage((prevPage) => prevPage - 1)
//     }
//     if (businesses.length === 0 && businessPage > 1) {
//       setBusinessPage((prevPage) => prevPage - 1)
//     }
//     if (magazines.length === 0 && magazinePage > 1) {
//       setMagazinePage((prevPage) => prevPage - 1)
//     }
//   }, [users, businesses, magazines, userPage, businessPage, magazinePage])

//   return (
//     <>
//     <WidgetsDropdown className="mb-4" />
//       <CCard className="mb-4">
//         <CCardBody>
//           <CRow>
//             <CCol sm={5}>
//               <h4 id="traffic" className="card-title mb-0">
//                 Community App Statistics
//               </h4>
//             </CCol>
//             <CCol sm={7} className="d-none d-md-block">
//               <CButton color="primary" className="float-end">
//                 <CIcon icon={cilCloudDownload} />
//               </CButton>
//               <CButtonGroup className="float-end me-3">
//                 {['Day', 'Month', 'Year'].map((value) => (
//                   <CButton
//                     color="outline-secondary"
//                     key={value}
//                     className="mx-0"
//                     active={value === timeFilter}
//                     onClick={() => setTimeFilter(value)}
//                   >
//                     {value}
//                   </CButton>
//                 ))}
//               </CButtonGroup>
//             </CCol>
//           </CRow>
//           {isLoading ? (
//             <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
//               <CSpinner color="primary" />
//             </div>
//           ) : error ? (
//             <div className="text-center text-danger" style={{ height: '300px' }}>
//               {error}
//             </div>
//           ) : (
//             chartData && <Line options={chartOptions} data={chartData} />
//           )}
//         </CCardBody>
//       </CCard>
//       <WidgetsBrand className="mb-4" withCharts />
//       <CRow>
//         <CCol xs>
//           <CCard className="mb-4">
//             <CCardBody>
//               <div className="user-business-tables-container">
//                 {isLoading ? (
//                   <CSpinner color="primary" />
//                 ) : (
//                   <>
//                     {renderTable(users, 'user', userPage, userTotalPages, setUserPage)}
//                     {renderTable(businesses, 'business', businessPage, businessTotalPages, setBusinessPage)}
//                     {renderTable(magazines, 'magazine', magazinePage, magazineTotalPages, setMagazinePage)}
//                   </>
//                 )}
//               </div>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//     </>
//   )
// }

// export default Dashboard






























import React, { useState, useEffect, useCallback } from 'react'
import {
  CFormSwitch,
  CPagination,
  CPaginationItem,
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CCollapse,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilPeople, cilBriefcase, cilBook, cilTrash } from '@coreui/icons'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import axiosInstance from '../base/services/axiosInstance'
import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import { getBackendURL } from '../../util'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const colorScheme = {
  users: '#4CAF50',
  events: '#2196F3',
  matrimonials: '#E91E63',
  magazines: '#FF9800',
  businesses: '#9C27B0',
}

const imageUrl = import.meta.env.VITE_IMAGE_URL;
const pdfUrl = import.meta.env.VITE_PDF_URL;

const Dashboard = () => {
  const [chartData, setChartData] = useState(null)
  const [timeFilter, setTimeFilter] = useState('Month')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [users, setUsers] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [magazines, setMagazines] = useState([])
  const [userPage, setUserPage] = useState(1)
  const [businessPage, setBusinessPage] = useState(1)
  const [magazinePage, setMagazinePage] = useState(1)
  const [userTotalPages, setUserTotalPages] = useState(1)
  const [businessTotalPages, setBusinessTotalPages] = useState(1)
  const [magazineTotalPages, setMagazineTotalPages] = useState(1)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [selectedBusinessId, setSelectedBusinessId] = useState(null)
  const [selectedMagazineId, setSelectedMagazineId] = useState(null)
  const backendUrl = getBackendURL();

  const fetchAllData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const endpoints = [
        // `${backendUrl}/apis/totaluser/`,
        // `${backendUrl}/apis/totalevents/`,
        // `${backendUrl}/apis/totalMatrimonial`,
        // `${backendUrl}/apis/totalmagazine`,
        // `${backendUrl}/apis/totalbusiness`,

        `/apis/totaluser/`,
        `/apis/totalevents/`,
        `/apis/totalMatrimonial`,
        `/apis/totalmagazine`,
        `/apis/totalbusiness`,
      ]

      const results = await Promise.all(endpoints.map(url => fetch(url).then(res => res.json())))
      
      const processedData = {
        users: processCreatedDates(results[0].createdDates),
        events: processCreatedDates(results[1].createdDates),
        matrimonials: processCreatedDates(results[2].createdDates),
        magazines: processCreatedDates(results[3].createdDates),
        businesses: processCreatedDates(results[4].createdDates),
      }
      
      updateChartData(timeFilter, processedData)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to fetch data. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [timeFilter])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  const processCreatedDates = (dates) => {
    return dates.reduce((acc, dateString) => {
      if (!dateString) return acc
      const d = new Date(dateString)
      const year = d.getFullYear()
      const month = d.getMonth()
      const day = d.getDate()
      const hour = new Date(d.getTime() - (5 * 60 + 30) * 60 * 1000).getHours()

      if (!acc[year]) acc[year] = {}
      if (!acc[year][month]) acc[year][month] = {}
      if (!acc[year][month][day]) acc[year][month][day] = {}
      if (!acc[year][month][day][hour]) acc[year][month][day][hour] = 0

      acc[year][month][day][hour]++
      return acc
    }, {})
  }

  const updateChartData = (filter, rawData) => {
    const labels = []
    const datasets = Object.keys(rawData).map((key) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      data: [],
      borderColor: colorScheme[key],
      backgroundColor: `${colorScheme[key]}33`,
      tension: 0.4,
      fill: true,
    }))

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    const currentDay = currentDate.getDate()

    if (filter === 'Year') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      for (let month = 0; month <= currentMonth; month++) {
        labels.push(monthNames[month])
        datasets.forEach((dataset) => {
          const categoryData = rawData[dataset.label.toLowerCase()]
          const yearData = categoryData && categoryData[currentYear]
          const monthData = yearData && yearData[month]
          let total = 0
          if (monthData) {
            Object.values(monthData).forEach((dayData) => {
              Object.values(dayData).forEach((hourData) => {
                total += hourData
              })
            })
          }
          dataset.data.push(total)
        })
      }
    } else if (filter === 'Month') {
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
      for (let day = 1; day <= daysInMonth; day++) {
        labels.push(day.toString())
        datasets.forEach((dataset) => {
          const categoryData = rawData[dataset.label.toLowerCase()]
          const yearData = categoryData && categoryData[currentYear]
          const monthData = yearData && yearData[currentMonth]
          const dayData = monthData && monthData[day]
          let total = 0
          if (dayData) {
            Object.values(dayData).forEach((hourData) => {
              total += hourData
            })
          }
          dataset.data.push(total)
        })
      }
    } else if (filter === 'Day') {
      for (let hour = 0; hour < 24; hour++) {
        labels.push(hour.toString().padStart(2, '0') + ':00')
        datasets.forEach((dataset) => {
          const categoryData = rawData[dataset.label.toLowerCase()]
          const yearData = categoryData && categoryData[currentYear]
          const monthData = yearData && yearData[currentMonth]
          const dayData = monthData && monthData[currentDay]
          const total = (dayData && dayData[hour]) || 0
          dataset.data.push(total)
        })
      }
    }

    setChartData({ labels, datasets })
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Community App Statistics',
        font: {
          size: 20,
          weight: 'bold',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: timeFilter === 'Year' ? 'Month' : timeFilter === 'Month' ? 'Day of Month' : 'Hour',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  }

  const fetchUsers = async (page) => {
    try {
      const response = await axiosInstance.get(`/apis/userstatuszero?page=${page}`)
      // const response = await axiosInstance.get(`${backendUrl}/apis/userstatuszero?page=${page}`)
      setUsers(response.data.users)
      setUserTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to fetch users')
    }
  }

  const fetchBusinesses = async (page) => {
    try {
      const response = await axiosInstance.get(`/apis/businessstatuszero?page=${page}`)
      // const response = await axiosInstance.get(`${backendUrl}/apis/businessstatuszero?page=${page}`)
      setBusinesses(response.data.businesses)
      setBusinessTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching businesses:', error)
      setError('Failed to fetch businesses')
    }
  }

  const fetchMagazines = async (page) => {
    try {
      const response = await axiosInstance.get(`/apis/magazinesstatuszero?page=${page}`)
      // const response = await axiosInstance.get(`${backendUrl}/apis/magazinesstatuszero?page=${page}`)
      setMagazines(response.data.publications)
      setMagazineTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching magazines:', error)
      setError('Failed to fetch magazines')
    }
  }

  useEffect(() => {
    fetchUsers(userPage)
    fetchBusinesses(businessPage)
    fetchMagazines(magazinePage)
  }, [userPage, businessPage, magazinePage])

  const handleRowClick = (id, type) => {
    if (type === 'user') {
      setSelectedUserId(selectedUserId === id ? null : id)
      setSelectedBusinessId(null)
      setSelectedMagazineId(null)
    } else if (type === 'business') {
      setSelectedBusinessId(selectedBusinessId === id ? null : id)
      setSelectedUserId(null)
      setSelectedMagazineId(null)
    } else {
      setSelectedMagazineId(selectedMagazineId === id ? null : id)
      setSelectedUserId(null)
      setSelectedBusinessId(null)
    }
  }

  const handleDelete = async (id, type) => {
    try {
      const response = await axiosInstance.put(`/apis/delete${type}/${id}`)
      // const response = await axiosInstance.put(`${backendUrl}/apis/delete${type}/${id}`)
      if (response.data.status === 'true') {
        if (type === 'user') {
          fetchUsers(userPage)
        } else if (type === 'business') {
          fetchBusinesses(businessPage)
        } else if (type === 'magazine') {
          fetchMagazines(magazinePage)
        }
      } else {
        console.error(`Failed to delete ${type}:`, response.data.message)
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error)
    }
  }

  const handleToggle = async (id, type) => {
    try {
      const response = await axiosInstance.put(`/apis/toggle${type}status/${id}`)
      // const response = await axiosInstance.put(`${backendUrl}/apis/toggle${type}status/${id}`)
      if (response.data.status === 'true') {
        if (type === 'user') {
          fetchUsers(userPage)
        } else if (type === 'business') {
          fetchBusinesses(businessPage)
        } else if (type === 'magazine') {
          fetchMagazines(magazinePage)
        }
      } else {
        console.error(`Failed to toggle ${type} status:`, response.data.message)
      }
    } catch (error) {
      console.error(`Error toggling ${type} status:`, error)
    }
  }

  const renderPagination = (currentPage, totalPages, setPage) => (
    <div className="d-flex justify-content-end align-items-center mt-4">
      {totalPages > 1 && (
        <CPagination size="sm" className="mb-0">
          <CPaginationItem
            aria-label="Previous"
            disabled={currentPage === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </CPaginationItem>
          {[...Array(totalPages).keys()].map((number) => (
            <CPaginationItem
              key={number + 1}
              active={number + 1 === currentPage}
              onClick={() => setPage(number + 1)}
            >
              {number + 1}
            </CPaginationItem>
          ))}
          {currentPage < totalPages && (
            <CPaginationItem
              aria-label="Next"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </CPaginationItem>
          )}
        </CPagination>
      )}
    </div>
  )

  const renderDetails = (item, type) => {
    if (type === 'user') {
      return (
        <CCard className="bg-dark text-white border-0 mt-2">
          <CCardBody>
          <CRow className="mb-4">
  <CCol md={12} className="mb-3">
    <h5><strong>Parent Name:</strong> {item.parentFirstName} {item.parentLastName || ''}</h5>
  </CCol>

  <CCol md={6}>
    <p><strong>First Name:</strong> {item.firstName}</p>
    <p><strong>Last Name:</strong> {item.lastName}</p>
    <p><strong>Contact Number:</strong> {item.contactNumber}</p>
    <p><strong>Email:</strong> {item.email}</p>
    <p><strong>Date of Birth:</strong> {item.dateOfBirth}</p>
    <p><strong>Age:</strong> {item.age}</p>
  </CCol>

  <CCol md={6}>
    <p><strong>Education:</strong> {item.education}</p>
    <p><strong>Gender:</strong> {item.gender}</p>
    <p><strong>Address:</strong> {item.address}</p>
    <p><strong>Blood Group:</strong> {item.bloodGroup}</p>
    <p><strong>Country:</strong> {item.countryName}</p>
    <p><strong>State:</strong> {item.stateName}</p>
    <p><strong>City:</strong> {item.cityName}</p>
  </CCol>
</CRow>

            <strong>Photo :</strong>{' '}
            {item.photo && (
              <>
                <div>
                  <img
                    src={`${imageUrl}/${item.photo}`}
                    alt="User Photo"
                    style={{
                      maxWidth: '100px',
                      maxHeight: '100px',
                      marginTop: '10px',
                    }}
                  />
                </div>
              </>
            )}
          </CCardBody>
        </CCard>
      )
    } else if (type === 'business') {
      return (
        <CCard className="bg-dark text-white border-0 mt-2">
          <CCardBody>
            <CRow>
              <CCol md={6}>
                <p><strong>Business Title:</strong> {item.businessTitle}</p>
                <p><strong>Business Type:</strong> {item.businessType}</p>
                <p><strong>Contact Number:</strong> {item.contactNumber}</p>
                <p><strong>Email:</strong> {item.email}</p>
                <p><strong>Address:</strong> {item.address}</p>
              </CCol>
              <CCol md={6}>
                <p><strong>Description:</strong> {item.description}</p>
                <p><strong>Country:</strong> {item.countryName}</p>
                <p><strong>State:</strong> {item.stateName}</p>
                <p><strong>City:</strong> {item.cityName}</p>
                <p>
                  <strong>Website:</strong>{' '}
                  {item.website ? (
                    <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-info">
                      {item.website}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </p>
              </CCol>
            </CRow>
            <strong>Photo :</strong>{' '}
            {item.photo && (
              <>
                <div>
                  <img
                    src={`${imageUrl}/${item.photo}`}
                    alt="Business Photo"
                    style={{
                      maxWidth: '100px',
                      maxHeight: '100px',
                      marginTop: '10px',
                    }}
                  />
                </div>
              </>
            )}
          </CCardBody>
        </CCard>
      )
    } else if (type === 'magazine') {
      return (
        <CCard className="bg-dark text-white border-0 mt-2">
          <CCardBody>
            <CRow>
              <CCol md={6}>
                <p><strong>Title:</strong> {item.title}</p>
                <p><strong>Description:</strong> {item.description}</p>
                <p><strong>User Name:</strong> {item.userName}</p>
                <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
              </CCol>
              <CCol md={6}>
                <p>
                  <strong>Magazine File:</strong>{' '}
                  <a href={`${pdfUrl}/${item.magazine}`} target="_blank" rel="noopener noreferrer" className="text-info">
                    View Magazine
                  </a>
                </p>
              </CCol>
            </CRow>
            <strong>Cover Photo :</strong>{' '}
            {item.photo && (
              <>
                <div>
                  <img
                    src={`${imageUrl}/${item.photo}`}
                    alt="Cover Photo"
                    style={{
                      maxWidth: '100px',
                      maxHeight: '100px',
                      marginTop: '10px',
                    }}
                  />
                </div>
              </>
            )}
          </CCardBody>
        </CCard>
      )
    }
  }

  const renderTable = (data, type, currentPage, totalPages, setPage) => (
    <CCard className="mb-5 shadow-sm border-0" style={{ borderRadius: '15px' }}>
      <CCardHeader className="bg-transparent border-bottom-0 pt-4 pb-3">
        <h4 className="mb-0 d-flex align-items-center text-primary">
          <CIcon
            icon={
              type === 'user'
                ? cilPeople
                : type === 'business'
                ? cilBriefcase
                : cilBook
            }
            className="me-2"
            size="xl"
          />
          {type === 'user'
            ? 'Inactive Users'
            : type === 'business'
            ? 'Inactive Businesses'
            : 'Inactive Magazines'}
        </h4>
      </CCardHeader>
      <CCardBody className="px-4">
        {data.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted mb-0">
              No inactive {type === 'user' ? 'users' : type === 'business' ? 'businesses' : 'magazines'} found.
            </p>
          </div>
        ) : (
          <CTable align="middle" borderless hover responsive className="mb-0">
            <CTableHead>
              <CTableRow className="text-uppercase small">
                <CTableHeaderCell className="border-top-0 py-3">
                  Name
                </CTableHeaderCell>
                <CTableHeaderCell className="border-top-0 py-3 text-end">
                  Actions
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {data.map((item) => (
                <React.Fragment
                  key={
                    type === 'user'
                      ? item.userId
                      : type === 'business'
                      ? item.businessId
                      : item.magazineId
                  }
                >
                  <CTableRow
                    onClick={() =>
                      handleRowClick(
                        type === 'user'
                          ? item.userId
                          : type === 'business'
                          ? item.businessId
                          : item.magazineId,
                        type
                      )
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    <CTableDataCell>
                      <div className="d-flex align-items-center py-2">
                        {type === 'user' ? (
                          item.photo ? (
                            <img
                              src={`${imageUrl}/${item.photo}` || ''}
                              alt="photo"
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                              }}
                            />
                          ) : (
                            <CAvatar color="primary" size="md" className="me-3">
                              {`${item.firstName[0].toUpperCase()}${item.lastName[0].toUpperCase()}`}
                            </CAvatar>
                          )
                        ) : type === 'business' ? (
                          item.photo ? (
                            <img
                              src={`${imageUrl}/${item.photo}`}
                              alt="photo"
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                              }}
                            />
                          ) : (
                            <CAvatar color="info" size="md" className="me-3">
                              {item.businessTitle[0].toUpperCase()}
                            </CAvatar>
                          )
                        ) : item.photo ? (
                          <img
                            src={`${imageUrl}/${item.photo}`}
                            alt="photo"
                            style={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'cover',
                              borderRadius: '50%',
                            }}
                          />
                        ) : (
                          <CAvatar color="warning" size="md" className="me-3">
                            {item.title[0].toUpperCase()}
                          </CAvatar>
                        )}
                        
                        <div className="ms-3">
                          <div className="fw-semibold mb-1">
                            {type === 'user'
                              ? `${item.firstName} ${item.lastName}`
                              : type === 'business'
                              ? item.businessTitle
                              : item.title}
                          </div>
                          <div className="small text-medium-emphasis">
                            {type === 'user'
                              ? item.email
                              : type === 'business'
                              ? item.businessType
                              : item.userName}
                          </div>
                        </div>
                      </div>
                    </CTableDataCell>
                    
                    <CTableDataCell className="text-end">
                      <div className="d-flex justify-content-end align-items-center">
                        <div>
                          <CFormSwitch
                            className="me-3"
                            checked={false}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleToggle(
                                type === 'user'
                                  ? item.userId
                                  : type === 'business'
                                  ? item.businessId
                                  : item.magazineId,
                                type
                              );
                            }}
                          />
                        </div>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(
                              type === 'user'
                                ? item.userId
                                : type === 'business'
                                ? item.businessId
                                : item.magazineId,
                              type
                            );
                          }}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell colSpan={2} className="p-0">
                      <CCollapse
                        visible={
                          type === 'user'
                            ? selectedUserId === item.userId
                            : type === 'business'
                            ? selectedBusinessId === item.businessId
                            : selectedMagazineId === item.magazineId
                        }
                      >
                        {renderDetails(item, type)}
                      </CCollapse>
                    </CTableDataCell>
                  </CTableRow>
                </React.Fragment>
              ))}
            </CTableBody>
          </CTable>
        )}
        {renderPagination(currentPage, totalPages, setPage)}
      </CCardBody>
    </CCard>
  );

  useEffect(() => {
    if (users.length === 0 && userPage > 1) {
      setUserPage((prevPage) => prevPage - 1)
    }
    if (businesses.length === 0 && businessPage > 1) {
      setBusinessPage((prevPage) => prevPage - 1)
    }
    if (magazines.length === 0 && magazinePage > 1) {
      setMagazinePage((prevPage) => prevPage - 1)
    }
  }, [users, businesses, magazines, userPage, businessPage, magazinePage])

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Community App Statistics
              </h4>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Day', 'Month', 'Year'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === timeFilter}
                    onClick={() => setTimeFilter(value)}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
              <CSpinner color="primary" />
            </div>
          ) : error ? (
            <div className="text-center text-danger" style={{ height: '300px' }}>
              {error}
            </div>
          ) : (
            chartData && <Line options={chartOptions} data={chartData} />
          )}
        </CCardBody>
      </CCard>
      <WidgetsBrand className="mb-4" withCharts />
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardBody>
              <div className="user-business-tables-container">
                {isLoading ? (
                  <CSpinner color="primary" />
                ) : (
                  <>
                    {renderTable(users, 'user', userPage, userTotalPages, setUserPage)}
                    {renderTable(businesses, 'business', businessPage, businessTotalPages, setBusinessPage)}
                    {renderTable(magazines, 'magazine', magazinePage, magazineTotalPages, setMagazinePage)}
                  </>
                )}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard

