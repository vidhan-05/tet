// import React from 'react'
// import {
//   CAvatar,
//   CBadge,
//   CDropdown,
//   CDropdownDivider,
//   CDropdownHeader,
//   CDropdownItem,
//   CDropdownMenu,
//   CDropdownToggle,
// } from '@coreui/react'
// import {
//   cilBell,
//   cilCreditCard,
//   cilCommentSquare,
//   cilEnvelopeOpen,
//   cilFile,
//   cilLockLocked,
//   cilSettings,
//   cilTask,
//   cilUser,
// } from '@coreui/icons'
// import CIcon from '@coreui/icons-react'

// import avatar8 from './../../assets/images/avatars/8.jpg'

// const AppHeaderDropdown = () => {
//   return (
//     <CDropdown variant="nav-item">
//       <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
//         <CAvatar src={avatar8} size="md" />
//       </CDropdownToggle>
//       <CDropdownMenu className="pt-0" placement="bottom-end">
//         <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
//         <CDropdownItem href="#">
//           <CIcon icon={cilBell} className="me-2" />
//           Updates
//           <CBadge color="info" className="ms-2">
//             42
//           </CBadge>
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilEnvelopeOpen} className="me-2" />
//           Messages
//           <CBadge color="success" className="ms-2">
//             42
//           </CBadge>
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilTask} className="me-2" />
//           Tasks
//           <CBadge color="danger" className="ms-2">
//             42
//           </CBadge>
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilCommentSquare} className="me-2" />
//           Comments
//           <CBadge color="warning" className="ms-2">
//             42
//           </CBadge>
//         </CDropdownItem>
//         <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
//         <CDropdownItem href="#">
//           <CIcon icon={cilUser} className="me-2" />
//           Profile
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilSettings} className="me-2" />
//           Settings
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilCreditCard} className="me-2" />
//           Payments
//           <CBadge color="secondary" className="ms-2">
//             42
//           </CBadge>
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilFile} className="me-2" />
//           Projects
//           <CBadge color="primary" className="ms-2">
//             42
//           </CBadge>
//         </CDropdownItem>
//         <CDropdownDivider />
//         <CDropdownItem href="#">
//           <CIcon icon={cilLockLocked} className="me-2" />
//           Lock Account
//         </CDropdownItem>
//       </CDropdownMenu>
//     </CDropdown>
//   )
// }

// import {
//   cilBell,
//   cilCommentSquare,
//   cilCreditCard,
//   cilEnvelopeOpen,
//   cilFile,
//   cilLockLocked,
//   cilSettings,
//   cilTask,
//   cilUser,
// } from '@coreui/icons'
// import CIcon from '@coreui/icons-react'
// import {
//   CAvatar,
//   CBadge,
//   CDropdown,
//   CDropdownDivider,
//   CDropdownHeader,
//   CDropdownItem,
//   CDropdownMenu,
//   CDropdownToggle,
// } from '@coreui/react'
// import React from 'react'
// import { useNavigate } from 'react-router-dom' // Import useNavigate hook

// import avatar8 from './../../assets/images/avatars/8.jpg'

// const AppHeaderDropdown = ({ setIsAuthenticated }) => {
//   // Accept setIsAuthenticated as a prop
//   const navigate = useNavigate()

//   // Handle logout by removing token and updating authentication state
//   const handleLogout = () => {
//     localStorage.removeItem('token') // Remove the token from localStorage
//     setIsAuthenticated(false) // Set isAuthenticated to false
//     navigate('/login') // Redirect to login page
//   }

//   return (
//     <CDropdown variant="nav-item">
//       <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
//         <CAvatar src={avatar8} size="md" />
//       </CDropdownToggle>
//       <CDropdownMenu className="pt-0" placement="bottom-end">
//         <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
//         <CDropdownItem href="#">
//           <CIcon icon={cilBell} className="me-2" />
//           Updates
//           <CBadge color="info" className="ms-2">
//             42
//           </CBadge>
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilEnvelopeOpen} className="me-2" />
//           Messages
//           <CBadge color="success" className="ms-2">
//             42
//           </CBadge>
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilTask} className="me-2" />
//           Tasks
//           <CBadge color="danger" className="ms-2">
//             42
//           </CBadge>
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilCommentSquare} className="me-2" />
//           Comments
//           <CBadge color="warning" className="ms-2">
//             42
//           </CBadge>
//         </CDropdownItem>
//         <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
//         <CDropdownItem href="#">
//           <CIcon icon={cilUser} className="me-2" />
//           Profile
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilSettings} className="me-2" />
//           Settings
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilCreditCard} className="me-2" />
//           Payments
//           <CBadge color="secondary" className="ms-2">
//             42
//           </CBadge>
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilFile} className="me-2" />
//           Projects
//           <CBadge color="primary" className="ms-2">
//             42
//           </CBadge>
//         </CDropdownItem>
//         <CDropdownDivider />
//         {/* Updated section for logging out */}
//         <CDropdownItem onClick={handleLogout}>
//           <CIcon icon={cilLockLocked} className="me-2" />
//           Logout
//         </CDropdownItem>
//       </CDropdownMenu>
//     </CDropdown>
//   )
// }

