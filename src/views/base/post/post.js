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

const Posts = () => {
  const [posts, setPosts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedPostsId, setselectedPostsId] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit, setLimit] = useState(10)
  const [file, setFile] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortFieldAsc, setSortFieldAsc] = useState('')
  const [sortFieldDesc, setSortFieldDesc] = useState('')
  const [isReloading, setIsReloading] = useState(false); // Tracks whether data is being reloaded
  const [togglingStatus, setTogglingStatus] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [uId, setUId] = useState('')
  const [newPosts, setNewPosts] = useState({
    postId: '',
    title: '',
    description: '',
    photo: '',
    addedBy: '',
    status: 1,
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

  const handleMoreDetails = (id) => {
    setselectedPostsId(selectedPostsId === id ? null : id)
  }

  const fetchData = async (page = 1, limit = 10, term = '', sortField = '', sortOrder = '') => {
    try {
      // const response = await axiosInstance.get(`${backendUrl}/apis/posts`, {
      const response = await axiosInstance.get(`/apis/posts`, {
        params: {
          search: term,
          page: page,
          limit: limit,
          sortField, // Sorting field
          sortOrder, // Sorting order
        },
      })
      if (response.data && response.data.posts) {
        setPosts(response.data.posts)
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
  const handleToggleStatus = async (postId) => {
    setTogglingStatus(postId) // Indicate which user status is being toggled

    const currentPost = posts.find((post) => post.postId === postId);
    const currentStatus = currentPost?.status; // Get the current status ('1' for active, '0' for inactive)
  
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
      console.log(`Toggling status for postId: ${postId}`)
      await axiosInstance.put(`/apis/togglepoststatus/${postId}`)

      await fetchData(currentPage, limit)
    } catch (error) {
      console.error(
        'Error toggling posts status:',
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
      const response = await axiosInstance.post(`/apis/addadsfromcsv`, formData, {
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
    console.log(`Edit ad with ID: ${id}`)
    setEditMode(true) // Set edit mode to true
    try {
      const response = await axiosInstance.get(`/apis/postdetails/${id}`)
      const postData = response.data.post
      // console.log('DATA: ', postsData)

      setNewPosts({
        postId: postData.postId, // Include
        title: postData.title,
        description: postData.description,
        photo: postData.photo,
        addedBy: postData.addedBy,
        status: postData.status,
      })
      setShowForm(true) // Open the form for editing
    } catch (error) {
      console.error('Error fetching posts details:', error)
      alert('Error fetching posts details. Please try again later.')
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
      const response = await axiosInstance.put(`/apis/deletepost/${id}`)
      if (response.status === 200) {
        setPosts(posts.filter((posts) => posts.postId !== id))
      } else {
        console.error('Failed to delete post:', response)
        alert('Failed to delete post Please try again.')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post Please try again.')
    }
  }

  const handleAddPost = () => {
    setShowForm(!showForm)
    setNewPosts({
      postId: '',
      title: '',
      description: '',
      photo: '',
      addedBy: '',
      status: 1,
    })
    setEditMode(false)
  }

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target

    setNewPosts((prevpost) => {
      const updatedPost = { ...prevpost }

      // Handle file inputs
      if (type === 'file') {
        // Only update the photo if a new file is selected
        if (files && files.length > 0) {
          updatedPost[name] = files[0]
        } else {
          // If no new file selected, retain the previous photo
          updatedPost[name] = prevpost.photo // Retain previous photo
        }
      } else {
        // Handle other input types (e.g., text, date)
        updatedPost[name] = value
      }

      return updatedPost
    })
  }

  const handleExport = async () => {
    try {
      // Making the API call
      const response = await axiosInstance.get(`/apis/posts/all`, {});
      // const response = await axiosInstance.get(`${backendUrl}/apis/posts/all`, {});
    
      if (response.data.status === 'true') {
    
        const posts = response.data.posts;
        console.log(posts);
    
        // Map the 'status' field to "Active" or "Inactive" and remove unnecessary fields
        const formattedPosts = posts.map((posts , index) => {
          const { id ,name_hi , name_gu ,photo, createdDate , updatedDate,  ...rest } = posts; // Destructure and remove unwanted fields
          return {
            "Sr No": index + 1, // Add sequential numbering
            ...rest,
            createdDate: createdDate ? createdDate.split('T')[0] : '', // Extract only the date
            updatedDate: updatedDate ? updatedDate.split('T')[0] : '', // Extract only the date
            status: posts.status === 1 ? 'Active' : 'Inactive',
          };
        });
    
        // Create CSV file from the response data
        const csvData = Papa.unparse(formattedPosts, {
          header: true,
          quotes: true,  // Ensure text fields are quoted in the CSV
        });
    
        // Trigger file download
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) { // Feature detection
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', 'Posts.csv');  // CSV file name
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
    
        console.log("CSV Downloaded");
    
      } else {
        alert('No Posts found');
        console.error('No Posts found');
      }
    } catch (error) {
      alert('Error fetching Posts');
      console.error('Error fetching Posts:', error);
    }
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submit handler called')

    // Prepare form data
    const formData = new FormData()
    console.log('newPosts before FormData append:', newPosts)

    Object.keys(newPosts).forEach((key) => {
      if (newPosts[key]) {
        formData.append(key, newPosts[key])
      } else {
        console.warn(`${key} is empty or undefined`)
      }
    })

    // Append `addedBy` only if it's not already set in `newEvent`
    if (!newPosts.addedBy) {
      formData.append('addedBy', uId || '')
    }

    // Debugging: Print FormData entries
    for (let [key, value] of formData.entries()) {
      console.log(`Okay ${key}:`, value)
      console.log(newPosts.postId)
    }
    // formData.forEach((value, key) => console.log(key, value))
    try {
      let response

      if (editMode) {
        console.log('Updating post...')
        // Update Ad
        response = await axiosInstance.put(`/apis/editpost/${newPosts.postId}`, formData, {
        // response = await axiosInstance.put(`${backendUrl}/apis/editpost/${newPosts.postId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        })
      } else {
        // console.log(formData)
        console.log('Adding new post...')
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`)
        }
        // Add new Ad
        response = await axiosInstance.post(`/apis/addpost`, formData, {
          // response = await axiosInstance.post(`${backendUrl}/apis/addpost`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        })
      }

      console.log(editMode ? 'Edit Response:' : 'Add Response:', response)

      if (response.status === 200 || response.status === 201) {
        alert(editMode ? 'post updated successfully' : 'post added successfully')

        // Construct the Ad object from the response
        const updatedPost = {
          postId: response.data.postId, // Assuming this is returned from the API
          ...newPosts,
          photo: newPosts.photo ? newPosts.photo : '', // Ensure photo exists
        }

        console.log('Updated post:', updatedPost) // Log updateAds to ensure it’s constructed correctly

        setPosts((prevPost) =>
          editMode
            ? prevPost.map((posts) => (posts.postId === updatedPost.postId ? updatedPost : posts))
            : [...prevPost, updatedPost],
        )
      } else {
        alert(editMode ? 'Error updating post' : 'Error adding post')
      }

      // Reset form after successful submission
      setNewPosts({
        postId: '',
        title: '',
        description: '',
        photo: '',
        addedBy: '',
        status: 1,
      })
      // setFormErrors({})
      setShowForm(false)
      setEditMode(false) // Reset edit mode
      fetchData() // Refetch data to reflect changes
    } catch (error) {
      console.error('Error submitting post:', error)
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
            <strong>{showForm ? (editMode ? 'Edit post' : 'Add post') : 'posts List'}</strong>
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
                      <option value="title">Title</option>
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
                      <option value="description">Description</option>
                    </select>
                  </div>
                </>
              )}
{!showForm && (
  <>
    <CButton
      color="primary"
      onClick={handleAddPost}
      style={{ marginRight: '11px', marginBottom: '10px' }}
    >
      Add Post
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
                    id="title"
                    name="title"
                    label={
                      <span>
                        Post Title <span className="text-danger">*</span>
                      </span>
                    }
                    value={newPosts.title}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
                {/* <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="addedBy"
                    name="addedBy"
                    label="Added By"
                    value={newPosts.addedBy}
                    onChange={handleInputChange}
                    required
                  />
                </CCol> */}
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
                <CCol md="6">
                  <label htmlFor="photo" className="form-label">
                    Photo 
                  </label>
                  {editMode && newPosts.photo && (
                    <div className="mb-3">
                      <img
                        src={`${imageUrl}/${newPosts.photo}`}
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
                <CCol xs={12}>
                  <CFormTextarea
                    id="description"
                    name="description"
                    label={
                      <span>
                        Description <span className="text-danger">*</span>
                      </span>
                    }
                    value={newPosts.description}
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
                      <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                      <CTableHeaderCell scope="col">description</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Added By</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {posts.map((posts, index) => (
                      <React.Fragment key={posts.postId}>
                        <CTableRow>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          {/* <CTableDataCell>
                            {posts.photo ? (
                              <img
                                src={
                                  `http://157.173.221.111:8080/communityapp.com/backend/${posts.photo}` ||
                                  ''
                                }
                                alt={posts.photo}
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
                          </CTableDataCell> */}
                          <CTableDataCell>
                            <span
                              style={{ cursor: 'pointer', color: 'blue' }}
                              onClick={() => handleMoreDetails(posts.postId)}
                            >
                              {posts.title}
                            </span>
                          </CTableDataCell>
                          {/* <CTableDataCell>{posts.description}</CTableDataCell> */}
                          <CTableDataCell>
                            {posts.description.length > 33
                              ? `${posts.description.slice(0, 33)}...`
                              : posts.description}
                          </CTableDataCell>
                          <CTableDataCell>{posts.addedByName}</CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex align-items-center">
                              <CButton
                                color="primary"
                                size="sm"
                                className="me-1"
                                onClick={() => handleEdit(posts.postId)}
                              >
                                <CIcon icon={cilPencil} />
                              </CButton>
                              <CButton
                                color="danger"
                                size="sm"
                                onClick={() => handleDelete(posts.postId)}
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                              <CButton
                                // color="secondary"
                                size="sm"
                                className="ms-2"
                                // onClick={() => handleToggleStatus(posts.postId)}
                                onClick={() => {
                                  console.log(posts.postId) // Log post.postId
                                  console.log('status', posts.status)
                                  handleToggleStatus(posts.postId)
                                }}
                                disabled={togglingStatus === posts.postId}
                              >
                                <IoToggle
                                  size={24} // Set the size of the icon
                                  style={{
                                    color: posts.status == '1' ? 'green' : 'grey',
                                    transform:
                                      posts.status == '1' ? 'rotate(0deg)' : 'rotate(180deg)',
                                    // transition: 'transform 0.1s',
                                  }}
                                />
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableDataCell colSpan="9">
                            <CCollapse visible={selectedPostsId === posts.postId}>
                              <CCard>
                                <CCardBody>
                                  <CRow className="mt-2">
                                    <CCol md="6">
                                      <strong>Title:</strong> {posts.title}
                                    </CCol>
                                  </CRow>
                                  <CRow className="mt-2">
                                    <CCol md="12">
                                      <strong>Description:</strong> {posts.description}
                                    </CCol>
                                  </CRow>
                                  <CRow className="mt-2">
                                    <CCol md="12">
                                      <strong>Photo :</strong>{' '}
                                      {posts.photo && (
                                        <>
                                          <div>
                                            <img
                                              src={`${imageUrl}/${posts.photo}`}
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

export default Posts
