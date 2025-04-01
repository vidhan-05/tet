import { cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useLocation } from 'react-router-dom';
import { cilReload } from '@coreui/icons';
import { toast } from 'react-toastify';
import Papa from 'papaparse';
import 'react-toastify/dist/ReactToastify.css';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
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
import React, { useEffect, useState, useCallback } from 'react'
import { IoToggle } from 'react-icons/io5'
import { getBackendURL } from '../../../util'
import axiosInstance from '../services/axiosInstance'
const imageUrl = import.meta.env.VITE_IMAGE_URL;

const BusinessConnect = () => {
  const [business, setBusiness] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedbusinessId, setselectedbusinessId] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [file, setFile] = useState(null)
  const [togglingStatus, setTogglingStatus] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit, setLimit] = useState(10)
  const [userOptions, setUserOptions] = useState([])
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [uploading, setUploading] = useState(false)
  const [sortFieldAsc, setSortFieldAsc] = useState('')
  const [sortFieldDesc, setSortFieldDesc] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isReloading, setIsReloading] = useState(false); // Tracks whether data is being reloaded
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [uId, setUId] = useState('')
  const [newBusiness, setnewBusiness] = useState({
    businessId: '',
    userId: '',
    businessType: '',
    businessTitle: '',
    contactNumber: '',
    address: '',
    countryId: '',
    stateId: '',
    cityId: '',
    description: '',
    email: '',
    website: '',
    status: 1,
    photo: '',
  })
  const backendUrl = getBackendURL()

  useEffect(() => {
    fetchData()
    fetchCountries()
  }, [])

  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') === 'true') {
      const storedUId = localStorage.getItem('userId')
      if (storedUId) {
        setUId(storedUId)
      }
    }
  }, [])

  // Fetch all users once when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(`/apis/allusers?parentId=0`)
        // const response = await axiosInstance.get(`${backendUrl}/apis/allusers?parentId=0`)
        if (response.data.status === 'true') {
          setUserOptions(response.data.users) // Assuming users are returned in data.users
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
  }, []) // Runs only once when the component mounts

  useEffect(() => {
    if (userOptions.length > 0 && newBusiness.userId) {
      const selectedUser = userOptions.find((user) => user.userId === newBusiness.userId)
      if (selectedUser) {
        handleInputChange({
          target: { name: 'userId', value: selectedUser.userId },
        })
      }
    }
  }, [userOptions, newBusiness.userId])

  const fetchData = async (page = 1, limit = 10, term = '', sortField = '', sortOrder = '') => {
    try {
      // const response = await axiosInstance.get(`${backendUrl}/apis/businesses`, {
        const response = await axiosInstance.get(`/apis/businesses`, {
        params: { 
          search: term,
          page: page,
          limit: limit,
          sortField, // Sorting field
          sortOrder, // Sorting order
        },
      })
      if (response.data && response.data.businessConnections) {
        setBusiness(response.data.businessConnections)
        setTotalPages(response.data.totalPages)
        setCurrentPage(response.data.currentPage)
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
    fetchData(1, 10, term) // Fetch data based on current input
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchData(page, limit)
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

  useEffect(() => {
    if (newBusiness.countryId) {
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
      fetchStates(newBusiness.countryId)
    }
  }, [newBusiness.countryId])

  useEffect(() => {
    if (newBusiness.stateId) {
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
      fetchCities(newBusiness.stateId)
    }
  }, [newBusiness.stateId])
  const handleMoreDetails = (businessId) => {
    // Toggle visibility of details
    setselectedbusinessId(selectedbusinessId === businessId ? null : businessId)
  }

  const handleCountryChange = (e) => {
    const selectedCountryId = e.target.value
    console.log('Selected countryId:', selectedCountryId) // Log selected countryId
    setnewBusiness({ ...newBusiness, countryId: selectedCountryId, stateId: '', cityId: '' })
    fetchStates(selectedCountryId)
  }

  const handleStateChange = (e) => {
    const selectedStateId = e.target.value
    console.log('Selected stateId:', selectedStateId) // Log selected stateId
    setnewBusiness({ ...newBusiness, stateId: selectedStateId, cityId: '' })
    fetchCities(selectedStateId)
  }
  const handleCityChange = (e) => {
    const selectedCityId = e.target.value
    setnewBusiness({ ...newBusiness, cityId: selectedCityId })
  }

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

  const togglePopup = (e) => {
    e.preventDefault()
    setIsPopupOpen(!isPopupOpen)
    fetchData()
  }

  const handleToggleStatus = async (businessId) => {
    setTogglingStatus(businessId) // Indicate which user status is being toggled
    const currentBusiness = business.find((business) => business.businessId === businessId);
    const currentStatus = currentBusiness?.status; // Get the current status ('1' for active, '0' for inactive)
  
    // Determine the action based on the current status
    const action = currentStatus == '1' ? 'inactive' : 'active';
    console.log(currentStatus)

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
          Are you sure you want to {action} this record?
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
      // Toggle user status
      await axiosInstance.put(`/apis/togglebusinessstatus/${businessId}`)
      // await axiosInstance.put(`${backendUrl}/apis/togglebusinessstatus/${businessId}`)

      await fetchData(currentPage, limit)
    } catch (error) {
      console.error(
        'Error toggling Business status:',
        error.response ? error.response.data : error.message,
      )
    } finally {
      setTogglingStatus(null) // Reset toggling status
    }
  }

  // Handle file upload
  const handleUploadCSV = async (e) => {
    e.preventDefault()
    setIsPopupOpen(!isPopupOpen)
    if (!file) {
      alert('No file chosen')
      return
    }

    const formData = new FormData()
    formData.append('csvFile', file) // Key should match the server-side key

    try {
      const response = await axiosInstance.post(`/apis/addbusiness`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Handle successful response
      console.log('Upload successful:', response.data) // For debugging
      alert('File uploaded successfully.')
      // setShowModal(false)
      fetchData()
    } catch (error) {
      // Handle errors
      console.error('Error uploading file:', error.response ? error.response.data : error.message)
      alert('Failed to upload file.')
    } finally {
      setUploading(false) // Reset uploading status after processing
    }
  }

  const handleFileChange = (business) => {
    setFile(business.target.files[0])
  }

  const handleEdit = async (id) => {
    console.log(`Edit BusinessConnection with ID: ${id}`)
    setEditMode(true) // Set edit mode to true
    try {
      // const response = await axiosInstance.get(`${backendUrl}/apis/businessdetails?businessId=${id}`)
      const response = await axiosInstance.get(`/apis/businessdetails?businessId=${id}`)
      const businessData = response.data.business
      // console.log('DATA: ', businessData)

      setnewBusiness({
        businessId: businessData.businessId, // Include id for updating
        userId: businessData.userId,
        businessType: businessData.businessType,
        businessTitle: businessData.businessTitle,
        contactNumber: businessData.contactNumber,
        address: businessData.address,
        countryId: businessData.countryId,
        stateId: businessData.stateId,
        cityId: businessData.cityId,
        description: businessData.description,
        email: businessData.email,
        photo: businessData.photo,
        website: businessData.website,
        status: businessData.status,
      })
      setShowForm(true) // Open the form for editing
    } catch (error) {
      console.error('Error fetching business details:', error)
      alert('Error fetching business details. Please try again later.')
    }
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
      const response = await axiosInstance.put(`/apis/deletebusiness/${id}`)
      if (response.status === 200) {
        setBusiness((prevProfiles) => prevProfiles.filter((business) => business.businessId !== id))
      } else {
        console.error('Failed to delete business connect:', response)
        alert('Failed to delete business connect. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting business connect:', error)
      alert('Error deleting business connect. Please try again.')
    }
  }

  const handleAddBusiness = () => {
    setShowForm(!showForm)
    setnewBusiness({
      businessId: '',
      userId: '',
      businessType: '',
      businessTitle: '',
      contactNumber: '',
      address: '',
      countryId: '',
      stateId: '',
      cityId: '',
      description: '',
      email: '',
      website: '',
      photo: '',
      status: 1,
    })
    setEditMode(false)
  }

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target

    setnewBusiness((prevBusiness) => {
      const updatedBusiness = { ...prevBusiness }

      // Handle file inputs
      if (type === 'file') {
        // Only update the photo if a new file is selected
        if (files && files.length > 0) {
          updatedBusiness[name] = files[0]
        } else {
          // If no new file selected, retain the previous photo
          updatedBusiness[name] = prevBusiness.photo // Retain previous photo
        }
      } else {
        // Handle other input types (e.g., text, date)
        updatedBusiness[name] = value
      }

      return updatedBusiness
    })
  }


  const handleExport = async () => {
    try {
      // Making the API call
      const response = await axiosInstance.get(`/apis/businesses/all`, {});
      // const response = await axiosInstance.get(`${backendUrl}/apis/businesses/all`, {});
    
      if (response.data.status === 'true') {
    
        const businesses = response.data.businesses;
        console.log(businesses);
    
        // Map the 'status' field to "Active" or "Inactive" and remove unnecessary fields
        const formattedbusinesses = businesses.map((businesses , index) => {
          const { businessId ,userId , photo ,countryId ,stateId, cityId, createdDate , updatedDate, ...rest } = businesses; // Destructure and remove unwanted fields
          return {
            "Sr No": index + 1, // Add sequential numbering
            ...rest,
            createdDate: createdDate ? createdDate.split('T')[0] : '', // Extract only the date
            updatedDate: updatedDate ? updatedDate.split('T')[0] : '', // Extract only the date
            status: businesses.status === 1 ? 'Active' : 'Inactive',
          };
        });
    
        // Create CSV file from the response data
        const csvData = Papa.unparse(formattedbusinesses, {
          header: true,
          quotes: true,  // Ensure text fields are quoted in the CSV
        });
    
        // Trigger file download
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) { // Feature detection
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', 'Business.csv');  // CSV file name
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
    
        console.log("CSV Downloaded");
    
      } else {
        alert('No Business found');
        console.error('No Business found');
      }
    } catch (error) {
      alert('Error fetching Business');
      console.error('Error fetching Business:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submit handler called')

    // Prepare form data
    const formData = new FormData()
    console.log('newBusiness before FormData append:', newBusiness)

    Object.keys(newBusiness).forEach((key) => {
      if (newBusiness[key]) {
        formData.append(key, newBusiness[key])
      } else {
        console.warn(`${key} is empty or undefined`)
      }
    })

    // Append `addedBy` only if it's not already set in `newEvent`
    if (!newBusiness.userId) {
      formData.append('userId', uId || '')
    }

    // Log FormData
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value)
    }

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`)
    }

    try {
      let response

      if (editMode) {
        console.log('Updating business Connection...')
        // console.log('formData', formData)
        const formDataObj = {}
        for (let [key, value] of formData.entries()) {
          formDataObj[key] = value
        }
        // console.log('FormData as Object:', formDataObj)
        // Update announcement
        response = await axiosInstance.put(
          `/apis/editbusiness/${newBusiness.businessId}`,
          // `${backendUrl}/apis/editbusiness/${newBusiness.businessId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            timeout: 30000,
          },
        )
      } else {
        // console.log(formData)
        const formDataObj = {}
        for (let [key, value] of formData.entries()) {
          formDataObj[key] = value
        }
        console.log('FormData as Object:', formDataObj)
        console.log('Adding new Business Connection...')
        // Add new announcement
        response = await axiosInstance.post(`/apis/addbusiness`, formData, {
          // response = await axiosInstance.post(`${backendUrl}/apis/addbusiness`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        })
      }

      console.log(editMode ? 'Edit Response:' : 'Add Response:', response)

      if (response.status === 200 || response.status === 201) {
        alert(editMode ? 'Business updated successfully' : 'Business added successfully')

        // Construct the announcement object from the response
        const updatedBusiness = {
          businessId: response.data.businessId, // Assuming this is returned from the API
          ...newBusiness,
        }

        console.log('Updated Business:', updatedBusiness) // Log updatedAnnouncement to ensure it’s constructed correctly

        setBusiness((prevBusiness) =>
          editMode
            ? prevBusiness.map((business) =>
                business.businessId === updatedBusiness.businessId ? updatedBusiness : business,
              )
            : [...prevBusiness, updatedBusiness],
        )
      } else {
        alert(editMode ? 'Error updating Business' : 'Error adding Business')
      }

      // Reset form after successful submission
      setnewBusiness({
        businessId: '',
        userId: '',
        businessType: '',
        businessTitle: '',
        contactNumber: '',
        address: '',
        countryId: '',
        stateId: '',
        cityId: '',
        description: '',
        email: '',
        photo: '',
        website: '',
        status: 1,
      })
      setShowForm(false)
      setEditMode(false) // Reset edit mode
      fetchData() // Refetch data to reflect changes
    } catch (error) {
      console.error('Error submitting Business:', error)
      if (error.response) {
        alert(`Error: ${error.response.data.error || 'Server Error'}`)
      } else if (error.request) {
        alert('No response received from server. Please try again later.')
      } else {
        alert(`Error: ${error.message}`)
      }
    }
  }

  const location = useLocation();

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
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>
              {showForm
                ? editMode
                  ? 'Edit Business Connection'
                  : 'Add Business Connection'
                : 'Business Connection List'}
            </strong>
            <div className="d-flex align-items-center">
            {!showForm && (
                <>
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
                      {/* {isReloading ? (
                        <CSpinner size="sm" className="me-2" />
                      ) : (
                        <CIcon icon={cilReload} size="sm" className="me-2" />
                      )}
                      {isReloading ? 'Reloading...' : 'Reload'} */}
                    </CButton>
                  </CCol>
                  </>
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
                      <option value="businessTitle">Title</option>
                      <option value="businessType">Type</option>
                      <option value="contactNumber">Contact Number</option>
                      <option value="address">Address</option>
                    </select>
                  </div>
                  <div style={{ paddingRight: '10px' }}>
                    <select
                      value={sortFieldDesc}
                      onChange={(e) => handleSortChange(e.target.value, 'desc')}
                      style={{ height: '35px', padding: '5px' }}
                    >
                      <option value="">Sort Descending</option>
                      <option value="businessTitle">Title</option>
                      <option value="businessType">Type</option>
                      <option value="contactNumber">Contact Number</option>
                      <option value="address">Address</option>
                    </select>
                  </div>
                </>
              )}
              {!showForm && (
  <>
    <CButton
      color="primary"
      onClick={handleAddBusiness}
      style={{ marginRight: '11px', marginBottom: '10px' }}
    >
      Add Business Connection
    </CButton>

    <CButton
      color="primary"
      onClick={handleExport}
      style={{ marginBottom: '10px' }}
    >
      Export
    </CButton>
  </>
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
              <CCard>
                <CCardHeader>Upload CSV File</CCardHeader>
                <CCardBody>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{ display: 'block', marginBottom: '15px' }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '100px',
                    }}
                  >
                    <CButton
                      color="primary"
                      onClick={handleUploadCSV}
                      style={{
                        width: '49%', // Adjusts button width to fit side by side
                      }}
                    >
                      Upload
                    </CButton>
                    <CButton
                      color="secondary"
                      onClick={togglePopup}
                      style={{
                        width: '49%', // Adjusts button width to fit side by side
                      }}
                    >
                      Close
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </div>
          )}
          <CCardBody>
            {showForm && (
              <CForm className="row g-3 mb-4" onSubmit={handleFormSubmit}>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="businessTitle"
                    name="businessTitle"
                    label={
                      <span>
                        Business Title <span className="text-danger">*</span>
                      </span>
                    }
                    value={newBusiness.businessTitle}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormSelect
                    id="businessType"
                    name="businessType"
                    label={
                      <span>
                        Business Type <span className="text-danger">*</span>
                      </span>
                    }
                    value={newBusiness.businessType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a business type</option>
                    <option value="Automotive">Automotive </option>
                    <option value="Business Support & Supplies">Business Support & Supplies</option>
                    <option value="Computers & Electronics">Computers & Electronics</option>
                    <option value="Construction & Contractors">Construction & Contractors</option>
                    <option value="Education">Education</option>
                    <option value="Entertainment">Entertainment </option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Health & Medicine">Health & Medicine</option>
                    <option value="Home & Garden">Home & Garden</option>
                    <option value="Legal & Financial">Legal & Financial </option>
                    <option value="Manufacturing, Wholesale,Distribution">Manufacturing, Wholesale, 
                    Distribution  </option>
                    <option value="Merchants">Merchants</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                    <option value="Personal Care & Services">Personal Care & Services</option>
                    <option value="Real Estate">Real Estate</option>  
                    <option value="Travel & Transportation">Travel & Transportation</option>
                  </CFormSelect>
                </CCol>

                <CCol md="6">
                  <label htmlFor="contactNumber" className="form-label">
                    Contact Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="contactNumber"
                    name="contactNumber"
                    value={newBusiness.contactNumber}
                    onChange={handleInputChange}
                    maxLength={10}
                    required
                  />
                </CCol>
                <CCol md="6">
                  <label htmlFor="email" className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={newBusiness.email}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="website"
                    name="website"
                    label="Website"
                    value={newBusiness.website}
                    onChange={handleInputChange}
                  />
                </CCol>
                <CCol md="6">
                  <label htmlFor="photo" className="form-label">
                    Photo 
                  </label>
                  {editMode && newBusiness.photo && (
                    <div className="mb-3">
                      {console.log(newBusiness)}
                      <img
                        src={`${imageUrl}/${newBusiness.photo}`}
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
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="address"
                    name="address"
                    label={
                      <span>
                        Address <span className="text-danger">*</span>
                      </span>
                    }
                    value={newBusiness.address}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
                {/* <CCol md="6">
                  <label htmlFor="parentId" className="form-label">
                    Select User <span className="text-danger">*</span>
                  </label>
                  <CFormSelect
                    id="userId"
                    name="userId"
                    value={newBusiness.userId || '0'}
                    onChange={handleInputChange} // Disable dropdown if userType is not 'user'
                  >
                    <option value="">Select a User</option>
                    {userOptions.map((user) => (
                      <option key={user.userId} value={user.userId}>
                        {user.firstName} {user.lastName} - {user.contactNumber}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol> */}
                <CCol md="6">
                  <label htmlFor="countryId" className="form-label">
                    Country <span className="text-danger">*</span>
                  </label>
                  <CFormSelect
                    id="countryId"
                    name="countryId"
                    value={newBusiness.countryId}
                    onChange={handleCountryChange}
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.countryId} value={country.countryId}>
                        {country.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md="6">
                  <label htmlFor="stateId" className="form-label">
                    State <span className="text-danger">*</span>
                  </label>
                  <CFormSelect
                    id="stateId"
                    name="stateId"
                    value={newBusiness.stateId || ''}
                    onChange={handleStateChange}
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.stateId} value={state.stateId}>
                        {state.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md="6">
                  <label htmlFor="cityId" className="form-label">
                    City <span className="text-danger">*</span>
                  </label>
                  <CFormSelect
                    id="cityId"
                    name="cityId"
                    value={newBusiness.cityId || ''}
                    onChange={handleCityChange}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.cityId} value={city.cityId}>
                        {city.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol xs={12}>
                  <CFormTextarea
                    id="description"
                    name="description"
                    label={
                      <span>
                        Business Description <span className="text-danger">*</span>
                      </span>
                    }
                    value={newBusiness.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </CCol>
                <CCol md="12" className="d-flex justify-content-end">
                  <CButton
                    type="submit"
                    color="primary"
                    className="me-2"
                    onClick={() => console.log('Submit button clicked')}
                  >
                    Submit
                  </CButton>
                  <CButton type="button" color="secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </CButton>
                </CCol>
              </CForm>
            )}
            {!showForm && (
              <>
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Id</CTableHeaderCell>
                      <CTableHeaderCell scope="col">BusinessTitle</CTableHeaderCell>
                      <CTableHeaderCell scope="col">BusinessType</CTableHeaderCell>
                      <CTableHeaderCell scope="col">ContactNumber</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Address</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {business.map((business, index) => (
                      <React.Fragment key={business.businessId}>
                        <CTableRow>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>
                            <span
                              style={{ cursor: 'pointer', color: 'blue' }}
                              onClick={() => handleMoreDetails(business.businessId)}
                            >
                              {business.businessTitle}
                            </span>
                          </CTableDataCell>
                          <CTableDataCell>{business.businessType}</CTableDataCell>
                          <CTableDataCell>{business.contactNumber}</CTableDataCell>
                          <CTableDataCell>{business.address}</CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex align-items-center">
                              <CButton
                                color="primary"
                                size="sm"
                                className="me-1"
                                onClick={() => handleEdit(business.businessId)}
                              >
                                <CIcon icon={cilPencil} />
                              </CButton>
                              <CButton
                                color="danger"
                                size="sm"
                                onClick={() => handleDelete(business.businessId)}
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                              <CButton
                                // color="secondary"
                                size="sm"
                                className="ms-2"
                                onClick={() => handleToggleStatus(business.businessId)}
                                disabled={togglingStatus === business.businessId}
                              >
                                <IoToggle
                                  size={24} // Set the size of the icon
                                  style={{
                                    color: business.status == '1' ? 'green' : 'grey',
                                    transform:
                                      business.status == '1' ? 'rotate(0deg)' : 'rotate(180deg)',
                                    // transition: 'transform 0.1s',
                                  }}
                                />
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableDataCell colSpan="9">
                            <CCollapse visible={selectedbusinessId === business.businessId}>
                              <CCard>
                                <CCardBody>
                                  <CRow className="mb-3">
                                    <CCol md="6">
                                      <strong>Business Title:</strong> {business.businessTitle}
                                    </CCol>
                                    <CCol md="6">
                                      <strong>Business Type:</strong> {business.businessType}
                                    </CCol>
                                  </CRow>
                                  <CRow className="mb-3">
                                    <CCol md="6">
                                      <strong>Contact Number:</strong> {business.contactNumber}
                                    </CCol>
                                    <CCol md="6">
                                      <strong>Address:</strong> {business.address}
                                    </CCol>
                                  </CRow>
                                  <CRow className="mb-3">
                                    <CCol md="6">
                                      <strong>Description:</strong> {business.description}
                                    </CCol>
                                    <CCol md="6">
                                      <strong>Country:</strong> {business.countryName}
                                    </CCol>
                                  </CRow>
                                  <CRow className="mb-3">
                                    <CCol md="6">
                                      <strong>State:</strong> {business.stateName}
                                    </CCol>
                                    <CCol md="6">
                                      <strong>City:</strong> {business.cityName}
                                    </CCol>
                                  </CRow>
                                  <CRow className="mb-3">
                                    <CCol md="6">
                                      <strong>Email:</strong> {business.email}
                                    </CCol>
                                    <CCol md="6">
                                      <strong>Website:</strong>
                                      {business.website ? (
                                        <a
                                          href={business.website}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{ textDecoration: 'none', color: 'blue' }} // optional styling
                                        >
                                          {''} {business.website}
                                        </a>
                                      ) : (
                                        'N/A' // Fallback text if there's no website
                                      )}
                                    </CCol>
                                  </CRow>
                                  <CRow className="mb-3">
                                    <CCol md="12">
                                      <strong>Photo :</strong>{' '}
                                      {business.photo && (
                                        <>
                                          <div>
                                            <img
                                              src={`${imageUrl}/${business.photo}`}
                                              alt="Post Photo"
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
                              </CCard>
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
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default BusinessConnect