// // export default AppHeaderDropdown
// import {
//   cilBell,
//   cilCommentSquare,
//   cilCreditCard,
//   cilEnvelopeOpen,
//   cilFile,
//   cilLockLocked,
//   cilSettings,
//   cilTask,
//   cilUser,
// } from '@coreui/icons'
// import CIcon from '@coreui/icons-react'
// import {
//   CAvatar,
//   CBadge,
//   CDropdown,
//   CDropdownDivider,
//   CDropdownHeader,
//   CDropdownItem,
//   CDropdownMenu,
//   CDropdownToggle,
// } from '@coreui/react'
// import PropTypes from 'prop-types'; // Import PropTypes
// import React from 'react'
// import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
// import avatar8 from './../../assets/images/avatars/8.jpg'

// const AppHeaderDropdown = ({ setIsAuthenticated }) => {
//   const navigate = useNavigate()

//   // Handle logout with confirmation
//   const handleLogout = () => {
//     const confirmed = window.confirm('Are you sure you want to logout?')

//     if (confirmed) {
//       localStorage.removeItem('token') // Remove the token from localStorage
//       setIsAuthenticated(false) // Set isAuthenticated to false
//       navigate('/login') // Redirect to login page
//     }
//   }

//   return (
//     <CDropdown variant="nav-item" autoClose="outside">
//       <CDropdownToggle
//         placement="bottom-end"
//         className="py-0 pe-0"
//         caret={false}
//         title="User Account" // Accessibility enhancement
//       >
//         <CAvatar src={avatar8} size="md" />
//       </CDropdownToggle>
//       <CDropdownMenu className="pt-0" placement="bottom-end">
//         <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>

//         <CDropdownItem onClick={() => alert('View Updates')}>
//           <CIcon icon={cilBell} className="me-2" />
//           Updates
//           <CBadge color="info" className="ms-2">
//             42
//           </CBadge>
//         </CDropdownItem>

//         <CDropdownItem onClick={() => alert('View Messages')}>
//           <CIcon icon={cilEnvelopeOpen} className="me-2" />
//           Messages
//           <CBadge color="success" className="ms-2">
//             42
//           </CBadge>
//         </CDropdownItem>

//         <CDropdownItem onClick={() => alert('View Tasks')}>
//           <CIcon icon={cilTask} className="me-2" />
//           Tasks
//           <CBadge color="danger" className="ms-2">
//             42
//           </CBadge>
//         </CDropdownItem>

//         <CDropdownItem onClick={() => alert('View Comments')}>
//           <CIcon icon={cilCommentSquare} className="me-2" />
//           Comments
//           <CBadge color="warning" className="ms-2">
//             42
//           </CBadge>
//         </CDropdownItem>

//         <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>

//         <CDropdownItem onClick={() => alert('View Profile')}>
//           <CIcon icon={cilUser} className="me-2" />
//           Profile
//         </CDropdownItem>

//         <CDropdownItem onClick={() => alert('View Settings')}>
//           <CIcon icon={cilSettings} className="me-2" />
//           Settings
//         </CDropdownItem>

//         <CDropdownItem onClick={() => alert('View Payments')}>
//           <CIcon icon={cilCreditCard} className="me-2" />
//           Payments
//           <CBadge color="secondary" className="ms-2">
//             42
//           </CBadge>
//         </CDropdownItem>

//         <CDropdownItem onClick={() => alert('View Projects')}>
//           <CIcon icon={cilFile} className="me-2" />
//           Projects
//           <CBadge color="primary" className="ms-2">
//             42
//           </CBadge>
//         </CDropdownItem>

//         <CDropdownDivider />

//         {/* Updated section for logging out */}
//         <CDropdownItem onClick={handleLogout}>
//           <CIcon icon={cilLockLocked} className="me-2" />
//           Logout
//         </CDropdownItem>
//       </CDropdownMenu>
//     </CDropdown>
//   )
// }

// // Add PropTypes validation
// AppHeaderDropdown.propTypes = {
//   setIsAuthenticated: PropTypes.func.isRequired, // Ensure setIsAuthenticated is a required function
// }

import {
  cilLockLocked,
  cilSettings,
  cilUser,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import PropTypes from 'prop-types'; 
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar8 from './../../assets/images/avatars/8.jpg';

const imageUrl = import.meta.env.VITE_IMAGE_URL;
const AppHeaderDropdown = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // Close the dropdown programmatically
  const closeDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current._toggle(false); // CoreUI-specific method to close the dropdown
    }
  };

  // Logout handler
  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('type');
      localStorage.removeItem('userId');
      localStorage.removeItem('photo');
      localStorage.setItem('logout', 'true');
      closeDropdown(); // Close the dropdown after clicking Logout
      navigate('/login');
    }
  };

  // Navigation handler
  const handleNavigate = (path) => {
    closeDropdown(); // Close the dropdown after clicking
    navigate(path);
  };

  return (
    <CDropdown variant="nav-item" ref={dropdownRef}>
      <CDropdownToggle
        placement="bottom-end"
        className="py-0 pe-0"
        caret={false}
        title="User Account"
      >
<CAvatar
  src={`${imageUrl}/${localStorage.getItem("photo")}`}
  size="md"
  style={{
    width: '50px',        // Equal width and height for 1:1 aspect ratio
    height: '50px',       
    objectFit: 'cover',   // Ensures image covers the container without stretching
    borderRadius: '50%',  // Makes the avatar perfectly round (1:1 ratio)
    overflow: 'hidden',   // Ensures no image overflow outside the circle
  }}
/>





      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          Account
        </CDropdownHeader>
        <CDropdownItem onClick={() => navigate('/base/profile')}>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem onClick={() => navigate('/base/settings')}>
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

AppHeaderDropdown.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default AppHeaderDropdown;
