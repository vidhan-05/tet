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
  CFormLabel,
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
import { faCalendarAlt, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format } from 'date-fns'
import React, { useEffect, useState , useCallback } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { IoToggle } from 'react-icons/io5'
import { getBackendURL } from '../../../util'
import axiosInstance from '../services/axiosInstance'
const imageUrl = import.meta.env.VITE_IMAGE_URL;
const pdfUrl = import.meta.env.VITE_PDF_URL;

const formatDateForDisplay = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

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

const Magazines = () => {
  const [magazines, setMagazines] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedMagazineId, setSelectedMagazineId] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [file, setFile] = useState(null)
  const [togglingStatus, setTogglingStatus] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [limit, setLimit] = useState(10)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [date, setDate] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortFieldAsc, setSortFieldAsc] = useState('')
  const [isReloading, setIsReloading] = useState(false); // Tracks whether data is being reloaded
  const [sortFieldDesc, setSortFieldDesc] = useState('')
  const [uId, setUId] = useState('')
  const [newMagazine, setNewMagazine] = useState({
    magazineId: '',
    userId: '',
    title: '',
    description: '',
    date: '',
    magazine: '', // Holds the selected PDF file
    photo: '',
    status: 1,
  })
  const backendUrl = getBackendURL()
  useEffect(() => {
    // Fetch magazines from API on component mount
    fetchData()
  }, [])

  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') === 'true') {
      const storedUId = localStorage.getItem('userId')
      if (storedUId) {
        setUId(storedUId)
      }
    }
  }, [])

  const handleMoreDetails = (magazineId) => {
    // Toggle visibility of details
    setSelectedMagazineId(selectedMagazineId === magazineId ? null : magazineId)
  }

  const fetchData = async (
    page = 1,
    limit = 10,
    term = '',
    date = '',
    startDate = '',
    endDate = '',
    sortField = '',
    sortOrder = '',
  ) => {
    // try {
      //   const response = await axiosInstance.get(`/apis/magazines`)
      try {
      const response = await axiosInstance.get(`/apis/magazines`, {
        // const response = await axiosInstance.get(`${backendUrl}/apis/magazines`, {
        params: {
          search: term,
          page: page,
          limit: limit,
          date: date || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          sortField: sortField || undefined,
          sortOrder: sortOrder || undefined,
        },
      })
      if (response.data && response.data.magazines) {
        setMagazines(response.data.magazines)
        setTotalPages(response.data.totalPages)
        setCurrentPage(response.data.currentPage)
      } else {
        console.error('Unexpected response structure:', response)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  // const fetchData = useCallback(
  //   async (
  //     page = 1,
  //     limit = 10,
  //     term = '',
  //     date = '',
  //     startDate = '',
  //     endDate = '',
  //     sortField = '',
  //     sortOrder = ''
  //   ) => {
  //     setIsReloading(true);  // Assuming you have a loading state
  //     try {
  //       const response = await axiosInstance.get(`${backendUrl}/apis/magazines`, {
  //         params: {
  //           search: term,
  //           page,
  //           limit,
  //           date: date || undefined,
  //           startDate: startDate || undefined,
  //           endDate: endDate || undefined,
  //           sortField: sortField || undefined,
  //           sortOrder: sortOrder || undefined,
  //         },
  //       });
  
  //       if (response.data && response.data.magazines) {
  //         setMagazines(response.data.magazines);
  //         setTotalPages(response.data.totalPages);
  //         setCurrentPage(response.data.currentPage);
  //       } else {
  //         console.error('Unexpected response structure:', response);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     } finally {
  //       setIsReloading(false);  // Reset loading state
  //     }
  //   },
  //   [] // Add any necessary dependencies here
  // );
  

  const handleSortChangeAsc = (field) => {
    if (field) {
      setSortFieldAsc(field) // Set the ascending sort field
      setSortFieldDesc('') // Clear the descending sort field
      fetchData(1, 10, searchTerm, '', '', '', field, 'asc') // Fetch data with ascending sort
    } else {
      setSortFieldAsc('') // Reset if no field is selected
    }
  }

  const handleSortChangeDesc = (field) => {
    if (field) {
      setSortFieldDesc(field) // Set the descending sort field
      setSortFieldAsc('') // Clear the ascending sort field
      fetchData(1, 10, searchTerm, '', '', '', field, 'desc') // Fetch data with descending sort,
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

  const onDateChange = (dates) => {
    const [start, end] = dates

    if (!end) {
      // Only `start` is selected, wait for `end` date before closing
      setStartDate(start)
      setEndDate(null)
      setDate(null)
    } else {
      // Both `start` and `end` dates are selected
      const formattedStartDate = start.toLocaleDateString('en-CA')
      const formattedEndDate = end.toLocaleDateString('en-CA')
      setDate(null)
      setStartDate(formattedStartDate)
      setEndDate(formattedEndDate)

      // Close picker and fetch data with date range
      setIsDatePickerOpen(false)
      fetchData(1, 10, '', '', formattedStartDate, formattedEndDate)
    }
  }

  const toggleDatePicker = () => {
    setIsDatePickerOpen((prev) => !prev)
  }

  // Handle search input change
  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term) // Update search term
    fetchData(1, 10, term) // Fetch data based on current input
  }

  const handlePageChange = (page) => {
    if (totalPages && page >= 1 && page <= totalPages) {
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

  const handleToggleStatus = async (magazineId) => {
    setTogglingStatus(magazineId) // Indicate which user status is being toggled
    const currentPublication = magazines.find((magazine) => magazine.magazineId === magazineId);
    const currentStatus = currentPublication?.status; // Get the current status ('1' for active, '0' for inactive)
  
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
      await axiosInstance.put(`/apis/togglemagazinestatus/${magazineId}`)

      await fetchData(currentPage, limit)
    } catch (error) {
      console.error(
        'Error toggling user status:',
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
      const response = await axiosInstance.post(`/apis/addmagazinesfromcsv`, formData, {
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

  const handleFileChange = (magazine) => {
    setFile(magazine.target.files[0])
  }

  const handleEdit = async (id) => {
    console.log(`Edit magazine with ID: ${id}`)
    setEditMode(true) // Set edit mode to true
    try {
      const response = await axiosInstance.get(`/apis/magazinedetails?magazineId=${id}`)
      const magazineData = response.data.magazine
      console.log('DATA: ', magazineData)

      setNewMagazine({
        magazineId: magazineData.magazineId, // Include id for updating
        userId: magazineData.userId,
        title: magazineData.title,
        description: magazineData.description,
        date: magazineData.date,
        photo: magazineData.photo,
        status: magazineData.status,
      })
      setShowForm(true) // Open the form for editing
    } catch (error) {
      console.error('Error fetching magazine details:', error)
      alert('Error fetching magazine details. Please try again later.')
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
      const response = await axiosInstance.put(`/apis/deletemagazine/${id}`)
      if (response.status === 200) {
        setMagazines(magazines.filter((magazine) => magazine.magazineId !== id))
      } else {
        console.error('Failed to delete magazine:', response)
        alert('Failed to delete magazine. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting magazine:', error)
      alert('Error deleting magazine. Please try again.')
    }
  }

  const handleAddMagazine = () => {
    setShowForm(!showForm)
    setNewMagazine({
      title: '',
      userId: '',
      description: '',
      date: '',
      magazine: '',
      photo: '',
      status: 1,
    })
    setEditMode(false)
  }

  const handleInputChange = async (e) => {
    const { name, value, type, files } = e.target

    setNewMagazine((prevMagazine) => {
      const updatedMagazine = { ...prevMagazine }

      // Handle file inputs specifically for PDFs
      if (type === 'file') {
        if (files && files.length > 0) {
          updatedMagazine[name] = files[0]
        } else {
          updatedMagazine[name] = prevMagazine.magazine // Retain the previous PDF file
        }
      } else {
        // Handle other input types (e.g., text, date)
        updatedMagazine[name] = value
      }

      return updatedMagazine
    })
  }

  const handleExport = async () => {
    try {
      // Making the API call
      const response = await axiosInstance.get(`/apis/magazines/all`, {
      // const response = await axiosInstance.get(`${backendUrl}/apis/magazines/all`, {
    });
  
      if (response.data.status === 'true') {

        const magazines = response.data.magazines;
        console.log(magazines);
        
  
        // Map the 'status' field to "Active" or "Inactive"
        const formattedMagazines = magazines.map((magazine, index) => {
          const { magazineId, userId, photo, createdDate  , updatedDate ,  ...rest } = magazine; // Destructure to exclude unwanted fields
          return {
            "Sr No": index + 1, // Add sequential numbering
            ...rest,
            createdDate: createdDate ? createdDate.split('T')[0] : '', // Extract only the date
            updatedDate: updatedDate ? updatedDate.split('T')[0] : '', // Extract only the date
            status: magazine.status === 1 ? 'Active' : 'Inactive', // Format status field
          };
        });
  
        // Create CSV file from the response data
        const csvData = Papa.unparse(formattedMagazines, {
          header: true,
          quotes: true,  // Ensure text fields are quoted in the CSV
        });
  
        // Trigger file download
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) { // Feature detection
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', 'Magazines.csv');  // CSV file name
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        
        console.log("CSV Downloaded");
  
      } else {
        alert('No magazine found');
        console.error('No magazine found');
      }
    } catch (error) {
      alert('Error fetching magazine');
      console.error('Error fetching magazine:', error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    console.log('Form submit handler called')

    const formData = new FormData()
    console.log('newMagazine before FormData append:', newMagazine)

    Object.keys(newMagazine).forEach((key) => {
      if (newMagazine[key]) {
        formData.append(key, newMagazine[key])
      } else {
        console.warn(`${key} is empty or undefined`)
      }
    })

    // Append `addedBy` only if it's not already set in `newEvent`
    if (!newMagazine.userId) {
      formData.append('userId', uId || '')
    }

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value)
    }

    try {
      console.log('Is editMode:', editMode)

      let response

      if (editMode) {
        console.log('Updating magazine...')
        console.log(formData)
        // Call edit magazine API
        response = await axiosInstance.put(
          `/apis/editmagazine/${newMagazine.magazineId}`,
          // `${backendUrl}/apis/editmagazine/${newMagazine.magazineId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            timeout: 30000,
          },
        )
      } else {
        console.log('Adding new magazine...')
        // Call add magazine API
        response = await axiosInstance.post(`/apis/addmagazine`, formData, {
          // response = await axiosInstance.post(`${backendUrl}/apis/addmagazine`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        })
      }

      console.log(editMode ? 'Edit Response:' : 'Add Response:', response)

      if (response.status === 200 || response.status === 201) {
        alert(editMode ? 'Magazine updated successfully' : 'Magazine added successfully')

        // Construct the magazine object from the response
        const updatedMagazine = {
          magazineId: response.data.magazineId, // Assuming this is returned from the API
          ...newMagazine,
          magazine: newMagazine.magazine ? newMagazine.magazine.name : '', // Ensure magazine (PDF) exists
        }

        console.log('Updated Magazine:', updatedMagazine) // Log updatedMagazine to ensure it’s constructed correctly

        setMagazines((prevMagazines) =>
          editMode
            ? prevMagazines.map((magazine) =>
                magazine.magazineId === updatedMagazine.magazineId ? updatedMagazine : magazine,
              )
            : [...prevMagazines, updatedMagazine],
        )
      } else {
        alert(editMode ? 'Error updating magazine' : 'Error adding magazine')
      }

      // Reset form after successful submission
      setNewMagazine({
        magazineId: '',
        title: '',
        userId: '',
        description: '',
        date: '',
        magazine: '',
        photo: '',
        status: 1,
      })
      // setFormErrors({})
      setShowForm(false)
      fetchData() // Refresh the magazine list
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
              {showForm ? (editMode ? 'Edit Publication' : 'Add Publication') : 'Publication List'}
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
                      <option value="title">Title</option>
                      <option value="date">Date</option>
                      <option value="description">Description</option>
                    </select>
                  </div>
                  <div style={{ paddingRight: '10px' }}>
                    <select
                      value={sortFieldDesc}
                      onChange={(e) => handleSortChange(e.target.value, 'desc')}
                      style={{ height: '35px', padding: '5px' }}
                    >
                      <option value="">Sort Descending</option>
                      <option value="title">Title</option>
                      <option value="date">Date</option>
                      <option value="description">Description</option>
                    </select>
                  </div>
                  {/* Date Filter */}
                  {/* Calendar Icon to Open Date Picker */}
                  <div style={{ position: 'relative' }}>
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      style={{
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#007bff',
                        paddingRight: '10px',
                      }}
                      onClick={toggleDatePicker} // Toggle date picker on icon click
                    />

                    {/* DatePicker Dropdown */}
                    {isDatePickerOpen && (
                      <div style={{ position: 'absolute', top: '30px', zIndex: 1000 }}>
                        <DatePicker
                          selected={startDate}
                          onChange={onDateChange}
                          startDate={startDate}
                          endDate={endDate}
                          selectsRange
                          inline // Show calendar inline below the icon
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
{!showForm && (
  <>
    <CButton
      color="primary"
      onClick={handleAddMagazine}
      style={{ marginRight: '11px', marginBottom: '10px' }}
    >
      Add Publication
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
              <CForm className="row g-3" onSubmit={handleFormSubmit}>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="title"
                    name="title"
                    label={
                      <span>
                        Publication Title <span className="text-danger">*</span>
                      </span>
                    }
                    value={newMagazine.title || ''}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="date"
                    name="date"
                    id="date"
                    label="Date"
                    value={formatDate(newMagazine.date) || ''}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
                {/* <CCol xs={12}>
                  <CFormInput
                    type="text"
                    id="userId"
                    name="userId"
                    label="userId"
                    value={newMagazine.userId}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </CCol> */}
                <CCol md="6">
                  <label htmlFor="photo" className="form-label">
                    Photo
                  </label>
                  {editMode && newMagazine.photo && (
                    <div className="mb-3">
                      <img
                        src={`${imageUrl}/${newMagazine.photo}`}
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
                  <CFormLabel htmlFor="inputPDF">
                    PDF File <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="file"
                    id="magazine"
                    name="magazine"
                    onChange={handleInputChange}
                    // required
                    accept=".pdf"
                  />
                </CCol>
                <CCol xs={12}>
                  <CFormTextarea
                    id="description"
                    name="description"
                    label={
                      <span>
                        Description <span className="text-danger">*</span>
                      </span>
                    }
                    value={newMagazine.description || ''}
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
                    {/* {editMode ? 'Update Event' : 'Add Event'} */}Submit
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
                      <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                      {/* <CTableHeaderCell scope="col">PDF File</CTableHeaderCell> */}
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {magazines.map((magazine, index) => (
                      <React.Fragment key={magazine.magazineId}>
                        <CTableRow>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>
                            <span
                              style={{ cursor: 'pointer', color: 'blue' }}
                              onClick={() => handleMoreDetails(magazine.magazineId)}
                            >
                              {magazine.title}
                            </span>
                          </CTableDataCell>
                          <CTableDataCell>{formatDateForDisplay(magazine.date)}</CTableDataCell>
                          <CTableDataCell>
                            {magazine.description.length > 33
                              ? `${magazine.description.slice(0, 33)}...`
                              : magazine.description}
                          </CTableDataCell>
                          {/* <CTableDataCell>{magazine.description}</CTableDataCell> */}
                          <CTableDataCell>
                            <CButton
                              color="primary"
                              size="sm"
                              className="me-1"
                              onClick={() => handleEdit(magazine.magazineId)}
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => handleDelete(magazine.magazineId)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                            <CButton
                              // color="secondary"
                              size="sm"
                              className="ms-2"
                              onClick={() => handleToggleStatus(magazine.magazineId)}
                              disabled={togglingStatus === magazine.magazineId}
                            >
                              <IoToggle
                                size={24} // Set the size of the icon
                                style={{
                                  color: magazine.status == '1' ? 'green' : 'grey',
                                  transform:
                                    magazine.status == '1' ? 'rotate(0deg)' : 'rotate(180deg)',
                                  // transition: 'transform 0.1s',
                                }}
                              />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableDataCell colSpan="9">
                            <CCollapse visible={selectedMagazineId === magazine.magazineId}>
                              <CCard>
                                <CCardBody>
                                  <CRow>
                                    <CCol md="12">
                                      <strong>Title:</strong> {magazine.title}
                                    </CCol>
                                  </CRow>
                                  <CRow className="mt-2">
                                    <CCol md="6">
                                      <strong>Date:</strong> {formatDateForDisplay(magazine.date)}
                                    </CCol>
                                  </CRow>
                                  <CRow className="mt-2">
                                    <CCol md="12">
                                      <strong>Description:</strong> {magazine.description}
                                    </CCol>
                                  </CRow>
                                  <CRow className="mt-2">
                                    <CCol md="12">
                                      <strong>Photo :</strong>{' '}
                                      {magazine.photo && (
                                        <>
                                          <div>
                                            <img
                                              src={`${imageUrl}/${magazine.photo}`}
                                              alt="Magazine Photo"
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
                                  <CRow className="mt-2">
                                    <CCol md="12">
                                      <strong>Magazine:</strong>&nbsp;&nbsp;
                                      <a
                                        href={`${pdfUrl}/${magazine.magazine}`}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        View
                                      </a>
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

export default Magazines
