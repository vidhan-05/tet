import { cilList, cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { cilReload } from '@coreui/icons';
import { toast } from 'react-toastify';
import Papa from 'papaparse';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation  ,useNavigate} from 'react-router-dom';
import {
  CButton,CSpinner,
  CCard,
  CCardBody,
  CCard as CCardBootstrap,
  CCardHeader,
  CCol,
  CCollapse,
  CForm,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CPagination,
  CPaginationItem,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format } from 'date-fns'
import React, { useCallback, useEffect, useState } from 'react';
import { IoToggle } from 'react-icons/io5'
import { getBackendURL } from '../../../util'
import axiosInstance from '../services/axiosInstance'
// require('dotenv').config();
const imageUrl = import.meta.env.VITE_IMAGE_URL;
console.log(imageUrl);

// console.log(`API URL: ${apiUrl}`);


const formatDateForDisplay = (dateString) => {
  if (!dateString) return ''

  // Parse the date string using the Date object
  const date = new Date(dateString)

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-indexed
  const year = date.getFullYear()

  // Return formatted date
  return `${day}-${month}-${year}`
}

const formatDate = (dateString) => {
  if (!dateString) return '' // Handle undefined, null, or empty date strings

  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    // Handle invalid date cases
    return ''
  }

  return format(date, 'yyyy-MM-dd') // Assuming you're using date-fns
}

