// import React, { useState, useEffect } from 'react'
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CRow,
//   CForm,
//   CFormInput,
//   CFormSelect,
//   CButton,
//   CImage,
// } from '@coreui/react'
// import { getBackendURL } from '../../../util'
// import axiosInstance from '../services/axiosInstance'
// const imageUrl = import.meta.env.VITE_IMAGE_URL;
// const Profile = () => {
//     const backendUrl = getBackendURL();
//   const [user, setUser] = useState(null)
//   const [isEditing, setIsEditing] = useState(false)
//   const [formData, setFormData] = useState({})

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const userId = localStorage.getItem('userId');
//         if (!userId) {
//           console.error('User ID not found in localStorage');
//           return;
//         }
  
//         // Use axiosInstance for the API call
//         const response = await axiosInstance.get(`${backendUrl}/apis/getcurrentuser`, {
//           params: { userId }
//         });
  
//         if (response.data && response.data.status === "true") {
//           console.log(response.data.user);
//           setUser(response.data.user);
//           setFormData(response.data.user);
//         } else {
//           console.error('Unexpected response structure:', response);
//         }
//       } catch (error) {
//         console.error('Error fetching user:', error);
//       }
//     };
  
//     fetchUser();
//   }, []);
  

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axiosInstance.put(`${backendUrl}/apis/edituser/${formData.userId}`, formData, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
  
//       if (response.data && response.data.status === "true") {
//         setUser(formData);
//         setIsEditing(false);
//       } else {
//         console.error('Unexpected response structure:', response);
//       }
//     } catch (error) {
//       console.error('Error updating user:', error);
//     }
//   };
  

//   if (!user) return <div>Loading...</div>

//   return (
//     <CRow>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>Profile Information</strong>
//             {!isEditing && (
//               <CButton 
//                 color="primary" 
//                 className="float-end"
//                 onClick={() => setIsEditing(true)}
//               >
//                 Edit Profile
//               </CButton>
//             )}
//           </CCardHeader>
//           <CCardBody>
//             <CForm onSubmit={handleSubmit}>
//               <CRow className="mb-4 align-items-center">
//                 <CCol md={3} className="text-center">
//                   <CImage
//                     rounded
//                     src={`${imageUrl}/${user.photo}`}
//                     width={150}
//                     height={150}
//                   />
//                 </CCol>
//                 <CCol md={9}>
//                   <CRow className="mb-3">
//                     <CCol md={6}>
//                       <CFormInput
//                         label="First Name"
//                         name="firstName"
//                         value={isEditing ? formData.firstName : user.firstName}
//                         onChange={handleInputChange}
//                         disabled={!isEditing}
//                       />
//                     </CCol>
//                     <CCol md={6}>
//                       <CFormInput
//                         label="Last Name"
//                         name="lastName"
//                         value={isEditing ? formData.lastName : user.lastName}
//                         onChange={handleInputChange}
//                         disabled={!isEditing}
//                       />
//                     </CCol>
//                   </CRow>
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <CFormInput
//                     label="Email"
//                     type="email"
//                     name="email"
//                     value={isEditing ? formData.email : user.email}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                   />
//                 </CCol>
//                 <CCol md={6}>
//                   <CFormInput
//                     label="Contact Number"
//                     name="contactNumber"
//                     value={user.contactNumber}
//                     disabled={true}
//                   />
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <CFormInput
//                     label="Date of Birth"
//                     type="date"
//                     name="dateOfBirth"
//                     value={isEditing 
//                       ? formData.dateOfBirth?.split('T')[0] 
//                       : user.dateOfBirth?.split('T')[0]
//                     }
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                   />
//                 </CCol>
//                 <CCol md={6}>
//                   <CFormSelect
//                     label="Gender"
//                     name="gender"
//                     value={isEditing ? formData.gender : user.gender}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                     options={[
//                       { label: 'Select Gender', value: '' },
//                       { label: 'Male', value: 'Male' },
//                       { label: 'Female', value: 'Female' },
//                       { label: 'Other', value: 'Other' },
//                     ]}
//                   />
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <CFormSelect
//                     label="Blood Group"
//                     name="bloodGroup"
//                     value={isEditing ? formData.bloodGroup : user.bloodGroup}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                     options={[
//                       { label: 'Select Blood Group', value: '' },
//                       { label: 'A+', value: 'A+' },
//                       { label: 'A-', value: 'A-' },
//                       { label: 'B+', value: 'B+' },
//                       { label: 'B-', value: 'B-' },
//                       { label: 'O+', value: 'O+' },
//                       { label: 'O-', value: 'O-' },
//                       { label: 'AB+', value: 'AB+' },
//                       { label: 'AB-', value: 'AB-' },
//                     ]}
//                   />
//                 </CCol>
//                 <CCol md={6}>
//                   <CFormInput
//                     label="Education"
//                     name="education"
//                     value={isEditing ? formData.education : user.education}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                   />
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={12}>
//                   <CFormInput
//                     label="Address"
//                     name="address"
//                     value={isEditing ? formData.address : user.address}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                   />
//                 </CCol>
//               </CRow>

//               {isEditing && (
//                 <CRow>
//                   <CCol>
//                     <CButton type="submit" color="primary" className="me-2">
//                       Save Changes
//                     </CButton>
//                     <CButton 
//                       color="secondary"
//                       onClick={() => {
//                         setIsEditing(false)
//                         setFormData(user)
//                       }}
//                     >
//                       Cancel
//                     </CButton>
//                   </CCol>
//                 </CRow>
//               )}
//             </CForm>
//           </CCardBody>
//         </CCard>
//       </CCol>
//     </CRow>
//   )
// }

// export default Profile














import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CImage,
  CListGroup,
  CListGroupItem,
  CContainer,
  CSpinner,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilEnvelopeClosed,
  cilPhone,
  cilCalendar,
  cilColorBorder,
  cilEducation,
  cilLocationPin,
  cilPencil,
  cilDrop,
  cilBriefcase
} from '@coreui/icons'
import axiosInstance from '../services/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { getBackendURL } from '../../../util'

