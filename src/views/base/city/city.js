// export default Ads
import { cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cilReload } from '@coreui/icons';
import Papa from 'papaparse';
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
import React, { useEffect, useState , useCallback } from 'react'
import { IoToggle } from 'react-icons/io5'
import { getBackendURL } from '../../../util'
import axiosInstance from '../services/axiosInstance'

const City = () => {
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [city, setCity] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedCityId, setSelectedCityId] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit, setLimit] = useState(10)
  const [file, setFile] = useState(null)
  const [togglingStatus, setTogglingStatus] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isReloading, setIsReloading] = useState(false); // Tracks whether data is being reloaded
  const [searchTerm, setSearchTerm] = useState('')
  const [sortFieldAsc, setSortFieldAsc] = useState('')
  const [sortFieldDesc, setSortFieldDesc] = useState('')
  const [selectedCountry ,setSelectedCountry] = useState(null)
  const [selectedState ,setSelectedState] = useState(null)
  const [newCity, setNewCity] = useState({
    cityId: '',
    stateId: '',
    countryId: '',
    name: '',
  })
  const backendUrl = getBackendURL()  

  useEffect(() => {
    fetchData()
    fetchCountries()
  }, [])

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




  // Define fetchStates function outside of useEffect
  const fetchStates = async (countryId) => {
    try {
      // const response = await axiosInstance.get(`${backendUrl}/apis/states/${countryId}`)
      const response = await axiosInstance.get(`/apis/states/${countryId}`)

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

  // UseEffect for automatically fetching states when newCity.countryId changes
  useEffect(() => {
    if (newCity.countryId) {
      fetchStates(newCity.countryId)
    }
    console.log("here")
  }, [newCity.countryId])

  const handleCountryChange = (e) => {
    const selectedCountryId = e.target.value
    console.log('Selected countryId:', selectedCountryId) // Log selected countryId
    setNewCity({ ...newCity, countryId: selectedCountryId, stateId: '' })
    console.log(selectedCountryId)
    fetchStates(selectedCountryId)
  }

  const handleStateChange = (e) => {
    const selectedStateId = e.target.value
    console.log('Selected stateId:', selectedStateId) // Log selected stateId
    setNewCity({ ...newCity, stateId: selectedStateId })
  }

  const handleMoreDetails = (id) => {
    setSelectedCityId(selectedCityId === id ? null : id)
  }

  const fetchData = async (page = 1, limit = 10, term = '', sortField = '', sortOrder = '') => {
    try {
      // const response = await axiosInstance.get(`${backendUrl}/apis/citylist`, {
      const response = await axiosInstance.get(`/apis/citylist`, {
        params: {
          search: term,
          page: page,
          limit: limit,
          sortField, // Sorting field
          sortOrder, // Sorting order
        },
      })
      if (response.data && response.data.cities) {
        setCity(response.data.cities)
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
  const handleToggleStatus = async (cityId) => {
    setTogglingStatus(cityId) // Indicate which user status is being toggled
    const currentCity = city.find((city) => city.cityId === cityId);
    const currentStatus = currentCity?.status; // Get the current status ('1' for active, '0' for inactive)
  
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
      await axiosInstance.put(`/apis/togglecitystatus/${id}`)

      await fetchData(currentPage, limit)
    } catch (error) {
      console.error(
        'Error toggling city status:',
        error.response ? error.response.data : error.message,
      )
    } finally {
      setTogglingStatus(null) // Reset toggling status
    }
  }
  // Handle file upload
  const handleUploadCSV = async (e) => {
    e.preventDefault()


    if (!selectedCountry) {
      alert("Please select a country before uploading.");
      return;
    }


    if (!selectedState) {
      alert("Please select a State before uploading.");
      return;
    }

    if (!file) {
      alert('No file chosen')
      return
    }

    const formData = new FormData()
    formData.append('csvFile', file) // Key should match the server-side key
    formData.append('countryId' , selectedCountry)
    formData.append('stateId' ,selectedState)

    try {
      const response = await axiosInstance.post(`/apis/addcitiesfromcsv`, formData, {
      // const response = await axiosInstance.post(`${backendUrl}/apis/addcitiesfromcsv`, formData, {
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
      const response = await axiosInstance.get(`/apis/city/${id}`)
      const cityData = response.data.city
      // console.log('DATA: ', donorsData)

      setNewCity({
        cityId: cityData.cityId,
        stateId: cityData.stateId,
        countryId: cityData.countryId, // Include
        name: cityData.cityName,
      })
      setShowForm(true) // Open the form for editing
    } catch (error) {
      console.error('Error fetching cities details:', error)
      alert('Error fetching cities details. Please try again later.')
    }
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
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
      const response = await axiosInstance.put(`/apis/deletecity/${id}`)
      if (response.status === 200) {
        setCity(city.filter((city) => city.cityId !== id))
      } else {
        console.error('Failed to delete City:', response)
        alert('Failed to delete state Please try again.')
      }
    } catch (error) {
      console.error('Error deleting City:', error)
      alert('Error deleting state Please try again.')
    }
  }

  const handleAddState = () => {
    setShowForm(!showForm)
    setNewCity({
      cityId: '',
      stateId: '',
      countryId: '',
      name: '',
    })
    setEditMode(false)
  }

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target

    setNewCity((prevCity) => {
      const updatedCity = { ...prevCity }

      // Handle file inputs
      if (type === 'file') {
        // Only update the photo if a new file is selected
        if (files && files.length > 0) {
          updatedCity[name] = files[0]
        } else {
          // If no new file selected, retain the previous photo
          updatedCity[name] = updatedCity.photo // Retain previous photo
        }
      } else {
        // Handle other input types (e.g., text, date)
        updatedCity[name] = value
      }

      return updatedCity
    })
  }

  const handleExport = async () => {
    try {
      // Making the API call
      const response = await axiosInstance.get(`/apis/citylist/all`, {});
      // const response = await axiosInstance.get(`${backendUrl}/apis/citylist/all`, {});
    
      if (response.data.status === 'true') {
    
        const cities = response.data.cities;
        console.log(cities);
    
        // Map the 'status' field to "Active" or "Inactive" and remove unnecessary fields
        const formattedcities = cities.map((cities , index) => {
          const { createdDate , updatedDate, ...rest } = cities; // Destructure and remove unwanted fields
          return {
            "Sr No": index + 1, // Add sequential numbering
            ...rest,
            createdDate: createdDate ? createdDate.split('T')[0] : '', // Extract only the date
            updatedDate: updatedDate ? updatedDate.split('T')[0] : '', // Extract only the date
            status: cities.status === 1 ? 'Active' : 'Inactive',
          };
        });
    
        // Create CSV file from the response data
        const csvData = Papa.unparse(formattedcities, {
          header: true,
          quotes: true,  // Ensure text fields are quoted in the CSV
        });
    
        // Trigger file download
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) { // Feature detection
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', 'Cities.csv');  // CSV file name
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
    
        console.log("CSV Downloaded");
    
      } else {
        alert('No cities found');
        console.error('No cities found');
      }
    } catch (error) {
      alert('Error fetching cities');
      console.error('Error fetching cities:', error);
    }
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submit handler called')

    // Prepare form data
    const formData = new FormData()
    console.log('newCity before FormData append:', newCity)

    Object.keys(newCity).forEach((key) => {
      if (newCity[key]) {
        formData.append(key, newCity[key])
      } else {
        console.warn(`${key} is empty or undefined`)
      }
    })

    // Debugging: Print FormData entries
    for (let [key, value] of formData.entries()) {
      console.log(`Okay ${key}:`, value)
    }
    // formData.forEach((value, key) => console.log(key, value))
    try {
      let response

      if (editMode) {
        console.log('Updating city...')
        // Update Ad
        response = await axiosInstance.put(`/apis/editcity/${newCity.cityId}`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        })
      } else {
        // console.log(formData)
        console.log('Adding new city...')
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`)
        }
        // Add new Ad
        response = await axiosInstance.post(`/apis/addcity`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        })
      }

      console.log(editMode ? 'Edit Response:' : 'Add Response:', response)

      if (response.status === 200 || response.status === 201) {
        alert(editMode ? 'City updated successfully' : 'City added successfully')

        // Construct the Ad object from the response
        const updatedCity = {
          cityId: response.data.cityId, // Assuming this is returned from the API
          ...newCity,
          photo: newCity.photo ? newCity.photo : '', // Ensure photo exists
        }

        console.log('Updated City:', updatedCity) // Log updateAds to ensure it’s constructed correctly

        setCity((prevCity) =>
          editMode
            ? prevCity.map((city) => (city.cityId === updatedCity.cityId ? updatedCity : city))
            : [...prevCity, updatedCity],
        )
      } else {
        alert(editMode ? 'Error updating City' : 'Error adding City')
      }

      // Reset form after successful submission
      setNewCity({
        cityId: '',
        stateId: '',
        countryId: '',
        name: '',
      })
      // setFormErrors({})
      setShowForm(false)
      setEditMode(false) // Reset edit mode
      fetchData() // Refetch data to reflect changes
    } catch (error) {
      console.error('Error submitting City:', error)
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
            <strong>{showForm ? (editMode ? 'Edit City' : 'Add City') : 'City List'}</strong>
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
                      <option value="name">City Name</option>
                    </select>
                  </div>
                  <div style={{ paddingRight: '10px' }}>
                    <select
                      value={sortFieldDesc}
                      onChange={(e) => handleSortChange(e.target.value, 'desc')}
                      style={{ height: '35px', padding: '5px' }}
                    >
                      <option value="">Sort Descending</option>
                      <option value="name">City Name</option>
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
      Add City
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
                height: '450px',
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

                <select
                      value={selectedCountry}
                      onChange={(e) => {
                        const country = e.target.value;
                        setSelectedCountry(country);
                        fetchStates(country);
                      }}
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

                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "8px",
                        marginBottom: "15px",
                      }}
                    >
                      <option value="">Select a State</option>
                      {states.map((state) => (
                        <option key={state.stateId} value={state.stateId}>
                          {state.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      disabled={!selectedCountry || !selectedState}
                      style={{
                        display: "block",
                        marginBottom: "15px",
                        cursor: selectedCountry && selectedState ? "pointer" : "not-allowed",
                        opacity: selectedCountry && selectedState ? "1" : "0.5",
                      }}
                    />


                    <a
                    href="/city_import_format.csv"
                    download="city_import_format.csv"
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
                    id="name"
                    name="name"
                    label="City's Name"
                    value={newCity.name}
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
                    value={newCity.countryId}
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
                <CCol md="6">
                  <label htmlFor="stateId" className="form-label">
                    State <span className="text-danger">*</span>
                  </label>
                  <CFormSelect
                    id="stateId"
                    name="stateId"
                    value={newCity.stateId || ''}
                    onChange={handleStateChange}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.stateId} value={state.stateId}>
                        {state.name}
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
                      <CTableHeaderCell scope="col">City Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">State Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Country Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {city.map((city, index) => (
                      <React.Fragment key={city.cityId}>
                        <CTableRow>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>
                            <span
                              style={{ cursor: 'pointer', color: 'blue' }}
                              onClick={() => handleMoreDetails(city.cityId)}
                              >
                              {city.cityName}
                            </span>
                          </CTableDataCell>
                          <CTableDataCell>{city.stateName}</CTableDataCell>
                          <CTableDataCell>{city.countryName}</CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex align-items-center">
                              <CButton
                                color="primary"
                                size="sm"
                                className="me-1"
                                onClick={() => handleEdit(city.cityId)}
                              >
                                <CIcon icon={cilPencil} />
                              </CButton>

                              <CButton
                                color="danger"
                                size="sm"
                                onClick={() => handleDelete(city.cityId)}
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                              <CButton
                                // color="secondary"
                                size="sm"
                                className="ms-2"
                                onClick={() => handleToggleStatus(city.cityId)}
                                disabled={togglingStatus === city.cityId}
                              >
                                <IoToggle
                                  size={24} // Set the size of the icon
                                  style={{
                                    color: city.status == '1' ? 'green' : 'grey',
                                    transform:
                                      city.status == '1' ? 'rotate(0deg)' : 'rotate(180deg)',
                                    // transition: 'transform 0.1s',
                                  }}
                                />
                              </CButton>



                            </div>
                          </CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableDataCell colSpan="9">
                            <CCollapse visible={selectedCityId === city.cityId}>
                              <CCard>
                                <CCardBody>
                                  <CRow className="mt-2">
                                    <CCol md="6">
                                      <strong>Name:</strong> {city.cityName}
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

export default City