const UserList = () => {
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit, setLimit] = useState(10)
  const [newUser, setNewUser] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    dateOfBirth: '',
    photo: '', // Changed from photo to photo
    age: '',
    education: '',
    address: '',
    countryId: '',
    stateId: '',
    cityId: '',
    userType: '',
    gender: '',
    parentId: '0',
    bloodGroup: '',
    isAdmin: '0',
    occupation : '',
  })
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [displayedUsers, setDisplayedUsers] = useState([]) // To store the users being displayed
  const [isChildList, setIsChildList] = useState(false) // To track whether we are viewing a child list or main list
  const [showBackButton, setShowBackButton] = useState(false)
  const [togglingStatus, setTogglingStatus] = useState(null)
  const [parentUser, setParentUser] = useState(null)
  const [userOptions, setUserOptions] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [currentParentId, setCurrentParentId] = useState(null)
  const [parentId, setParentId] = useState(null)
  const [mode, setMode] = useState('list')
  const [sortFieldAsc, setSortFieldAsc] = useState('')
  const [sortFieldDesc, setSortFieldDesc] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const [editMode, setEditMode] = useState(false)

  const backendUrl = getBackendURL()

  useEffect(() => {
    fetchData()
    fetchCountries()
  }, [])

  useEffect(() => {
    // This function will fetch the parent user based on the parentId.
    const fetchParentUser = async (parentId) => {
      try {
        const response = await axiosInstance.get(`/apis/users?parentId=${parentId}`)
        // const response = await axiosInstance.get(`${backendUrl}/apis/users?parentId=${parentId}`)
        console.log('API Response:', response.data)

        if (response.data.status === 'true') {
          setParentUser(response.data.users) // Set the fetched user data.
        } else {
          setParentUser(null) // If no user is found, reset the state.
        }
      } catch (error) {
        console.error('Error fetching parent user:', error)
        setParentUser(null) // On error, reset the state.
      }
    }

    // Fetch the parent user only if the userType is 'user' and parentId exists.
    if (newUser.userType === 'user' && newUser.parentId) {
      console.log('Fetching parent user with parentId:', newUser.parentId)
      fetchParentUser(newUser.parentId) // Call the fetch function.
    } else {
      setParentUser(null) // Reset if conditions are not met.
    }
  }, [newUser.userType, newUser.parentId]) // Run this effect when userType or parentId changes.

  useEffect(() => {
    if (userOptions.length > 0 && newUser.parentId) {
      const selectedUser = userOptions.find((user) => user.userId === newUser.parentId)
      if (selectedUser) {
        handleInputChange({
          target: { name: 'parentId', value: selectedUser.userId },
        })
      }
    }
  }, [userOptions, newUser.parentId])

  // const fetchData = async (page = 1, limit = 10, term = '') => {
  //   try {
  //     // const response = await axiosInstance.get(`${backendUrl}/apis/users`, {
  //       const response = await axiosInstance.get(`/apis/users`, {
  //       params: {
  //         search: term,
  //         parentId: 0,
  //         page: page,
  //         limit: limit,
  //       },
  //     })
  //     if (response.data && response.data.users) {
  //       setUsers(response.data.users)
  //       setDisplayedUsers([]) // Clear child users when fetching main list
  //       setIsChildList(false)
  //       setTotalPages(response.data.totalPages)
  //       setCurrentPage(response.data.currentPage)
  //       setShowBackButton(false) // Indicate that we are viewing the main list
  //       setMode('list')
  //     } else {
  //       console.error('Unexpected response structure:', response)
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error)
  //   }
  // }

  const fetchData = useCallback(async (page = 1, limit = 10, term = '', sortField = '', sortOrder = '') => {
    setIsReloading(true);
    try {
      // const response = await axiosInstance.get(`${backendUrl}/apis/getadminusers`, {
      const response = await axiosInstance.get(`/apis/getadminusers`, {
        params: {
          search: term,
          page: page,
          limit: limit,
          sortField,
          sortOrder,
        },
      });
      console.log(response.data.adminUsers)
      if (response.data && response.data.adminUsers) {
        setUsers(response.data.adminUsers);
        console.log(response.data.adminUsers);
        setDisplayedUsers([]);
        setIsChildList(false);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        setShowBackButton(false);
        setMode('list');
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsReloading(false);
    }
  }, []);


  
  const fetchAllUsers = async (page = 1, limit = 10, term = '', sortField = '', sortOrder = '') => {
    try {
      // Ensure page is a number
      const currentPage = Number(page) || 1

      const response = await axiosInstance.get(`/apis/users`, {
      // const response = await axiosInstance.get(`${backendUrl}/apis/users`, {
        params: {
          search: term,
          page: currentPage,
          limit: limit,
          sortField, // Sorting field
          sortOrder, // Sorting order
        },
      })

      if (response.data && response.data.users) {
        setUsers(response.data.users)
        setDisplayedUsers([]) // Clear child users when fetching main list
        setIsChildList(false)
        setTotalPages(response.data.totalPages)
        setCurrentPage(response.data.currentPage)
        setShowBackButton(false) // Indicate that we are viewing the main list
        setMode('list')
      } else {
        console.error('Unexpected response structure:', response)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  
  const handleSortChangeAsc = (field) => {
    if (field) {
      setSortFieldAsc(field) // Set the ascending sort field
      setSortFieldDesc('') // Clear the descending sort field
      fetchData(1, 10, searchTerm, field, 'asc') // Fetch data with ascending sort
    } else {
      setSortFieldAsc('') // Reset if no field is selected
    }
  }

  const handleSortChangeDesc = (field) => {
    if (field) {
      setSortFieldDesc(field) // Set the descending sort field
      setSortFieldAsc('') // Clear the ascending sort field
      fetchData(1, 10, searchTerm, field, 'desc') // Fetch data with descending sort
    } else {
      setSortFieldDesc('') // Reset if no field is selected
    }
  }

  const handleSortChange = (field, order) => {
    if (order === 'asc') {
      handleSortChangeAsc(field)
    } else {
      handleSortChangeDesc(field)
    }
  }

  // Handle search input change
  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term) // Update search term
    fetchData(1, 10, term, sortFieldAsc || sortFieldDesc, sortFieldAsc ? 'asc' : 'desc') // Fetch data based on current input
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchData(page, limit)
    }
  }

  // Determine which pages to show
  const getPagesToShow = () => {
    const pages = []

    if (totalPages <= 3) {
      // If there are 3 or fewer pages, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show current page, and one before and one after
      if (currentPage > 1) pages.push(currentPage - 1)
      pages.push(currentPage)
      if (currentPage < totalPages) pages.push(currentPage + 1)

      // Ensure we don't exceed the total number of pages
      pages.forEach((page) => {
        if (page < 1) pages.push(1)
        if (page > totalPages) pages.push(totalPages)
      })
    }

    return Array.from(new Set(pages)).sort((a, b) => a - b) // Remove duplicates and sort
  }

  const pagesToShow = getPagesToShow()

  const handleShowChildUsers = async (parentId) => {
    setParentId(parentId)
    console.log('parentId:', parentId)
    try {
      const response = await axiosInstance.get(`/apis/users?parentId=${parentId}`)
      // const response = await axiosInstance.get(`${backendUrl}/apis/users?parentId=${parentId}`)
      if (response.data.status === 'true') {
        setUsers(response.data.users)
        setDisplayedUsers(response.data.users) // Display child users
        setIsChildList(true) // Indicate that we are viewing a child list
        setTotalPages(response.data.totalPages)
        setCurrentPage(response.data.currentPage)
        setShowBackButton(true)
        setCurrentParentId(parentId)
      } else {
        alert('No child users found')
        console.error('No child users found')
        setDisplayedUsers([]) // Clear the list if no users are found
        setTotalPages(1)
      }
    } catch (error) {
      alert('No child users found')
      console.error('Error fetching child users:', error)
    }
  }

  const handleBackButtonClick = () => {
    fetchData() // Fetch the main user list
  }

  const togglePopup = async (e) => {
    e.preventDefault()
    console.log('mode', mode)
    setIsPopupOpen(!isPopupOpen)
  }

  const fetchStates = async (countryId) => {
    try {
      const response = await axiosInstance.get(`/apis/states/${countryId}`)
      // const response = await axiosInstance.get(`${backendUrl}/apis/states/${countryId}`)

      // Check if the response is successful
      if (response.status >= 200 && response.status < 300) {
        // Set states data if response is successful
        setStates(response.data)
        // Optionally log the fetched states
        console.log('Fetched states for countryId', countryId, ':', response.data)
      } else {
        throw new Error('Failed to fetch states. Status code: ' + response.status)
      }
    } catch (error) {
      // Log the error to the console
      console.error('Error fetching states:', error.message || error)
    }
  }

  const fetchCountries = async () => {
    try {
      const response = await axiosInstance.get(`/apis/countries`)
      // const response = await axiosInstance.get(`${backendUrl}/apis/countries`)

      // Check if the response is successful
      if (response.status >= 200 && response.status < 300) {
        // Set countries data if response is successful
        setCountries(response.data)
        // Optionally log the fetched countries
        console.log('Fetched countries:', response.data)
      } else {
        throw new Error('Failed to fetch countries. Status code: ' + response.status)
      }
    } catch (error) {
      // Log the error to the console
      console.error('Error fetching countries:', error.message || error)
    }
  }

  const fetchCities = async (stateId) => {
    try {
      const response = await axiosInstance.get(`/apis/cities/${stateId}`)
      // const response = await axiosInstance.get(`${backendUrl}/apis/cities/${stateId}`)

      // Check if the response is successful
      if (response.status >= 200 && response.status < 300) {
        // Set cities data if response is successful
        setCities(response.data)
        // Optionally log the fetched cities
        console.log('Fetched cities for stateId', stateId, ':', response.data)
      } else {
        throw new Error('Failed to fetch cities. Status code: ' + response.status)
      }
    } catch (error) {
      // Log the error to the console
      console.error('Error fetching cities:', error.message || error)
    }
  }

  useEffect(() => {
    if (newUser.countryId) {
      fetchStates(newUser.countryId)
    }
  }, [newUser.countryId])

  useEffect(() => {
    if (newUser.stateId) {
      fetchCities(newUser.stateId)
    }
  }, [newUser.stateId])

  const handleCountryChange = (e) => {
    const selectedCountryId = e.target.value
    console.log('Selected countryId:', selectedCountryId) // Log selected countryId
    setNewUser({ ...newUser, countryId: selectedCountryId, stateId: '', cityId: '' })
    fetchStates(selectedCountryId) // Now fetchStates is accessible here
  }

  const handleStateChange = (e) => {
    const selectedStateId = e.target.value
    console.log('Selected stateId:', selectedStateId) // Log selected stateId
    setNewUser({ ...newUser, stateId: selectedStateId, cityId: '' })
    fetchCities(selectedStateId) // Now fetchCities is accessible here
  }

  const handleCityChange = (e) => {
    const selectedCityId = e.target.value
    setNewUser({ ...newUser, cityId: selectedCityId })
  }
  const handleAdminChange = (e) => {
    const isAdminChecked = e.target.checked ? '1' : '0';
    setNewUser({ ...newUser, isAdmin: isAdminChecked });
  };

  const handleEdit = async (id) => {
    console.log(`Edit user with ID: ${id}`)
    setMode('edit')
    setFormErrors({})
    setEditMode(true)
    try {
      const response = await axiosInstance.get(`/apis/userdetails?userId=${id}`)
      // const response = await axiosInstance.get(`${backendUrl}/apis/userdetails?userId=${id}`)
      const userData = response.data.user
      console.log('DATA: ', userData)

      setNewUser({
        userId: userData.userId, // Include id for updating
        firstName: userData.firstName,
        lastName: userData.lastName,
        contactNumber: userData.contactNumber,
        email: userData.email,
        dateOfBirth: userData.dateOfBirth,
        photo: userData.photo,
        age: userData.age,
        education: userData.education,
        address: userData.address,
        countryId: userData.countryId,
        stateId: userData.stateId,
        cityId: userData.cityId,
        userType: userData.userType,
        gender: userData.gender,
        parentId: userData.parentId || '0',
        bloodGroup: userData.bloodGroup,
        occupation : userData.occupation   || '',
        isAdmin : userData.isAdmin || '0'
      })
      console.log(userData.isAdmin)
      if (currentParentId) {
        setIsChildList(true) // Keep the child list view
        setShowBackButton(true) // Ensure the back button is still visible
      }
      setShowForm(true) // Open the form for editing
    } catch (error) {
      console.error('Error fetching user details:', error)
      alert('Error fetching user details. Please try again later.')
    }
  }

  const handleAddNewUser = () => {
    setMode('add')
    setFormErrors({})
    setNewUser({
      userId: '',
      firstName: '',
      lastName: '',
      contactNumber: '',
      email: '',
      dateOfBirth: '',
      photo: '',
      age: '',
      education: '',
      address: '',
      countryId: '',
      stateId: '',
      cityId: '',
      userType: '',
      gender: '',
      parentId: '0',
      bloodGroup: '',
      isAdmin : '0',
      occupation :  ''
    })
    setEditMode(false)
    setShowForm(true)
  }

  const handleDelete = async (id) => {

    const userConfirmed = await new Promise((resolve) => {
      toast.info(
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#2c2c3c", // Dark background to match theme
            color: "#e0e0e0", // Slightly off-white text for contrast
            borderRadius: "8px",
            fontSize: "16px",
          }}
        >
          <div style={{ marginBottom: "15px" }}>
          Are you sure you want to delete this record?
          </div>
          <div>
            <button
              onClick={() => {
                resolve(true);
                toast.dismiss(); // Dismiss the toast
              }}
              style={{
                margin: "5px",
                padding: "10px 20px",
                backgroundColor: "#0066ff", // Blue for confirmation
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s ease", // Smooth hover effect
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#004db3")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#0066ff")}
            >
              Yes
            </button>
            <button
              onClick={() => {
                resolve(false);
                toast.dismiss(); // Dismiss the toast
              }}
              style={{
                margin: "5px",
                padding: "10px 20px",
                backgroundColor: "#ff3333", // Red for cancel
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s ease", // Smooth hover effect
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#b32424")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff3333")}
            >
              No
            </button>
          </div>
        </div>,
            {
              autoClose: false, // Keep the toast open until the user interacts
              closeButton: false, // Remove the close button
              closeOnClick: false, // Prevent closing on click outside
              draggable: false, // Disable dragging the toast
              position: "top-center", // Keep it at the top center of the screen
              style: {
                backgroundColor: "transparent", // Transparent background
                boxShadow: "none", // No shadow for cleaner integration
                marginTop: "0px", // More top alignment
                padding: "0", // No padding for a tighter look
              },
            }

      );
    });
  
    if (!userConfirmed) {
      return; // Exit the function if the user cancels the action
    }

    try {
      const response = await axiosInstance.put(`/apis/deleteuser/${id}`)
      // const response = await axiosInstance.put(`${backendUrl}/apis/deleteuser/${id}`)
      if (response.status === 200) {
        setUsers(users.filter((user) => user.userId !== id))
      } else {
        console.error('Failed to delete user:', response)
        alert('Failed to delete user. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user. Please try again.')
    }
  }



  const handleExport = async () => {
    try {
      // Making the API call
      const response = await axiosInstance.get(`/apis/users/all`, {
        // const response = await axiosInstance.get(`${backendUrl}/apis/users/all`, {
        params: { module: 'admin' }
      });
  
      if (response.data.status === 'true') {
        const users = response.data.users;
        console.log(users);
  
        // Map the 'status' field and remove unwanted fields
        const formattedUsers = users.map((user, index)=> {
          const { userId, photo, contactNumberFlag,createdDate , updatedDate,parentId, token, familyMemberCount, ...rest } = user; // Destructure to exclude fields
          return {
            "Sr No": index + 1, // Add sequential numbering
            ...rest,
            createdDate: createdDate ? createdDate.split('T')[0] : '', // Extract only the date
            updatedDate: updatedDate ? updatedDate.split('T')[0] : '', // Extract only the date
            status: user.status === 1 ? 'Active' : 'Inactive',
          };
        });
  
        // Create CSV file from the response data
        const csvData = Papa.unparse(formattedUsers, {
          header: true,
          quotes: true, // Ensure text fields are quoted in the CSV
        });
  
        // Trigger file download
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) { // Feature detection
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', 'Admin.csv'); // CSV file name
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
  
        console.log("CSV Downloaded");
      } else {
        alert('No users found');
        console.error('No users found');
      }
    } catch (error) {
      alert('Error fetching users');
      console.error('Error fetching users:', error);
    }
  };
  


  const handleImportClick = () => {
    console.log('hey')
    setShowModal(true) // Show the modal when "Import" is clicked
  }

  const triggerFileInput = () => {
    document.getElementById('csv-file-input').click()
  }
  const handleToggleStatus = async (userId, parentId) => {
    setTogglingStatus(userId) // Indicate which user status is being toggled

    const userConfirmed = await new Promise((resolve) => {
      toast.info(
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#2c2c3c", // Dark background to match theme
            color: "#e0e0e0", // Slightly off-white text for contrast
            borderRadius: "8px",
            fontSize: "16px",
          }}
        >
          <div style={{ marginBottom: "15px" }}>
          Are you sure you want to Toggle the status of this record?
          </div>
          <div>
            <button
              onClick={() => {
                resolve(true);
                toast.dismiss(); // Dismiss the toast
              }}
              style={{
                margin: "5px",
                padding: "10px 20px",
                backgroundColor: "#0066ff", // Blue for confirmation
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s ease", // Smooth hover effect
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#004db3")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#0066ff")}
            >
              Yes
            </button>
            <button
              onClick={() => {
                resolve(false);
                toast.dismiss(); // Dismiss the toast
              }}
              style={{
                margin: "5px",
                padding: "10px 20px",
                backgroundColor: "#ff3333", // Red for cancel
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s ease", // Smooth hover effect
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#b32424")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff3333")}
            >
              No
            </button>
          </div>
        </div>,
            {
              autoClose: false, // Keep the toast open until the user interacts
              closeButton: false, // Remove the close button
              closeOnClick: false, // Prevent closing on click outside
              draggable: false, // Disable dragging the toast
              position: "top-center", // Keep it at the top center of the screen
              style: {
                backgroundColor: "transparent", // Transparent background
                boxShadow: "none", // No shadow for cleaner integration
                marginTop: "-50px", // More top alignment
                padding: "0", // No padding for a tighter look
              },
            }

      );
    });
    if (!userConfirmed) {
      return // Exit the function if the user cancels the deletion
    }
    try {
      // Toggle user status
      await axiosInstance.put(`/apis/toggleuserstatus/${userId}`)
      // await axiosInstance.put(`${backendUrl}/apis/toggleuserstatus/${userId}`)
      console.log(isChildList)
      // console.log(parentUser.length)
      console.log(parentId)
      console.log(parentUser)
      // If you are in the child list view, refresh the child users after toggling status
      if (isChildList) {
        await handleShowChildUsers(parentId)
      } else {
        // Otherwise, refresh the main user list
        await fetchData(currentPage, limit)
      }
    } catch (error) {
      console.error(
        'Error toggling user status:',
        error.response ? error.response.data : error.message,
      )
    } finally {
      setTogglingStatus(null) // Reset toggling status
    }
  }

  const handleAddMember = () => {
    setShowForm(true)
  }
  const handleInputChange = async (e) => {
    const { name, value, type, files } = e.target

    setNewUser((prevUser) => {
      const updatedUser = { ...prevUser }

      // Handle file inputs
      if (type === 'file') {
        if (files && files.length > 0) {
          updatedUser[name] = files[0]
        } else {
          updatedUser[name] = prevUser.photo // Retain previous photo
        }
      } else {
        // Handle other input types (e.g., text, date)
        updatedUser[name] = value

        // Calculate age if the date of birth is changed
        if (name === 'dateOfBirth') {
          updatedUser.age = calculateAge(value)
        }

        // Set parentId when a user is selected from the user dropdown
        if (name === 'selectedUserId') {
          updatedUser.parentId = value // Assign the selected user's userId to parentId
        }
        if (name === 'userType' && (value === 'family head' || value === 'admin')) {
          updatedUser.parentId = '0' // Set parentId to 0 for Family Head or Admin
        }
      }
      return updatedUser
    })

    // Fetch users if 'userType' is selected as 'user'
    if (name === 'userType' && value === 'user') {
      try {
        const response = await axiosInstance.get(`/apis/allusers?parentId=0`)
        // const response = await axiosInstance.get(`${backendUrl}/apis/allusers?parentId=0`)
        if (response.data.status === 'true') {
          setUserOptions(response.data.users) // Assuming the users list is returned in 'data.users'
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    } else if (name === 'userType' && value !== 'user') {
      setUserOptions([]) // Clear user options if the selected type is not 'user'
    }
  }

  const validateForm = () => {
    const errors = {}
    // Add your form validation logic here
    if (!newUser.firstName) errors.firstName = 'First Name is required'
    if (!newUser.lastName) errors.lastName = 'Last Name is required'
    if (!newUser.contactNumber) errors.contactNumber = 'Contact Number is required'
    if (!newUser.email) errors.email = 'Email is required'
    if (!newUser.dateOfBirth) errors.dateOfBirth = 'Date of Birth is required'
    // if (!newUser.education) errors.education = 'Education is required'
    // if (!newUser.address) errors.address = 'Address is required'
    if (!newUser.userType) errors.userType = 'User Type is required'
    if (!newUser.gender) errors.gender = 'Gender is required'
    if (!newUser.countryId) errors.countryId = 'Country is required'
    if (!newUser.stateId) errors.stateId = 'State is required'
    if (!newUser.cityId) errors.cityId = 'City is required'
    // if (!newUser.photo) errors.photo = 'Photo is required'
    return errors
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    console.log('Form submit handler called')
    console.log('newuser: ', newUser)
    // console.log('User ID:', newUser.userId)

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    const formData = new FormData()
    console.log('newUser before FormData append:', newUser)
    
    Object.keys(newUser).forEach((key) => {
      if (newUser[key]) {
        formData.append(key, newUser[key])
      } else {
        console.warn(`${key} is empty or undefined`)
      }
    })
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value)
    }

    formData.forEach((value, key) => console.log(key, value))
    try {
      console.log('Is editMode:', editMode)

      let response

      if (editMode) {
        console.log('hey')
        console.log(formData)
        const formDataObj = {}
        for (let [key, value] of formData.entries()) {
          formDataObj[key] = value
        }
        console.log('FormData as Object:', formDataObj)
        // Call edit user API
        response = await axiosInstance.put(
          `/apis/edituser/${newUser.userId}`,
          // `${backendUrl}/apis/edituser/${newUser.userId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            timeout: 30000,
          },
        )
      } else {
        console.log(formData)
        // Call add user API
        response = await axiosInstance.post(`/apis/adduser`, formData, {
          // response = await axiosInstance.post(`${backendUrl}/apis/adduser`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        })
      }

      console.log(editMode ? 'Edit Response:' : 'Add Response:', response)

      if (response.status === 200 || response.status === 201) {
        alert(editMode ? 'User updated successfully' : 'User created successfully')

        // const userPhotoUrl = `uploads/${newUser.photo.name}`
        const updatedUser = {
          userId: response.data.userId,
          ...newUser,
          photo: newUser.photo ? newUser.photo : '', // Ensure photo exists
        }

        console.log('Updated User:', updatedUser) // Log updatedUser to ensure it’s constructed correctly

        setUsers((prevUsers) =>
          editMode
            ? prevUsers.map((user) => (user.userId === updatedUser.userId ? updatedUser : user))
            : [...prevUsers, updatedUser],
        )
      } else {
        alert(editMode ? 'Error updating user' : 'Error adding user')
      }

      // Reset form after successful submission
      setNewUser({
        userId: '',
        firstName: '',
        lastName: '',
        contactNumber: '',
        email: '',
        dateOfBirth: '',
        photo: '',
        age: '',
        education: '',
        address: '',
        countryId: '',
        stateId: '',
        cityId: '',
        userType: '',
        gender: '',
        parentId: '0',
        bloodGroup: '',
        isAdmin : '0',
        status : '1',
        occupation :  ''
      })
      setFormErrors({})
      setShowForm(false)
      if (isChildList) {
        const parentId = newUser.parentId || '0'
        await handleShowChildUsers(parentId)
        setMode('view') // Stay in the child list view
      } else {
        fetchData() // Refresh main user list
        setMode('list') // Return to main user list
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      if (error.response) {
        alert(`Error: ${error.response.data.error || 'Server Error'}`)
      } else if (error.request) {
        alert('No response received from server. Please try again later.')
      } else {
        alert(`Error: ${error.message}`)
      }
    }
  }

  const handleMoreDetails = (userId) => {
    setSelectedUserId(selectedUserId === userId ? null : userId)
  }
  const calculateAge = (dateOfBirth) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()

    // If the current month is before the birth month, or it's the birth month but the day is before the birth day, subtract one year from age
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }
  const getMaxDateOfBirth = () => {
    const today = new Date()
    const maxDate = new Date(today.setFullYear(today.getFullYear() - 14))
    return maxDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
  }
  const location = useLocation();
  const navigate = useNavigate();
  const [isReloading, setIsReloading] = useState(false);

  const handleReload = useCallback(async () => {
    setIsReloading(true);

    // Remove all search parameters and keep only the pathname and hash
    const cleanPath = `${location.pathname}${location.hash}`;
    
    // Update the URL without triggering a navigation
    window.history.replaceState(null, '', cleanPath);

    // Reset all filters and sorting
    setSearchTerm('');
    setSortFieldAsc('');
    setSortFieldDesc('');
    setCurrentPage(1);

    try {
      await fetchData(1, limit);
    } catch (error) {
      console.error('Error reloading data:', error);
    } finally {
      setIsReloading(false);
    }
  }, [location.pathname, location.hash, limit]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldReload = params.get('reload') === 'true';
    
    if (shouldReload) {
      handleReload();
    } else {
      // Initial data fetch
      fetchData(currentPage, limit, searchTerm, sortFieldAsc || sortFieldDesc, sortFieldAsc ? 'asc' : 'desc');
    }
  }, [location.search, handleReload, currentPage, limit, searchTerm, sortFieldAsc, sortFieldDesc]);


  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <div style={{ position: 'relative' }}>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>
                {isChildList
                  ? 'Family Members'
                  : mode === 'list'
                    ? 'Admin List'
                    : mode === 'add'
                      ? 'Add User'
                      : mode === 'edit'
                        ? 'Edit Admin'
                        : ''}
              </strong>


              <div className="d-flex align-items-center">
              {mode === 'list' && (
  <CCol xs="auto" className="me-2">
    <CButton
      color="primary"
      variant="outline"
      className="d-flex align-items-center"
      onClick={handleReload}
      disabled={isReloading}
    >
      <CIcon icon={cilReload} size="sm" className="me-2" />
      <span>Refresh</span>
    </CButton>
  </CCol>
)}
                {/* Search Icon and Input Container */}
                {!showForm && (
                  <>
                    <div style={{ position: 'relative', maxWidth: '200px', marginRight: '11px' }}>
                      <FontAwesomeIcon
                        icon={faSearch}
                        style={{
                          position: 'absolute',
                          left: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#888',
                          pointerEvents: 'none', // Prevents icon from blocking input clicks
                        }}
                      />
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm} // Controlled input
      onChange={handleSearch}
      style={{
        paddingLeft: '30px', // Space for the icon
        width: '100%',
        height: '35px',
      }}
    />
                    </div>
                    {/* Sorting Dropdowns */}
                    <div style={{ marginRight: '10px' }}>
                      <select
                        value={sortFieldAsc}
                        onChange={(e) => handleSortChange(e.target.value, 'asc')}
                        style={{ height: '35px', padding: '5px' }}
                      >
                        <option value="">Sort Ascending</option>
                        <option value="firstName">Name</option>
                        <option value="contactNumber">Contact Number</option>
                        <option value="email">Email</option>
                        <option value="address">Address</option>
                        <option value="age">Age</option>
                      </select>
                    </div>
                    <div style={{ paddingRight: '10px' }}>
                      <select
                        value={sortFieldDesc}
                        onChange={(e) => handleSortChange(e.target.value, 'desc')}
                        style={{ height: '35px', padding: '5px' }}
                      >
                        <option value="">Sort Descending</option>
                        <option value="firstName">Name</option>
                        <option value="contactNumber">Contact Number</option>
                        <option value="email">Email</option>
                        <option value="address">Address</option>
                        <option value="age">Age</option>
                      </select>
                    </div>
                  </>
                )}
                {/* Conditional Buttons
                {mode !== 'edit' && mode !== 'add' && !isChildList && (
                  <CButton
                    color="primary"
                    onClick={(e) => {
                      setMode('list')
                      console.log('Mode:', 'list')
                      togglePopup(e)
                    }}
                    style={{ marginRight: '11px' }}
                  >
                    Import
                  </CButton>
                )} */}

                {/* {isChildList && (
                  <CButton
                    color="primary"
                    onClick={(e) => {
                      setMode('view')
                      console.log('Mode:', 'view')
                      togglePopup(e)
                    }}
                    style={{ marginRight: '11px' }}
                  >
                    Import
                  </CButton>
                )} */}

                {/* {!showForm && !isChildList && (
                  <CButton color="primary" onClick={handleAddNewUser} className="ml-2">
                    Add User
                  </CButton>
                  
                )} */}

                {/* {!showForm && (
                  <CButton color="primary" onClick={fetchAllUsers} className="ml-2">
                    All Users
                  </CButton>
                )} */}
                {mode === 'list' && (
                <CButton color="primary" onClick={handleExport}>
    Export
  </CButton>
                )}


                {showBackButton && mode !== 'edit' && (
                  <CButton color="primary" onClick={handleBackButtonClick} className="ml-2">
                    Back
                  </CButton>
                )}
              </div>
            </CCardHeader>
            {isPopupOpen && (
              <div
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '500px',
                  height: '300px',
                  backgroundColor: '#fff',
                  boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
                  zIndex: 1050,
                  borderRadius: '8px',
                  padding: '20px',
                }}
              >
              </div>
            )}
            {/* {message && (
              <div className="p-3">
                <p>{message}</p>
              </div>
            )} */}
            <CModal show={showModal} onClose={() => setShowModal(false)}>
              <CModalHeader closeButton>Simple Modal</CModalHeader>
              <CModalBody>
                <p>This is a simple modal for testing.</p>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setShowModal(false)}>
                  Close
                </CButton>
              </CModalFooter>
            </CModal>
          </div>
          <CCardBody>
            {showForm && (
              <CForm className="row g-3" onSubmit={handleFormSubmit}>
                
                <CCol md="6">
                  <label htmlFor="firstName" className="form-label">
                    First Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    value={newUser.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  {/* {formErrors.firstName && (
                    <div className="text-danger mt-1">{formErrors.firstName}</div>
                  )} */}
                </CCol>
                <CCol md="6">
                  <label htmlFor="lastName" className="form-label">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    value={newUser.lastName}
                    onChange={handleInputChange}
                    required
                  />
                  {/* {formErrors.lastName && (
                    <div className="text-danger mt-1">{formErrors.lastName}</div>
                  )} */}
                </CCol>
                <CCol md="6">
                  <label htmlFor="contactNumber" className="form-label">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="contactNumber"
                    name="contactNumber"
                    value={newUser.contactNumber}
                    onChange={handleInputChange}
                    maxLength={10}
                  />
                  {/* {formErrors.contactNumber && (
                    <div className="text-danger mt-1">{formErrors.contactNumber}</div>
                  )} */}
                </CCol>
                <CCol md="6">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                  />
                  {/* {formErrors.email && <div className="text-danger mt-1">{formErrors.email}</div>} */}
                </CCol>
                <CCol md="6">
                  <label htmlFor="gender" className="form-label">
                    Gender <span className="text-danger">*</span>
                  </label>
                  <CFormSelect
                    id="gender"
                    name="gender"
                    value={newUser.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="other">Other</option>
                  </CFormSelect>
                  {/* {formErrors.gender && <div className="text-danger mt-1">{formErrors.gender}</div>} */}
                </CCol>
                <CCol md="6">
                  <label htmlFor="dateOfBirth" className="form-label">
                    Date of Birth <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formatDate(newUser.dateOfBirth) || ''}
                    onChange={handleInputChange}
                    max={newUser.userType !== 'user' ? getMaxDateOfBirth() : undefined} // Disable max limit if userType is 'user'
                    required
                  />
                  {/* {formErrors.dateOfBirth && (
                    <div className="text-danger mt-1">{formErrors.dateOfBirth}</div>
                  )} */}
                </CCol>
                <CCol md="6">
                  <label htmlFor="age" className="form-label">
                    Age
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="age"
                    name="age"
                    value={newUser.age}
                    onChange={handleInputChange}
                    readOnly
                  />
                </CCol>
                <CCol md="6">
                  <label htmlFor="bloodGroup" className="form-label">
                    Blood Group
                  </label>
                  <CFormSelect
                    id="bloodGroup"
                    name="bloodGroup"
                    value={newUser.bloodGroup}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </CFormSelect>
                  {/* {formErrors.bloodGroup && (
                    <div className="text-danger mt-1">{formErrors.bloodGroup}</div>
                  )} */}
                </CCol>
                <CCol md="6">
                  <label htmlFor="education" className="form-label">
                    Education
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="education"
                    name="education"
                    value={newUser.education}
                    onChange={handleInputChange}
                  />
                  {/* {formErrors.education && (
                    <div className="text-danger mt-1">{formErrors.education}</div>
                  )} */}
                </CCol>
                <CCol md="6">
                  <label htmlFor="photo" className="form-label">
                    Photo <span className="text-danger">*</span>
                  </label>
                  {editMode && newUser.photo && (
                    <div className="mb-3">
                      
                      <img
                        src={`${imageUrl}/${newUser.photo}`}
                        alt="User Photo"
                        style={{ maxWidth: '100%', maxHeight: '100px', borderRadius: '5px' }}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    id="photo"
                    name="photo"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleInputChange}
                  />
                  {/* {formErrors.photo && <div className="text-danger mt-1">{formErrors.photo}</div>} */}
                </CCol>

                <CCol md="6">
  <label htmlFor="occupation" className="form-label">
    Occupation 
  </label>
  <input
    type="text"
    className="form-control"
    id="occupation"
    name="occupation"
    value={newUser.occupation}  // Assuming `newUser` is your state object
    onChange={handleInputChange}  // Assuming `handleInputChange` is your change handler function
  />
  {/* Optional: Display error message if occupation is invalid */}
  {/* {formErrors.occupation && (
    <div className="text-danger mt-1">{formErrors.occupation}</div>
  )} */}
</CCol>

                <CCol md="6">
                  <label htmlFor="address" className="form-label">
                    Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={newUser.address}
                    onChange={handleInputChange}
                    required
                  />
                  {/* {formErrors.address && (
                    <div className="text-danger mt-1">{formErrors.address}</div>
                  )} */}
                </CCol>
                <CCol md="6">
                  <label htmlFor="countryId" className="form-label">
                    Country <span className="text-danger">*</span>
                  </label>
                  <CFormSelect
                    id="countryId"
                    name="countryId"
                    value={newUser.countryId}
                    onChange={handleCountryChange}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.countryId} value={country.countryId}>
                        {country.name}
                      </option>
                    ))}
                  </CFormSelect>
                  {/* {formErrors.countryId && (
                    <div className="text-danger mt-1">{formErrors.countryId}</div>
                  )} */}
                </CCol>
                <CCol md="6">
                  <label htmlFor="stateId" className="form-label">
                    State <span className="text-danger">*</span>
                  </label>
                  <CFormSelect
                    id="stateId"
                    name="stateId"
                    value={newUser.stateId || ''}
                    onChange={handleStateChange}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.stateId} value={state.stateId}>
                        {state.name}
                      </option>
                    ))}
                  </CFormSelect>
                  {/* {formErrors.stateId && (
                    <div className="text-danger mt-1">{formErrors.stateId}</div>
                  )} */}
                </CCol>
                <CCol md="6">
                  <label htmlFor="cityId" className="form-label">
                    City <span className="text-danger">*</span>
                  </label>
                  <CFormSelect
                    id="cityId"
                    name="cityId"
                    value={newUser.cityId || ''}
                    onChange={handleCityChange}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.cityId} value={city.cityId}>
                        {city.name}
                      </option>
                    ))}
                  </CFormSelect>
                  {/* {formErrors.cityId && <div className="text-danger mt-1">{formErrors.cityId}</div>} */}
                </CCol>
                              <CCol md="12" className="d-flex justify-content-end align-items-end mt-3">
                <label htmlFor="isAdmin" className="form-label">
                </label>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isAdmin"
                    checked={newUser.isAdmin === 1}
                    onChange={handleAdminChange}
                  />
                  <label className="form-check-label" htmlFor="isAdmin">
                    Is Admin
                  </label>
                </div>
              </CCol>
                <CCol md="12" className="d-flex justify-content-end">
                  <CButton
                    type="submit"
                    color="primary"
                    className="me-2"
                    onClick={() => console.log('Submit button clicked')}
                  >
                    {/* {editMode ? 'Update User' : 'Add User'} */}Submit
                  </CButton>
                  <CButton
                    type="button"
                    color="secondary"
                    onClick={() => {
                      setShowForm(false)
                      if (isChildList) {
                        // Stay in the child list view
                        setMode('view')
                      } else {
                        // Go back to the main user list
                        setMode('list')
                      }
                    }}
                  >
                    Cancel
                  </CButton>
                </CCol>
              </CForm>
            )}
            <>
              {!showForm && (
                <>
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Photo</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Contact Number</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Date of Birth</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Address</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {users.map((user, index) => (
                        <React.Fragment key={user.userId}>
                          <CTableRow>
                            <CTableDataCell>{index + 1}</CTableDataCell>
                            <CTableDataCell>
                              {user.photo ? (
                                <img
                                  src={
                                    `${imageUrl}/${user.photo}` ||
                                    ''
                                  }
                                  alt="photo"
                                  style={{
                                    width: '50px',
                                    height: '50px',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                  }}
                                />
                              ) : (
                                'No photo'
                              )}
                            </CTableDataCell>
                            <CTableDataCell>
                              <span
                                style={{ cursor: 'pointer', color: 'blue' }}
                                onClick={() => handleMoreDetails(user.userId)}
                              >
                                {`${user.firstName || ''} ${user.lastName || ''}`.trim()}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell>{user.contactNumber}</CTableDataCell>
                            <CTableDataCell>{user.email}</CTableDataCell>
                            <CTableDataCell>
                              {formatDateForDisplay(user.dateOfBirth)}
                            </CTableDataCell>
                            <CTableDataCell>{user.address}</CTableDataCell>
                            <CTableDataCell>
                              <div className="d-flex align-items-center">
                                <CButton
                                  color="primary"
                                  size="sm"
                                  className="me-1"
                                  onClick={() => handleEdit(user.userId)}
                                >
                                  <CIcon icon={cilPencil} />
                                </CButton>
                                <CButton
                                  color="danger"
                                  size="sm"
                                  onClick={() => handleDelete(user.userId)}
                                >
                                  <CIcon icon={cilTrash} />
                                </CButton>
                                {user.parentId === 0 && (
                                  <CButton
                                    color="primary"
                                    size="sm"
                                    className="ms-2"
                                    onClick={() => handleShowChildUsers(user.userId)} // Trigger the function to show child users
                                  >
                                    <CIcon icon={cilList} /> {/* Add an icon for better UI */}
                                  </CButton>
                                )}
                                <CButton
                                  // color="secondary"
                                  size="sm"
                                  className="ms-2"
                                  onClick={() => handleToggleStatus(user.userId, user.parentId)}
                                  disabled={togglingStatus === user.userId}
                                >
                                  <IoToggle
                                    size={24} // Set the size of the icon
                                    style={{
                                      color: user.status == '1' ? 'green' : 'grey',
                                      transform:
                                        user.status == '1' ? 'rotate(0deg)' : 'rotate(180deg)',
                                      // transition: 'transform 0.1s',
                                    }}
                                  />
                                </CButton>
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell colSpan="9">
                              <CCollapse visible={selectedUserId === user.userId}>
                                <CCardBootstrap>
                                  <CCardBody>
                                    <CRow>
                                      <CCol md="6">
                                        <strong>First Name:</strong> {user.firstName}
                                      </CCol>
                                      <CCol md="6">
                                        <strong>Last Name:</strong> {user.lastName}
                                      </CCol>
                                    </CRow>
                                    <CRow className="mt-2">
                                      <CCol md="6">
                                        <strong>Contact Number:</strong> {user.contactNumber}
                                      </CCol>
                                      <CCol md="6">
                                        <strong>Email:</strong> {user.email}
                                      </CCol>
                                    </CRow>
                                    <CRow className="mt-2">
                                      <CCol md="6">
                                        <strong>Date of Birth: </strong>
                                        {formatDateForDisplay(user.dateOfBirth)}
                                        {/* {user.dateOfBirth} */}
                                      </CCol>
                                      <CCol md="6">
                                        <strong>Age:</strong> {user.age}
                                      </CCol>
                                    </CRow>
                                    <CRow className="mt-2">
                                      <CCol md="6">
                                        <strong>Education:</strong> {user.education}
                                      </CCol>
                                      <CCol md="6">
                                        <strong>Gender:</strong> {user.gender}
                                      </CCol>
                                    </CRow>
                                    <CRow className="mt-2">
                                      <CCol md="6">
                                        <strong>Address:</strong> {user.address}
                                      </CCol>
                                      <CCol md="6">
                                        <strong>Blood Group:</strong> {user.bloodGroup}
                                      </CCol>
                                    </CRow>
                                    <CRow className="mt-2">
                                      <CCol md="6">
                                        <strong>Country:</strong> {user.countryName}
                                      </CCol>
                                      <CCol md="6">
                                        <strong>State:</strong> {user.stateName}
                                      </CCol>
                                    </CRow>
                                    <CRow className="mt-2">
                                      <CCol md="6">
                                        <strong>City:</strong> {user.cityName}
                                      </CCol>
                                    </CRow>
                                    <CRow className="mt-2">
                                      <CCol md="12">
                                        <strong>Photo :</strong>{' '}
                                        {user.photo && (
                                          <>
                                            <div>
                                              <img
                                                src={`${imageUrl}/${user.photo}`}
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
                                      </CCol>
                                    </CRow>
                                  </CCardBody>
                                </CCardBootstrap>
                              </CCollapse>
                            </CTableDataCell>
                          </CTableRow>
                        </React.Fragment>
                      ))}
                    </CTableBody>
                  </CTable>
                  <CPagination align="end" aria-label="Page navigation example">
                    <CPaginationItem
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      style={{ cursor: currentPage === 1 ? 'default' : 'pointer' }} // Pointer cursor for enabled
                    >
                      Previous
                    </CPaginationItem>
                    {pagesToShow.map((page) => (
                      <CPaginationItem
                        key={page}
                        onClick={() => handlePageChange(page)}
                        active={page === currentPage}
                        style={{ cursor: 'pointer' }} // Pointer cursor for all items
                      >
                        {page}
                      </CPaginationItem>
                    ))}
                    <CPaginationItem
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      style={{ cursor: currentPage === totalPages ? 'default' : 'pointer' }} // Pointer cursor for enabled
                    >
                      Next
                    </CPaginationItem>
                  </CPagination>
                </>
              )}
            </>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UserList
