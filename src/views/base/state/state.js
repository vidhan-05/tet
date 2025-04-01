// export default Ads
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
import React, { useEffect, useState ,useCallback } from 'react'
import { IoToggle } from 'react-icons/io5'
import { getBackendURL } from '../../../util'
import axiosInstance from '../services/axiosInstance'

const State = () => {
  const [countries, setCountries] = useState([])
  const [state, setState] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedStateId, setselectedStateId] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit, setLimit] = useState(10)
  const [file, setFile] = useState(null)
  const [togglingStatus, setTogglingStatus] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isReloading, setIsReloading] = useState(false); // Tracks whether data is being reloaded
  const [sortFieldAsc, setSortFieldAsc] = useState('')
  const [sortFieldDesc, setSortFieldDesc] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry ,setSelectedCountry] = useState(null)
  const [newState, setNewState] = useState({
    stateId: '',
    countryId: '',
    name: '',
  })
  const backendUrl = getBackendURL()

  useEffect(() => {
    fetchData()
    fetchCountries()
  }, [])
  useEffect(() => {
    console.log(state)
  }, [state])
  const fetchCountries = async () => {
    try {
      // const response = await axiosInstance.get(`${backendUrl}/apis/countries`)
      const response = await axiosInstance.get(`/apis/countries`)

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

  const handleCountryChange = (e) => {
    const selectedCountryId = e.target.value
    console.log('Selected countryId:', selectedCountryId) // Log selected countryId
    setNewState({ ...newState, countryId: selectedCountryId })
  }

  const handleMoreDetails = (id) => {
    setselectedStateId(selectedStateId === id ? null : id)
  }

  const fetchData = async (page = 1, limit = 10, term = '', sortField = '', sortOrder = '') => {
    try {
      // const response = await axiosInstance.get(`${backendUrl}/apis/statelist`, {
      const response = await axiosInstance.get(`/apis/statelist`, {
        params: {
          search: term,
          page: page,
          limit: limit,
          sortField, // Sorting field
          sortOrder, // Sorting order
        },
      })
      if (response.data && response.data.states) {
        setState(response.data.states)
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

  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)
    fetchData(1, 10, term)
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchData(page, limit)
    }
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
  const handleToggleStatus = async (stateId) => {
    setTogglingStatus(stateId) // Indicate which user status is being toggled
    const currentState = state.find((state) => state.stateId === stateId) ;
    const currentStatus = currentState?.status; // Get the current status ('1' for active, '0' for inactive)
  
    // Determine the action based on the current status
    const action = currentStatus === 1 ? 'inactive' : 'active';
    console.log(currentStatus);
    console.log(action);

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
      await axiosInstance.put(`/apis/togglestatestatus/${id}`)

      await fetchData(currentPage, limit)
    } catch (error) {
      console.error(
        'Error toggling state status:',
        error.response ? error.response.data : error.message,
      )
    } finally {
      setTogglingStatus(null) // Reset toggling status
    }
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleUploadCSV = async (e) => {
    e.preventDefault();
  
    if (!selectedCountry) {
      alert("Please select a country before uploading.");
      return;
    }
  
    if (!file) {
      alert("No file chosen");
      return;
    }
  
    setUploading(true); // Set loading state
  
    const formData = new FormData();
    formData.append("csvFile", file); // Ensure key matches backend
    formData.append("countryId", selectedCountry); // Include selected country
    console.log(selectedCountry)
    try {
      const response = await axiosInstance.post("/apis/addstatesfromcsv", formData, {
      // const response = await axiosInstance.post(`${backendUrl}/apis/addstatesfromcsv`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure proper form data headers
        },
      });
  
      console.log("Upload successful:", response.data);
      alert("File uploaded successfully.");
      fetchData(); // Refresh data after upload
      setIsPopupOpen(false); // Close popup
    } catch (error) {
      console.error("Error uploading file:", error.response ? error.response.data : error.message);
      alert("Failed to upload file.");
    } finally {
      setUploading(false); // Reset uploading status
    }
  };
  

  const handleEdit = async (id) => {
    console.log(`Edit ad with ID: ${id}`)
    setEditMode(true) // Set edit mode to true
    try {
      const response = await axiosInstance.get(`/apis/state/${id}`)
      const stateData = response.data.state
      // console.log('DATA: ', donorsData)

      setNewState({
        stateId: stateData.stateId,
        countryId: stateData.countryId, // Include
        name: stateData.stateName,
      })
      setShowForm(true) // Open the form for editing
    } catch (error) {
      console.error('Error fetching states details:', error)
      alert('Error fetching states details. Please try again later.')
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
      const response = await axiosInstance.put(`/apis/deletestate/${id}`)
      if (response.status === 200) {
        setState(state.filter((states) => states.stateId !== id))
      } else {
        console.error('Failed to delete state:', response)
        alert('Failed to delete state Please try again.')
      }
    } catch (error) {
      console.error('Error deleting state:', error)
      alert('Error deleting state Please try again.')
    }
  }

  const handleAddState = () => {
    setShowForm(!showForm)
    setNewState({
      stateId: '',
      countryId: '',
      name: '',
    })
    setEditMode(false)
  }

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target

    setNewState((prevState) => {
      const updatedState = { ...prevState }

      // Handle file inputs
      if (type === 'file') {
        // Only update the photo if a new file is selected
        if (files && files.length > 0) {
          updatedState[name] = files[0]
        } else {
          // If no new file selected, retain the previous photo
          updatedState[name] = prevState.photo // Retain previous photo
        }
      } else {
        // Handle other input types (e.g., text, date)
        updatedState[name] = value
      }

      return updatedState
    })
  }


  const handleExport = async () => {
    try {
      // Making the API call
      const response = await axiosInstance.get(`/apis/statelist/all`, {
      // const response = await axiosInstance.get(`${backendUrl}/apis/statelist/all`, {
    });
  
      if (response.data.status === 'true') {

        const states = response.data.states;
        console.log(states);
        
  
        // Map the 'status' field to "Active" or "Inactive"
        const formattedstates = states.map((states, index) => {
          const { stateId, countryId, createdDate ,updatedDate , ...rest } = states; // Destructure to exclude unwanted fields
          return {
            "Sr No": index + 1, // Add sequential numbering
            ...rest,
            createdDate: createdDate ? createdDate.split('T')[0] : '', // Extract only the date
            updatedDate: updatedDate ? updatedDate.split('T')[0] : '', // Extract only the date
            status: states.status === 1 ? 'Active' : 'Inactive', // Format status field
          };
        });
  
        // Create CSV file from the response data
        const csvData = Papa.unparse(formattedstates, {
          header: true,
          quotes: true,  // Ensure text fields are quoted in the CSV
        });
  
        // Trigger file download
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) { // Feature detection
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', 'States.csv');  // CSV file name
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        
        console.log("CSV Downloaded");
  
      } else {
        alert('No states found');
        console.error('No states found');
      }
    } catch (error) {
      alert('Error fetching states');
      console.error('Error fetching states:', error);
    }
  };



  const handleFormSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submit handler called')

    // Prepare form data
    const formData = new FormData()
    console.log('newState before FormData append:', newState)

    Object.keys(newState).forEach((key) => {
      if (newState[key]) {
        formData.append(key, newState[key])
      } else {
        console.warn(`${key} is empty or undefined`)
      }
    })

    // Debugging: Print FormData entries
    for (let [key, value] of formData.entries()) {
      console.log(`Okay ${key}:`, value)
      console.log(newState.stateId)
    }
    // formData.forEach((value, key) => console.log(key, value))
    try {
      let response

      if (editMode) {
        console.log('Updating state...')
        // Update Ad
        response = await axiosInstance.put(`/apis/editstate/${newState.stateId}`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        })
      } else {
        // console.log(formData)
        console.log('Adding new state...')
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`)
        }
        // Add new Ad
        response = await axiosInstance.post(`/apis/addstate`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        })
      }

      console.log(editMode ? 'Edit Response:' : 'Add Response:', response)

      if (response.status === 200 || response.status === 201) {
        alert(editMode ? 'State updated successfully' : 'State added successfully')

        // Construct the Ad object from the response
        const updatedState = {
          stateId: response.data.stateId, // Assuming this is returned from the API
          ...newState,
          photo: newState.photo ? newState.photo : '', // Ensure photo exists
        }

        console.log('Updated State:', updatedState) // Log updateAds to ensure it’s constructed correctly

        setState((prevState) =>
          editMode
            ? prevState.map((state) =>
                state.stateId === updatedState.stateId ? updatedState : state,
              )
            : [...prevState, updatedState],
        )
      } else {
        alert(editMode ? 'Error updating State' : 'Error adding State')
      }

      // Reset form after successful submission
      setNewState({
        stateId: '',
        countryId: '',
        name: '',
      })
      // setFormErrors({})
      setShowForm(false)
      setEditMode(false) // Reset edit mode
      fetchData() // Refetch data to reflect changes
    } catch (error) {
      console.error('Error submitting State:', error)
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
            <strong>{showForm ? (editMode ? 'Edit State' : 'Add State') : 'State List'}</strong>
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
                      <option value="name">State Name</option>
                    </select>
                  </div>
                  <div style={{ paddingRight: '10px' }}>
                    <select
                      value={sortFieldDesc}
                      onChange={(e) => handleSortChange(e.target.value, 'desc')}
                      style={{ height: '35px', padding: '5px' }}
                    >
                      <option value="">Sort Descending</option>
                      <option value="name">State Name</option>
                    </select>
                  </div>
                </>
              )}
{!showForm && (
  <>
      <CButton
        color="primary"
        onClick={togglePopup}
        style={{ marginRight: '11px', marginBottom: '10px' }}
      >
        Import
      </CButton>

    <CButton
      color="primary"
      onClick={handleAddState}
      style={{ marginRight: '11px', marginBottom: '10px' }}
    >
      Add State
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
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "500px",
                  height: "350px",
                  backgroundColor: "#fff",
                  boxShadow: "0 0 15px rgba(0, 0, 0, 0.3)",
                  zIndex: 1050,
                  borderRadius: "8px",
                  padding: "20px",
                }}
              >
                <CCard>
                  <CCardHeader>Upload CSV File</CCardHeader>
                  <CCardBody>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "8px",
                        marginBottom: "15px",
                      }}
                    >
                      <option value="">Select a country</option>
                      {countries.map((country) => (
                        <option key={country.countryId} value={country.countryId}>
                          {country.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      disabled={!selectedCountry}
                      style={{
                        display: "block",
                        marginBottom: "15px",
                        cursor: selectedCountry ? "pointer" : "not-allowed",
                        opacity: selectedCountry ? "1" : "0.5",
                      }}
                    />
                  <a
                    href="/states_import_format.csv"
                    download="states_import_format.csv"
                    style={{
                      display: 'block',
                      marginBottom: '15px',
                      color: "#4DA8DA",
                    
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                    >
                    Download Sample CSV
                  </a>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "50px",
                      }}
                    >
                      <CButton
                        color="primary"
                        onClick={handleUploadCSV}
                        style={{ width: "49%" }}
                      >
                        Upload
                      </CButton>
                      <CButton
                        color="secondary"
                        onClick={togglePopup}
                        style={{ width: "49%" }}
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
                    id="name"
                    name="name"
                    label="State's Name"
                    value={newState.name}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
                <CCol md="6">
                  <label htmlFor="countryId" className="form-label">
                    Country <span className="text-danger">*</span>
                  </label>
                  <CFormSelect
                    id="countryId"
                    name="countryId"
                    value={newState.countryId}
                    onChange={handleCountryChange}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.countryId} value={country.countryId}>
                        {country.name}
                      </option>
                    ))}
                  </CFormSelect>
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
                      <CTableHeaderCell scope="col">State Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Country Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {state.map((state, index) => (
                      <React.Fragment key={state.stateId}>
                        <CTableRow>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>
                            <span
                              style={{ cursor: 'pointer', color: 'blue' }}
                              onClick={() => handleMoreDetails(state.stateId)}
                            >
                              {state.stateName}
                            </span>
                          </CTableDataCell>
                          <CTableDataCell>{state.countryName}</CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex align-items-center">
                              <CButton
                                color="primary"
                                size="sm"
                                className="me-1"
                                onClick={() => handleEdit(state.stateId)}
                              >
                                <CIcon icon={cilPencil} />
                              </CButton>
                              <CButton
                                color="danger"
                                size="sm"
                                onClick={() => handleDelete(state.stateId)}
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                              <CButton
                                // color="secondary"
                                size="sm"
                                className="ms-2"
                                onClick={() => handleToggleStatus(state.stateId)}
                                disabled={togglingStatus === state.stateId}
                              >
                                <IoToggle
                                  size={24} // Set the size of the icon
                                  style={{
                                    color: state.status == '1' ? 'green' : 'grey',
                                    transform:
                                      state.status == '1' ? 'rotate(0deg)' : 'rotate(180deg)',
                                    // transition: 'transform 0.1s',
                                  }}
                                />
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableDataCell colSpan="9">
                            <CCollapse visible={selectedStateId === state.stateId}>
                              <CCard>
                                <CCardBody>
                                  <CRow className="mt-2">
                                    <CCol md="6">
                                      <strong>Name:</strong> {state.stateName}
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

export default State
