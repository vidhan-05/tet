import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CSpinner,
  CAlert,
  CImage
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSave, cilX } from '@coreui/icons'
import axiosInstance from '../services/axiosInstance'
import { getBackendURL } from '../../../util'

const EditProfile = () => {
  const backendUrl = getBackendURL()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    bloodGroup: '',
    education: '',
    address: '',
    countryId: '',
    stateId: '',
    cityId: '',
    photo: null,
    occupation : '',
  })
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [formErrors, setFormErrors] = useState({})
  const imageUrl = import.meta.env.VITE_IMAGE_URL

  useEffect(() => {
    fetchUserData()
    fetchCountries()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const userId = localStorage.getItem('userId')
      if (!userId) {
        throw new Error('User ID not found in localStorage')
      }

      // const response = await axiosInstance.get(`${backendUrl}/apis/getcurrentuser`, {
      const response = await axiosInstance.get(`/apis/getcurrentuser`, {
        params: { userId }
      })

      if (response.data && response.data.status === "true") {
        const userData = response.data.user
        setUser(userData)

        if (userData.countryId) {
          await fetchStates(userData.countryId)
        }
        if (userData.stateId) {
          await fetchCities(userData.stateId)
        }
      } else {
        throw new Error('Unexpected response structure')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setError('Failed to load user profile. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const fetchCountries = async () => {
    try {
      // const response = await axiosInstance.get(`${backendUrl}/apis/countries`)
      const response = await axiosInstance.get(`/apis/countries`)
      setCountries(response.data)
    } catch (error) {
      console.error('Error fetching countries:', error)
      setError('Failed to load countries. Please try again later.')
    }
  }

  const fetchStates = async (countryId) => {
    try {
      // const response = await axiosInstance.get(`${backendUrl}/apis/states/${countryId}`)
      const response = await axiosInstance.get(`/apis/states/${countryId}`)
      setStates(response.data)
    } catch (error) {
      console.error('Error fetching states:', error)
      setError('Failed to load states. Please try again later.')
    }
  }

  const fetchCities = async (stateId) => {
    try {
      // const response = await axiosInstance.get(`${backendUrl}/apis/cities/${stateId}`)
      const response = await axiosInstance.get(`/apis/cities/${stateId}`)
      setCities(response.data)
    } catch (error) {
      console.error('Error fetching cities:', error)
      setError('Failed to load cities. Please try again later.')
    }
  }

  const handleInputChange = async (e) => {
    const { name, value, type, files } = e.target
    if (name === 'contactNumber') return // Prevent changes to contact number
    if (type === 'file') {
      setUser(prevUser => ({ ...prevUser, [name]: files[0] }))
    } else {
      setUser(prevUser => ({ ...prevUser, [name]: value }))
    }

    // if (name === 'countryId' && value !== user.countryId) {
    //   setUser(prevUser => ({ ...prevUser, stateId: '', cityId: '' }))
    //   setCities([])
    //   await fetchStates(value)
    // } else if (name === 'stateId' && value !== user.stateId) {
    //   setUser(prevUser => ({ ...prevUser, cityId: '' }))
    //   await fetchCities(value)
    // }
  }

  const validateForm = () => {
    const errors = {}
    if (!user.firstName) errors.firstName = 'First Name is required'
    if (!user.lastName) errors.lastName = 'Last Name is required'
    if (!user.email) errors.email = 'Email is required'
    if (!user.gender) errors.gender = 'Gender is required'
    if (!user.address) errors.address = 'Address is required'
    if (!user.countryId) errors.countryId = 'Country is required'
    if (!user.stateId) errors.stateId = 'State is required'
    if (!user.cityId) errors.cityId = 'City is required'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submit handler called')
    console.log('user: ', user)

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    const formData = new FormData()
    
    Object.keys(user).forEach((key) => {
      if (user[key] !== null && user[key] !== undefined) {
        if (key === 'photo' && typeof user[key] === 'object') {
          formData.append(key, user[key])
        } else if (key === 'countryId' || key === 'stateId' || key === 'cityId') {
          // Ensure we're sending the ID, not the name
          
          
          formData.append(key, user[key])
        } else {
          formData.append(key, user[key])
        }
      }
    })

    try {
      console.log('FormData entries:')
      for (let [key, value] of formData.entries()) {
        console.log(key, value)
      }
      setLoading(true)
      const response = await axiosInstance.put(
        // `${backendUrl}/apis/edituser/${user.userId}`,
        `/apis/edituser/${user.userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        }
      )

      console.log('Edit Response:', response)

      if (response.status === 200 || response.status === 201) {
        alert('User updated successfully')
        navigate('/base/profile')
      } else {
        throw new Error('Error updating user')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      if (error.response && error.response.data && error.response.data.error) {
        if (error.response.data.error.includes('foreign key constraint fails')) {
          setError('Invalid country, state, or city selection. Please check your selections.')
        } else {
          setError(error.response.data.error)
        }
      } else if (error.request) {
        setError('No response received from server. Please try again later.')
      } else {
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <CSpinner color="primary" />
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Edit Profile</strong>
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger">{error}</CAlert>}
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    label="First Name"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.firstName && <div className="text-danger">{formErrors.firstName}</div>}
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Last Name"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.lastName && <div className="text-danger">{formErrors.lastName}</div>}
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    label="Email"
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Contact Number"
                    name="contactNumber"
                    value={user.contactNumber}
                    disabled
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    label="Date of Birth"
                    type="date"
                    name="dateOfBirth"
                    value={user.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''}
                    onChange={handleInputChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormSelect
                    label="Gender"
                    name="gender"
                    value={user.gender}
                    onChange={handleInputChange}
                    options={[
                      { label: 'Select Gender', value: '' },
                      { label: 'Male', value: 'Male' },
                      { label: 'Female', value: 'Female' },
                      { label: 'Other', value: 'Other' },
                    ]}
                    required
                  />
                  {formErrors.gender && <div className="text-danger">{formErrors.gender}</div>}
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormSelect
                    label="Blood Group"
                    name="bloodGroup"
                    value={user.bloodGroup}
                    onChange={handleInputChange}
                    options={[
                      { label: 'Select Blood Group', value: '' },
                      { label: 'A+', value: 'A+' },
                      { label: 'A-', value: 'A-' },
                      { label: 'B+', value: 'B+' },
                      { label: 'B-', value: 'B-' },
                      { label: 'O+', value: 'O+' },
                      { label: 'O-', value: 'O-' },
                      { label: 'AB+', value: 'AB+' },
                      { label: 'AB-', value: 'AB-' },
                    ]}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Education"
                    name="education"
                    value={user.education}
                    onChange={handleInputChange}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    label="Address"
                    name="address"
                    value={user.address}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.address && <div className="text-danger">{formErrors.address}</div>}
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    label="Occupation"
                    name="occupation"
                    value={user.occupation}
                    onChange={handleInputChange}
                  
                  />
                  {formErrors.address && <div className="text-danger">{formErrors.address}</div>}
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={4}>
                    
                  <CFormSelect
                    label="Country"
                    name="countryId"
                    value={user.countryId}
                    onChange={handleInputChange}
                    options={[
                      { label: "Select Country", value: "" },
                      ...countries.map(country => ({ label: country.name, value: country.countryId }))
                    ]}
                    required
                  />
                  {formErrors.countryId && <div className="text-danger">{formErrors.countryId}</div>}
                </CCol>
                <CCol md={4}>
                  <CFormSelect
                    label="State"
                    name="stateId"
                    value={user.stateId}
                    onChange={handleInputChange}
                    options={[
                      { label: "Select State", value: "" },
                      ...states.map(state => ({ label: state.name, value: state.stateId}))
                    ]}
                    disabled={!user.countryId}
                    required
                  />
                  {formErrors.stateId && <div className="text-danger">{formErrors.stateId}</div>}
                </CCol>
                <CCol md={4}>
                  <CFormSelect
                    label="City"
                    name="cityId"
                    value={user.cityId}
                    onChange={handleInputChange}
                    options={[
                      { label: "Select City", value: "" },
                      ...cities.map(city => ({ label: city.name, value: city.cityId}))
                    ]}
                    disabled={!user.stateId}
                    required
                  />
                  {formErrors.cityId && <div className="text-danger">{formErrors.cityId}</div>}
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    type="file"
                    label="Profile Photo"
                    name="photo"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                </CCol>
                <CCol md={6}>
                  {user.photo && (
                    <CImage
                      src={typeof user.photo === 'string' ? `${imageUrl}/${user.photo}` : URL.createObjectURL(user.photo)}
                      alt="Profile"
                      width={100}
                      height={100}
                    />
                  )}
                </CCol>
              </CRow>

              <CRow className="mt-4">
                <CCol>
                  <CButton type="submit" color="primary">
                    <CIcon icon={cilSave} className="me-2" />
                    Save Changes
                  </CButton>
                  <CButton 
                    color="secondary" 
                    className="ms-2" 
                    onClick={() => navigate('/base/profile')}
                  >
                    <CIcon icon={cilX} className="me-2" />
                    Cancel
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default EditProfile



























// import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CRow,
//   CForm,
//   CFormInput,
//   CFormSelect,
//   CFormCheck,
//   CButton,
//   CSpinner,
//   CAlert,
//   CImage
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import { cilSave, cilX } from '@coreui/icons'
// import axiosInstance from '../services/axiosInstance'
// import { getBackendURL } from '../../../util'

// const EditProfile = () => {
//   const backendUrl = getBackendURL()
//   const navigate = useNavigate()
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [user, setUser] = useState({
//     userId: '',
//     firstName: '',
//     lastName: '',
//     contactNumber: '',
//     email: '',
//     dateOfBirth: '',
//     age: '',
//     gender: '',
//     bloodGroup: '',
//     education: '',
//     address: '',
//     countryId: '',
//     stateId: '',
//     cityId: '',
//     parentId: '',
//     isAdmin: false,
//     userType: '',
//     photo: null
//   })
//   const [countries, setCountries] = useState([])
//   const [states, setStates] = useState([])
//   const [cities, setCities] = useState([])
//   const [formErrors, setFormErrors] = useState({})
//   const [userOptions, setUserOptions] = useState([])
//   const imageUrl = import.meta.env.VITE_IMAGE_URL

//   useEffect(() => {
//     fetchUserData()
//     fetchCountries()
//     fetchUserOptions()
//   }, [])

//   const fetchUserData = async () => {
//     try {
//       setLoading(true)
//       const userId = localStorage.getItem('userId')
//       if (!userId) {
//         throw new Error('User ID not found in localStorage')
//       }

//       const response = await axiosInstance.get(`${backendUrl}/apis/getcurrentuser`, {
//         params: { userId }
//       })

//       if (response.data && response.data.status === "true") {
//         setUser(response.data.user)
//         if (response.data.user.countryId) {
//           await fetchStates(response.data.user.countryId)
//         }
//         if (response.data.user.stateId) {
//           await fetchCities(response.data.user.stateId)
//         }
//       } else {
//         throw new Error('Unexpected response structure')
//       }
//     } catch (error) {
//       console.error('Error fetching user data:', error)
//       setError('Failed to load user profile. Please try again later.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchCountries = async () => {
//     try {
//       const response = await axiosInstance.get(`${backendUrl}/apis/countries`)
//       setCountries(response.data)
//     } catch (error) {
//       console.error('Error fetching countries:', error)
//       setError('Failed to load countries. Please try again later.')
//     }
//   }

//   const fetchStates = async (countryId) => {
//     try {
//       const response = await axiosInstance.get(`${backendUrl}/apis/states/${countryId}`)
//       setStates(response.data)
//     } catch (error) {
//       console.error('Error fetching states:', error)
//       setError('Failed to load states. Please try again later.')
//     }
//   }

//   const fetchCities = async (stateId) => {
//     try {
//       const response = await axiosInstance.get(`${backendUrl}/apis/cities/${stateId}`)
//       setCities(response.data)
//     } catch (error) {
//       console.error('Error fetching cities:', error)
//       setError('Failed to load cities. Please try again later.')
//     }
//   }

//   const fetchUserOptions = async () => {
//     try {
//       const response = await axiosInstance.get(`${backendUrl}/apis/users`)
//       setUserOptions(response.data)
//     } catch (error) {
//       console.error('Error fetching user options:', error)
//       setError('Failed to load user options. Please try again later.')
//     }
//   }

//   const handleInputChange = async (e) => {
//     const { name, value, type, checked, files } = e.target
//     if (type === 'file') {
//       setUser(prevUser => ({ ...prevUser, [name]: files[0] }))
//     } else if (type === 'checkbox') {
//       setUser(prevUser => ({ ...prevUser, [name]: checked ? 1 : 0 }))
//     } else {
//       setUser(prevUser => ({ ...prevUser, [name]: value }))
//     }

//     if (name === 'countryId' && value !== user.countryId) {
//       await fetchStates(value)
//       setUser(prevUser => ({ ...prevUser, stateId: '', cityId: '' }))
//     } else if (name === 'stateId' && value !== user.stateId) {
//       await fetchCities(value)
//       setUser(prevUser => ({ ...prevUser, cityId: '' }))
//     } else if (name === 'dateOfBirth') {
//       const age = calculateAge(value)
//       setUser(prevUser => ({ ...prevUser, age: age }))
//     }
//   }

//   const calculateAge = (dateOfBirth) => {
//     const today = new Date()
//     const birthDate = new Date(dateOfBirth)
//     let age = today.getFullYear() - birthDate.getFullYear()
//     const m = today.getMonth() - birthDate.getMonth()
//     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//       age--
//     }
//     return age
//   }

//   const validateForm = () => {
//     const errors = {}
//     if (!user.firstName) errors.firstName = 'First Name is required'
//     if (!user.lastName) errors.lastName = 'Last Name is required'
//     if (!user.email) errors.email = 'Email is required'
//     if (!user.gender) errors.gender = 'Gender is required'
//     if (!user.address) errors.address = 'Address is required'
//     if (!user.countryId) errors.countryId = 'Country is required'
//     if (!user.stateId) errors.stateId = 'State is required'
//     if (!user.cityId) errors.cityId = 'City is required'
//     if (!user.dateOfBirth) errors.dateOfBirth = 'Date of Birth is required'
//     if (!user.userType) errors.userType = 'User Type is required'
//     return errors
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     console.log('Form submit handler called')
//     console.log('user: ', user)

//     const errors = validateForm()
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors)
//       return
//     }

//     const formData = new FormData()

//     Object.keys(user).forEach((key) => {
//       if (user[key] !== null && user[key] !== undefined) {
//         if (key === 'photo') {
//           if (user[key] instanceof File) {
//             formData.append(key, user[key])
//           }
//         } else {
//           formData.append(key, user[key])
//         }
//       }
//     })

//     try {
//       setLoading(true)
//       const response = await axiosInstance.put(
//         `${backendUrl}/apis/edituser/${user.userId}`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//           timeout: 30000,
//         }
//       )

//       console.log('Edit Response:', response)

//       if (response.status === 200 || response.status === 201) {
//         alert('User updated successfully')
//         navigate('/base/profile')
//       } else {
//         throw new Error('Error updating user')
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error)
//       if (error.response) {
//         setError(error.response.data.error || 'Server Error')
//       } else if (error.request) {
//         setError('No response received from server. Please try again later.')
//       } else {
//         setError(error.message)
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const formatDate = (date) => {
//     if (!date) return ''
//     return new Date(date).toISOString().split('T')[0]
//   }

//   const getMaxDateOfBirth = () => {
//     const today = new Date()
//     today.setFullYear(today.getFullYear() - 18)
//     return today.toISOString().split('T')[0]
//   }

//   if (loading) {
//     return <CSpinner color="primary" />
//   }

//   if (error) {
//     return <CAlert color="danger">{error}</CAlert>
//   }

//   return (
//     <CRow>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>Edit Profile</strong>
//           </CCardHeader>
//           <CCardBody>
//             <CForm onSubmit={handleSubmit}>
//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <CFormSelect
//                     id="userType"
//                     name="userType"
//                     value={user.userType}
//                     onChange={handleInputChange}
//                     label="User Type"
//                     required
//                   >
//                     <option value="">Select User Type</option>
//                     <option value="user">User</option>
//                     <option value="family head">Family Head</option>
//                   </CFormSelect>
//                   {formErrors.userType && <div className="text-danger">{formErrors.userType}</div>}
//                 </CCol>
//                 <CCol md={6}>
//                   <CFormSelect
//                     id="parentId"
//                     name="parentId"
//                     value={user.parentId || '0'}
//                     onChange={handleInputChange}
//                     label="Select Parent User"
//                     disabled={user.userType !== 'user'}
//                   >
//                     <option value="">Select Parent User</option>
//                     {userOptions.map((user) => (
//                       <option key={user.userId} value={user.userId}>
//                         {user.firstName} {user.lastName} - {user.contactNumber}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <CFormInput
//                     label="First Name"
//                     name="firstName"
//                     value={user.firstName}
//                     onChange={handleInputChange}
//                     required
//                   />
//                   {formErrors.firstName && <div className="text-danger">{formErrors.firstName}</div>}
//                 </CCol>
//                 <CCol md={6}>
//                   <CFormInput
//                     label="Last Name"
//                     name="lastName"
//                     value={user.lastName}
//                     onChange={handleInputChange}
//                     required
//                   />
//                   {formErrors.lastName && <div className="text-danger">{formErrors.lastName}</div>}
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <CFormInput
//                     label="Contact Number"
//                     name="contactNumber"
//                     value={user.contactNumber}
//                     disabled
//                   />
//                 </CCol>
//                 <CCol md={6}>
//                   <CFormInput
//                     label="Email"
//                     type="email"
//                     name="email"
//                     value={user.email}
//                     onChange={handleInputChange}
//                     required
//                   />
//                   {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <CFormSelect
//                     label="Gender"
//                     name="gender"
//                     value={user.gender}
//                     onChange={handleInputChange}
//                     options={[
//                       { label: 'Select Gender', value: '' },
//                       { label: 'Male', value: 'male' },
//                       { label: 'Female', value: 'female' },
//                       { label: 'Other', value: 'other' },
//                     ]}
//                     required
//                   />
//                   {formErrors.gender && <div className="text-danger">{formErrors.gender}</div>}
//                 </CCol>
//                 <CCol md={6}>
//                   <CFormInput
//                     label="Date of Birth"
//                     type="date"
//                     name="dateOfBirth"
//                     value={formatDate(user.dateOfBirth)}
//                     onChange={handleInputChange}
//                     max={user.userType !== 'user' ? getMaxDateOfBirth() : undefined}
//                     required
//                   />
//                   {formErrors.dateOfBirth && <div className="text-danger">{formErrors.dateOfBirth}</div>}
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <CFormInput
//                     label="Age"
//                     type="number"
//                     name="age"
//                     value={user.age}
//                     onChange={handleInputChange}
//                     readOnly
//                   />
//                 </CCol>
//                 <CCol md={6}>
//                   <CFormSelect
//                     label="Blood Group"
//                     name="bloodGroup"
//                     value={user.bloodGroup}
//                     onChange={handleInputChange}
//                     options={[
//                       { label: 'Select Blood Group', value: '' },
//                       { label: 'A+', value: 'A+' },
//                       { label: 'A-', value: 'A-' },
//                       { label: 'B+', value: 'B+' },
//                       { label: 'B-', value: 'B-' },
//                       { label: 'AB+', value: 'AB+' },
//                       { label: 'AB-', value: 'AB-' },
//                       { label: 'O+', value: 'O+' },
//                       { label: 'O-', value: 'O-' },
//                     ]}
//                   />
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <CFormInput
//                     label="Education"
//                     name="education"
//                     value={user.education}
//                     onChange={handleInputChange}
//                   />
//                 </CCol>
//                 <CCol md={6}>
//                   <CFormInput
//                     label="Address"
//                     name="address"
//                     value={user.address}
//                     onChange={handleInputChange}
//                     required
//                   />
//                   {formErrors.address && <div className="text-danger">{formErrors.address}</div>}
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={4}>
//                   <CFormSelect
//                     label="Country"
//                     name="countryId"
//                     value={user.countryId}
//                     onChange={handleInputChange}
//                     options={[
//                       { label: "Select Country", value: "" },
//                       ...countries.map(country => ({ label: country.name, value: country.countryId }))
//                     ]}
//                     required
//                   />
//                   {formErrors.countryId && <div className="text-danger">{formErrors.countryId}</div>}
//                 </CCol>
//                 <CCol md={4}>
//                   <CFormSelect
//                     label="State"
//                     name="stateId"
//                     value={user.stateId}
//                     onChange={handleInputChange}
//                     options={[
//                       { label: "Select State", value: "" },
//                       ...states.map(state => ({ label: state.name, value: state.stateId }))
//                     ]}
//                     disabled={!user.countryId}
//                     required
//                   />
//                   {formErrors.stateId && <div className="text-danger">{formErrors.stateId}</div>}
//                 </CCol>
//                 <CCol md={4}>
//                   <CFormSelect
//                     label="City"
//                     name="cityId"
//                     value={user.cityId}
//                     onChange={handleInputChange}
//                     options={[
//                       { label: "Select City", value: "" },
//                       ...cities.map(city => ({ label: city.name, value: city.cityId }))
//                     ]}
//                     disabled={!user.stateId}
//                     required
//                   />
//                   {formErrors.cityId && <div className="text-danger">{formErrors.cityId}</div>}
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <CFormInput
//                     type="file"
//                     label="Profile Photo"
//                     name="photo"
//                     onChange={handleInputChange}
//                     accept=".jpg, .jpeg, .png"
//                   />
//                 </CCol>
//                 <CCol md={6}>
//                   {user.photo && (
//                     <CImage
//                       src={user.photo instanceof File ? URL.createObjectURL(user.photo) : `${imageUrl}/${user.photo}`}
//                       alt="Profile"
//                       width={100}
//                       height={100}
//                     />
//                   )}
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={12} className="d-flex justify-content-end align-items-end">
//                   <CFormCheck
//                     id="isAdmin"
//                     label="Is Admin"
//                     checked={user.isAdmin === 1}
//                     onChange={handleInputChange}
//                   />
//                 </CCol>
//               </CRow>

//               <CRow className="mt-4">
//                 <CCol>
//                   <CButton type="submit" color="primary">
//                     <CIcon icon={cilSave} className="me-2" />
//                     Save Changes
//                   </CButton>
//                   <CButton 
//                     color="secondary" 
//                     className="ms-2" 
//                     onClick={() => navigate('/base/profile')}
//                   >
//                     <CIcon icon={cilX} className="me-2" />
//                     Cancel
//                   </CButton>
//                 </CCol>
//               </CRow>
//             </CForm>
//           </CCardBody>
//         </CCard>
//       </CCol>
//     </CRow>
//   )
// }

// export default EditProfile