const imageUrl = import.meta.env.VITE_IMAGE_URL

const ViewProfile = () => {
  const backendUrl = getBackendURL()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const userId = localStorage.getItem('userId')
        if (!userId) {
          throw new Error('User ID not found in localStorage')
        }

        const response = await axiosInstance.get(`/apis/getcurrentuser`, {
        // const response = await axiosInstance.get(`${backendUrl}/apis/getcurrentuser`, {
          params: { userId }
        })

        if (response.data && response.data.status === "true") {
          console.log(response.data.user)
          setUser(response.data.user)
        } else {
          throw new Error('Unexpected response structure')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        setError('Failed to load user profile. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const calculateAge = (dateOfBirth) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  if (loading) {
    return (
      <CContainer className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <CSpinner color="primary" />
      </CContainer>
    )
  }

  if (error) {
    return (
      <CContainer>
        <CAlert color="danger">{error}</CAlert>
      </CContainer>
    )
  }

  if (!user) {
    return (
      <CContainer>
        <CAlert color="warning">No user data available.</CAlert>
      </CContainer>
    )
  }

  return (
    <CContainer>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Profile Information</h2>
          <CButton 
            color="primary" 
            variant="outline"
            onClick={() => navigate('/base/edit-profile')}
          >
            <CIcon icon={cilPencil} className="me-2" />
            Edit Profile
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={4} className="text-center mb-4">
              <CImage
                rounded
                src={`${imageUrl}/${user.photo}`}
                width={200}
                height={200}
                alt="Profile"
                className="img-fluid mb-3 border border-3 border-primary"
              />
              <h3>{user.firstName} {user.lastName}</h3>
            </CCol>
            <CCol md={8}>
              <CListGroup flush>
                <CRow>
                  <CCol md={6}>
                    <ProfileItem icon={cilEnvelopeClosed} label="Email" value={user.email || 'NA'} />
                    <ProfileItem icon={cilPhone} label="Contact Number" value={user.contactNumber || 'NA'} />
                    <ProfileItem icon={cilCalendar} label="Date of Birth" value={new Date(user.dateOfBirth).toLocaleDateString() || 'NA'} />
                    <ProfileItem icon={cilUser} label="Age" value={`${calculateAge(user.dateOfBirth)} years` || 'NA'} />
                    <ProfileItem icon={cilBriefcase} label="Occupation" value={user.occupation || 'NA'} />
                  </CCol>
                  <CCol md={6}>
                    <ProfileItem icon={cilColorBorder} label="Gender" value={user.gender || 'NA'} />
                    <ProfileItem icon={cilDrop} label="Blood Group" value={user.bloodGroup|| 'NA'} />
                    <ProfileItem icon={cilEducation} label="Education" value={user.education || 'NA'} />
                    <ProfileItem icon={cilLocationPin} label="Address" value={user.address || 'NA'} />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md={12}>
                    <ProfileItem 
                      icon={cilLocationPin} 
                      label="Location" 
                      value={`${user.cityName || ''}, ${user.stateName || ''}, ${user.countryName || ''}`} 
                    />
                  </CCol>
                </CRow>
              </CListGroup>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

const ProfileItem = ({ icon, label, value }) => (
  <CListGroupItem className="d-flex align-items-center py-3">
    <CIcon icon={icon} size="xl" className="me-3 text-primary" />
    <div>
      <div className="text-medium-emphasis small">{label}</div>
      <div className="fw-bold">{value}</div>
    </div>
  </CListGroupItem>
)

export default ViewProfile