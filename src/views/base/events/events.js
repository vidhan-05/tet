// export default Events
import { cilPencil, cilTrash } from '@coreui/icons'
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cilReload } from '@coreui/icons';
import CIcon from '@coreui/icons-react'
import Papa from 'papaparse';
import {
  CButton,CSpinner,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CForm,
  CFormInput,
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
import React, { useEffect, useState, useCallback } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { IoToggle } from 'react-icons/io5'
import { getBackendURL } from '../../../util'
import axiosInstance from '../services/axiosInstance'
const imageUrl = import.meta.env.VITE_IMAGE_URL;

const formatDateForDisplay = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

const getMinDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0] // Format as YYYY-MM-DD
}

const Events = () => {
  const [events, setEvents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [userOptions, setUserOptions] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [limit, setLimit] = useState(10)
  const [date, setDate] = useState(null)
  const [file, setFile] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [togglingStatus, setTogglingStatus] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortFieldAsc, setSortFieldAsc] = useState('')
  const [sortFieldDesc, setSortFieldDesc] = useState('')
  const [users, setUsers] = useState([]); // Stores the fetched users data
  const [isReloading, setIsReloading] = useState(false); // Tracks whether data is being reloaded
  const [displayedUsers, setDisplayedUsers] = useState([]); // Stores the displayed users
  const [isChildList, setIsChildList] = useState(false); // Tracks whether the child list is being shown
  const [showBackButton, setShowBackButton] = useState(false); // Controls the visibility of the back button
  const [mode, setMode] = useState('list'); // Tracks the current mode (e.g., 'list', 'details', etc.)
  
  const [uId, setUId] = useState('')
  const [newEvent, setNewEvent] = useState({
    eventId: '',
    name: '',
    type: '',
    date: '',
    description: '',
    status: 1,
    photo: '',
    addedBy: '',
    image1: '',
    image2: '',
    image3: '',
    image4: '',
  })
  const backendUrl = getBackendURL()

  useEffect(() => {
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(`/apis/allusers?parentId=0`) // Your API endpoint
        setUserOptions(response.data.users)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  const handleMoreDetails = (eventId) => {
    setSelectedEventId(selectedEventId === eventId ? null : eventId)
  }

  const formatDate = (date) => {
    if (!date) return '' // If date is falsy, return an empty string
    const parsedDate = new Date(date) // Parse the date

    // Check if the parsed date is valid
    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date:', date)
      return '' // Return empty string if date is invalid
    }

    return parsedDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
  }

  // Update the fetchData function to handle conditional date and range
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
    try {
      // const response = await axiosInstance.get(`${backendUrl}/apis/events`, {
        const response = await axiosInstance.get(`/apis/events`, {
        params: {
          search: term,
          page,
          limit,
          date: date || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          sortField: sortField || undefined,
          sortOrder: sortOrder || undefined,
        },
      })
      if (response.data && response.data.events) {
        setEvents(response.data.events)
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
  //     setIsReloading(true);
  //     try {
  //       // const response = await axiosInstance.get(`/apis/events`, {
  //         const response = await axiosInstance.get(`${backendUrl}/apis/events`, {
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
  //       if (response.data && response.data.events) {
  //         setEvents(response.data.events);
  //         setDisplayedUsers([]); // Assuming it should match your provided structure
  //         setIsChildList(false); // Assuming this is still applicable
  //         setTotalPages(response.data.totalPages);
  //         setCurrentPage(response.data.currentPage);
  //         setShowBackButton(false);
  //         setMode('list');
  //       } else {
  //         console.error('Unexpected response structure:', response);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     } finally {
  //       setIsReloading(false);
  //     }
  //   },
  //   []
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

  // // Handle Date Change
  // const onDateChange = (dates) => {
  //   const [start, end] = dates

  //   // Check if only a single date is selected or a range
  //   if (!end) {
  //     // If end date is not selected, consider it a single date filter
  //     const formattedDate = start.toLocaleDateString('en-CA')
  //     setDate(formattedDate)
  //     setStartDate(null)
  //     setEndDate(null)
  //     setIsDatePickerOpen(false)
  //     fetchData(1, 10, '', formattedDate) // Fetch with specific date
  //   } else {
  //     // For a range, clear single date and set start and end dates
  //     const formattedStartDate = start.toLocaleDateString('en-CA')
  //     const formattedEndDate = end.toLocaleDateString('en-CA')
  //     setDate(null)
  //     setStartDate(formattedStartDate)
  //     setEndDate(formattedEndDate)
  //     setIsDatePickerOpen(false)
  //     fetchData(1, 10, '', '', formattedStartDate, formattedEndDate) // Fetch with range
  //   }
  // }

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

  // Handle search input change
  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term) // Update search term
    fetchData(1, 10, term) // Fetch data based on current input
  }

  const toggleDatePicker = () => {
    setIsDatePickerOpen((prev) => !prev)
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
  

  const handleToggleStatus = async (eventId) => {
    setTogglingStatus(eventId) // Indicate which user status is being toggled

    const currentEvent = events.find((event) => event.eventId === eventId);
    const currentStatus = currentEvent?.status; // Get the current status ('1' for active, '0' for inactive)
  
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
      await axiosInstance.put(`/apis/toggleeventstatus/${eventId}`)
      await fetchData(currentPage, limit)
    } catch (error) {
      console.error(
        'Error toggling event status:',
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
      const response = await axiosInstance.post(`/apis/addeventsfromcsv`, formData, {
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
  const handleEdit = async (id) => {
    console.log(`Edit event with ID: ${id}`)
    setEditMode(true) // Set edit mode to true
    try {
      const response = await axiosInstance.get(`/apis/eventdetails?eventId=${id}`)
      const eventData = response.data.event
      console.log('DATA: ', eventData)

      setNewEvent({
        eventId: eventData.eventId, // Include id for updating
        name: eventData.name,
        type: eventData.type,
        date: eventData.date,
        description: eventData.description,
        status: eventData.status,
        photo: eventData.photo,
        addedBy: eventData.addedBy,
        image1: eventData.image1,
        image2: eventData.image2,
        image3: eventData.image3,
        image4: eventData.image4,
        link : eventData.link,
      })
      setShowForm(true) // Open the form for editing
    } catch (error) {
      console.error('Error fetching event details:', error)
      alert('Error fetching event details. Please try again later.')
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
      const response = await axiosInstance.put(`/apis/deleteevent/${id}`)
      if (response.status === 200) {
        setEvents(events.filter((event) => event.eventId !== id))
      } else {
        console.error('Failed to delete event:', response)
        alert('Failed to delete event. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Error deleting event. Please try again.')
    }
  }

  const handleAddEvent = () => {
    setShowForm(!showForm)
    setNewEvent({
      name: '',
      type: '',
      date: '',
      description: '',
      status: 1,
      photo: '',
      addedBy: '',
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      link : '',
    })
    setEditMode(false)
  }

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target

    setNewEvent((prevEvent) => {
      const updatedEvent = { ...prevEvent }
      // Handle file inputs
      if (type === 'file' && files.length > 0) {
        updatedEvent[name] = files[0] // Set the new file
      } else if (type === 'file') {
        // If no new file selected, retain the previous photo
        updatedEvent[name] = prevEvent.photo // Retain previous photo
      } else {
        // Handle other input types (e.g., text, date)
        updatedEvent[name] = value
      }

      return updatedEvent
    })
  }

  const handleExport = async () => {
    try {
      // Making the API call
      const response = await axiosInstance.get(`/apis/event/all`);
      // const response = await axiosInstance.get(`${backendUrl}/apis/event/all`);
  
      if (response.data.status === 'true') {
        const events = response.data.events;
        console.log(events);
  
        // Exclude unwanted fields and map the 'status' field
        const formattedEvents = events.map((event , index) => {
          const { eventId, photo,createdDate, updatedDate, image1, image2, image3, image4, addedBy, ...rest } = event; // Destructure to exclude fields
          return {
            "Sr No": index + 1, // Add sequential numbering
            ...rest,
            createdDate: createdDate ? createdDate.split('T')[0] : '', // Extract only the date
            updatedDate: updatedDate ? updatedDate.split('T')[0] : '', // Extract only the date
            status: event.status === 1 ? 'Active' : 'Inactive',
          };
        });
  
        // Create CSV file from the response data
        const csvData = Papa.unparse(formattedEvents, {
          header: true,
          quotes: true, // Ensure text fields are quoted in the CSV
        });
  
        // Trigger file download
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) { // Feature detection
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', 'events.csv'); // CSV file name
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
  
        console.log("CSV Downloaded");
      } else {
        alert('No events found');
        console.error('No events found');
      }
    } catch (error) {
      alert('Error fetching events');
      console.error('Error fetching events:', error);
    }
  };
  

  // // Handle file selection
  // const handleFileChange = (event) => {
  //   setFile(event.target.files[0])
  // }

  const handleFileChange = (e) => {
    const file = e.target.files[0] // Get the first file
    setNewEvent((prevState) => ({
      ...prevState,
      photo: file,
    }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submit handler called')

    // Prepare form data
    const formData = new FormData()
    console.log('newEvent before FormData append:', newEvent)

    Object.keys(newEvent).forEach((key) => {
      if (newEvent[key]) {
        formData.append(key, newEvent[key])
      } else {
        console.warn(`${key} is empty or undefined`)
      }
    })

    // Append `addedBy` only if it's not already set in `newEvent`
    if (!newEvent.addedBy) {
      formData.append('addedBy', uId || '')
    }
    // Debugging: Print FormData entries
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value)
    }
    formData.forEach((value, key) => console.log(key, value))
    try {
      let response

      if (editMode) {
        console.log('Updating event...')
        // Update event
        response = await axiosInstance.put(`/apis/editevent/${newEvent.eventId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        })
      } else {
        // console.log(formData)
        console.log('Adding new event...')
        const formDataObj = {}
        for (let [key, value] of formData.entries()) {
          formDataObj[key] = value
        }
        console.log('FormData as Object:', formDataObj)
        // Add new event
        response = await axiosInstance.post(`/apis/addevent`, formData, {
        // response = await axiosInstance.post(`${backendUrl}/apis/addevent`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        })
      }

      console.log(editMode ? 'Edit Response:' : 'Add Response:', response)

      if (response.status === 200 || response.status === 201) {
        alert(editMode ? 'Event updated successfully' : 'Event added successfully')

        // Construct the event object from the response
        const updatedEvent = {
          eventId: response.data.eventId, // Assuming this is returned from the API
          ...newEvent,
          photo: newEvent.photo ? newEvent.photo : '', // Ensure photo exists
        }

        console.log('Updated Event:', updatedEvent) // Log updatedEvent to ensure it’s constructed correctly

        setEvents((prevEvents) =>
          editMode
            ? prevEvents.map((event) =>
                event.eventId === updatedEvent.eventId ? updatedEvent : event,
              )
            : [...prevEvents, updatedEvent],
        )
      } else {
        alert(editMode ? 'Error updating event' : 'Error adding event')
      }

      // Reset form after successful submission
      setNewEvent({
        name: '',
        type: '',
        date: '',
        description: '',
        status: 1,
        photo: '',
        addedBy: '',
        image1: '',
        image2: '',
        image3: '',
        image4: '',
        link : '',
      })
      // setFormErrors({})
      setShowForm(false)
      setEditMode(false) // Reset edit mode
      fetchData() // Refetch data to reflect changes
    } catch (error) {
      console.error('Error submitting event:', error)
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
            <strong>{showForm ? (editMode ? 'Edit Event' : 'Add Event') : 'Event List'}</strong>
            
            
            <div className="d-flex align-items-center">
            {showForm === 'Event List' && (

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
                      <option value="name">Name</option>
                      <option value="type">Type</option>
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
                      <option value="name">Name</option>
                      <option value="type">Type</option>
                      <option value="date">Date</option>
                      <option value="description">Description</option>
                    </select>
                  </div>
                  {/* Date Filter */}
                  {/* Calendar Icon to Open Date Picker */}
                  {/* <div style={{ position: 'relative' }}>
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      style={{
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#007bff',
                        paddingRight: '10px',
                      }}
                      onClick={toggleDatePicker} // Toggle date picker on icon click
                    /> */}
                  {/* DatePicker Dropdown */}
                  {/* {isDatePickerOpen && (
                      <div style={{ position: 'absolute', top: '30px', zIndex: 1000 }}>
                        <DatePicker
                          selected={startDate}
                          onChange={onDateChange}
                          startDate={startDate}
                          endDate={endDate}
                          selectsRange
                          inline // Show calendar inline below the icon
                        />
                      </div> */}
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
                          selected={startDate} // Selected date for single date selection
                          onChange={onDateChange} // Handles date change logic
                          startDate={startDate} // Start date in range
                          endDate={endDate} // End date in range
                          selectsRange // Enables range selection
                          inline // Keeps picker open and inline
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
      onClick={togglePopup}
      style={{ marginRight: '11px', marginBottom: '10px' }}
    >
      Import
    </CButton>

    <CButton
      color="primary"
      onClick={handleAddEvent}
      style={{ marginRight: '11px', marginBottom: '10px' }}
    >
      Add Event
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
                  <a
                    href="/event_import_template.csv"
                    download="event_import_template.csv"
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
                    label={
                      <span>
                        Event Name <span className="text-danger">*</span>
                      </span>
                    }
                    value={newEvent.name}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    id="type"
                    name="type"
                    label={
                      <span>
                        Event Type <span className="text-danger">*</span>
                      </span>
                    }
                    value={newEvent.type}
                    onChange={handleInputChange}
                    required
                  ></CFormInput>
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="date"
                    id="date"
                    name="date"
                    label={
                      <span>
                        Date <span className="text-danger">*</span>
                      </span>
                    }
                    value={formatDate(newEvent.date) || ''}
                    onChange={handleInputChange}
                    min={getMinDate()}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="link"
                    id="link"
                    name="link"
                    label={
                      <span>
                        Link for Registration
                      </span>
                    }
                    value={newEvent.link}
                    onChange={handleInputChange}
                    
                  />
                </CCol>
                <CCol md="6">
                  <label htmlFor="photo" className="form-label">
                    Photo
                  </label>
                  {editMode && newEvent.photo && (
                    <div className="mb-3">
                      <img
                        src={`${imageUrl}/${newEvent.photo}`}
                        alt="Event Photo"
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
                <CCol md="6">
                  <label htmlFor="image1" className="form-label">
                    image1
                  </label>
                  {editMode && newEvent.image1 && (
                    <div className="mb-3">
                      <img
                        src={`${imageUrl}/${newEvent.image1}`}
                        alt="Event photo"
                        style={{ maxWidth: '100%', maxHeight: '100px', borderRadius: '5px' }}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    id="image1"
                    name="image1"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleInputChange}
                  />
                </CCol>
                <CCol md="6">
                  <label htmlFor="image2" className="form-label">
                    image2
                  </label>
                  {editMode && newEvent.image2 && (
                    <div className="mb-3">
                      <img
                        src={`${imageUrl}/${newEvent.image2}`}
                        alt="Event Photo"
                        style={{ maxWidth: '100%', maxHeight: '100px', borderRadius: '5px' }}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    id="image2"
                    name="image2"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleInputChange}
                  />
                </CCol>
                <CCol md="6">
                  <label htmlFor="image3" className="form-label">
                    image3
                  </label>
                  {editMode && newEvent.image3 && (
                    <div className="mb-3">
                      <img
                        src={`${imageUrl}/${newEvent.image3}`}
                        alt="Event Photo"
                        style={{ maxWidth: '100%', maxHeight: '100px', borderRadius: '5px' }}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    id="image3"
                    name="image3"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleInputChange}
                  />
                </CCol>
                <CCol md="6">
                  <label htmlFor="image4" className="form-label">
                    image4
                  </label>
                  {editMode && newEvent.image4 && (
                    <div className="mb-3">
                      <img
                        src={`${imageUrl}/${newEvent.image4}`}
                        alt="Event Photo"
                        style={{ maxWidth: '100%', maxHeight: '100px', borderRadius: '5px' }}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    id="image4"
                    name="image4"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleInputChange}
                  />
                </CCol>
                {/* <CCol md="6">
                  <label htmlFor="addedBy" className="form-label">
                    Select User <span className="text-danger">*</span>
                  </label>
                  <CFormSelect
                    id="addedBy"
                    name="addedBy"
                    value={newEvent.addedBy || '0'}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a User</option>
                    {userOptions.map((user) => (
                      <option key={user.userId} value={user.userId}>
                        {user.firstName} {user.lastName} - {user.contactNumber}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol> */}
                {/* <CCol md="6">
                  <label htmlFor="addedBy" className="form-label">
                    Added By <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="addedBy"
                    name="addedBy"
                    value={uId || ''} // Provide an empty string as default to avoid null warning
                    onChange={handleInputChange}
                    readOnly
                  />
                </CCol> */}
                <CCol xs={12}>
                  <CFormTextarea
                    id="description"
                    name="description"
                    label={
                      <span>
                        Event Description <span className="text-danger">*</span>
                      </span>
                    }
                    value={newEvent.description}
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
                      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      {/* <CTableHeaderCell scope="col">Time</CTableHeaderCell> */}
                      <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                      <CTableHeaderCell scope="col">AddedBy</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {events &&
                      events?.map((event, index) => (
                        <React.Fragment key={event.eventId}>
                          <CTableRow>
                            <CTableDataCell>{index + 1}</CTableDataCell>
                            <CTableDataCell>
                              <span
                                style={{ cursor: 'pointer', color: 'blue' }}
                                onClick={() => handleMoreDetails(event.eventId)}
                              >
                                {event.name}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell>{event.type}</CTableDataCell>
                            <CTableDataCell>{formatDateForDisplay(event.date)}</CTableDataCell>
                            <CTableDataCell>
                              {event.description.length > 33
                                ? `${event.description.slice(0, 33)}...`
                                : event.description}
                            </CTableDataCell>
                            <CTableDataCell>{event.addedByName}</CTableDataCell>

                            <CTableDataCell>
                              <div className="d-flex align-items-center">
                                <CButton
                                  color="primary"
                                  size="sm"
                                  className="me-1"
                                  onClick={() => handleEdit(event.eventId)}
                                >
                                  <CIcon icon={cilPencil} />
                                </CButton>
                                <CButton
                                  color="danger"
                                  size="sm"
                                  onClick={() => handleDelete(event.eventId)}
                                >
                                  <CIcon icon={cilTrash} />
                                </CButton>
                                <CButton
                                  // color="danger"
                                  size="sm"
                                  className="ms-2"
                                  onClick={() => handleToggleStatus(event.eventId)}
                                  disabled={togglingStatus === event.eventId}
                                >
                                  <IoToggle
                                    size={24} // Set the size of the icon
                                    style={{
                                      color: event.status == '1' ? 'green' : 'grey',
                                      transform:
                                        event.status == '1' ? 'rotate(0deg)' : 'rotate(180deg)',
                                      // transition: 'transform 0.1s',
                                    }}
                                  />
                                </CButton>
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell colSpan="9">
                              <CCollapse visible={selectedEventId === event.eventId}>
                                <CCard>
                                  <CCardBody>
                                    <CRow>
                                      <CCol md="12">
                                        <strong>Name:</strong> {event.name}
                                      </CCol>
                                    </CRow>
                                    <CRow className="mt-2">
                                      <CCol md="6">
                                        <strong>Type:</strong> {event.type}
                                      </CCol>
                                      <CCol md="6">
                                        <strong>Date:</strong> {formatDateForDisplay(event.date)}
                                      </CCol>
                                    </CRow>
                                    <CRow className="mt-2">
                                      <CCol md="12">
                                        <strong>Description:</strong> {event.description}
                                      </CCol>
                                    </CRow>
                                    <CRow className="mt-2">
                                    <CCol md="12">
                                        <strong>Link For register:</strong>
                                        {event.link ? (
                                          <a href={event.link} target="_blank" rel="noopener noreferrer">
                                            click here
                                          </a>
                                        ) : (
                                          <span> Link is not provided</span>
                                        )}
                                      </CCol>


                                    </CRow>

                                    <CRow className="mt-2">
                                      <CCol md="12">
                                        <strong>Photos :</strong>{' '}
                                        <div
                                          style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '10px',
                                            marginTop: '10px',
                                          }}
                                        >
                                          {/* Main photo */}
                                          {event.photo && (
                                            <img
                                              src={`${imageUrl}/${event.photo}`}
                                              alt="event Photo"
                                              style={{
                                                maxWidth: '100px',
                                                maxHeight: '100px',
                                              }}
                                            />
                                          )}
                                          {/* Image 1 */}
                                          {event.image1 && (
                                            <img
                                              src={`${imageUrl}/${event.image1}`}
                                              alt="event Image 1"
                                              style={{
                                                maxWidth: '100px',
                                                maxHeight: '100px',
                                              }}
                                            />
                                          )}
                                          {/* Image 2 */}
                                          {event.image2 && (
                                            <img
                                              src={`${imageUrl}/${event.image2}`}
                                              alt="event Image 2"
                                              style={{
                                                maxWidth: '100px',
                                                maxHeight: '100px',
                                              }}
                                            />
                                          )}
                                          {/* Image 3 */}
                                          {event.image3 && (
                                            <img
                                              src={`${imageUrl}/${event.image3}`}
                                              alt="event Image 3"
                                              style={{
                                                maxWidth: '100px',
                                                maxHeight: '100px',
                                              }}
                                            />
                                          )}
                                          {/* Image 4 */}
                                          {event.image4 && (
                                            <img
                                              src={`${imageUrl}/${event.image4}`}
                                              alt="event Image 4"
                                              style={{
                                                maxWidth: '100px',
                                                maxHeight: '100px',
                                              }}
                                            />
                                          )}
                                        </div>
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

export default Events
