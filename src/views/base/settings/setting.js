import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CButton,
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import './AdminSettings.css';
import { getBackendURL } from '../../../util';
const Switch = ({ id, checked, onChange }) => (
  <div className="custom-switch">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="custom-switch-input"
    />
    <label className="custom-switch-label" htmlFor={id}>
      <span className="custom-switch-inner"></span>
      <span className="custom-switch-switch"></span>
    </label>
  </div>
);

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    familyhead: [
      { module_name: "business", status: 0 },
      { module_name: "announcement", status: 0 },
      { module_name: "magazine", status: 0 },
      { module_name: "post", status: 0 },
      { module_name: "event", status: 0 },
    ],
    user: [
      { module_name: "business", status: 0 },
      { module_name: "announcement", status: 0 },
      { module_name: "magazine", status: 0 },
      { module_name: "post", status: 0 },
      { module_name: "event", status: 0 },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = getBackendURL()
  const fetchSettings = async () => {
    try {
      // const response = await fetch(`${backendUrl}/apis/getallsettings`);
      const response = await fetch(`/apis/getallsettings`);
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      if (data.status === "true" && data.data && data.data.length > 0) {
        const newSettings = {};
        data.data.forEach(item => {
          newSettings[item.usertype] = item.modules;
        });
        setSettings(newSettings);
      } else {
        // If no data or empty response, set all toggles to off
        setSettings({
          familyhead: [
            { module_name: "business", status: 0 },
            { module_name: "announcement", status: 0 },
            { module_name: "magazine", status: 0 },
            { module_name: "post", status: 0 },
            { module_name: "event", status: 0 },
          ],
          user: [
            { module_name: "business", status: 0 },
            { module_name: "announcement", status: 0 },
            { module_name: "magazine", status: 0 },
            { module_name: "post", status: 0 },
            { module_name: "event", status: 0 },
          ],
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError(error.message);
      // Set all toggles to off in case of error
      setSettings({
        familyhead: [
          { module_name: "business", status: 0 },
          { module_name: "announcement", status: 0 },
          { module_name: "magazine", status: 0 },
          { module_name: "post", status: 0 },
          { module_name: "event", status: 0 },
        ],
        user: [
          { module_name: "business", status: 0 },
          { module_name: "announcement", status: 0 },
          { module_name: "magazine", status: 0 },
          { module_name: "post", status: 0 },
          { module_name: "event", status: 0 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleCheckboxChange = (userType, moduleName) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [userType]: prevSettings[userType].map(module =>
        module.module_name === moduleName
          ? { ...module, status: module.status === 0 ? 1 : 0 }
          : module
      ),
    }));
  };

  const handleSubmit = async (userType) => {
    const data = {
      usertype: userType === 'family head' ? 'family head' : 'user',
      modules: settings[userType],
    };

    try {
      // const response = await fetch(`${backendUrl}/apis/addsettings`, {
        const response = await fetch(`/apis/addsettings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        
      });

      if (response.ok) {
        alert(`Settings for ${userType} updated successfully!`);
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings. Please try again.');
    }
  };

  const renderSettingsCard = (userType, title) => (
    <CCard className="settings-card mb-4">
      <CCardHeader className="settings-card-header">
        <h2>{title} Settings</h2>
      </CCardHeader>
      <CCardBody className="settings-card-body">
        <div className="settings-list">
          {(settings[userType] && settings[userType].length > 0) ? (
            settings[userType].map((module) => (
              <div key={module.module_name} className="settings-item">
                <Switch
                  id={`${userType}-${module.module_name}`}
                  checked={module.status === 1}
                  onChange={() => handleCheckboxChange(userType, module.module_name)}
                />
                <label htmlFor={`${userType}-${module.module_name}`} className="settings-label">
                  {module.module_name.charAt(0).toUpperCase() + module.module_name.slice(1)}
                </label>
              </div>
            ))
          ) : (
            <div>No settings available</div>
          )}
        </div>
        <CButton
          className="settings-save-button"
          onClick={() => handleSubmit(userType)}
          disabled={!settings[userType] || settings[userType].length === 0}
        >
          Save {title} Settings
        </CButton>
      </CCardBody>
    </CCard>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="admin-settings-page">
      <CContainer>
        <h1 className="settings-title">Admin Settings</h1>
        <CRow>
          <CCol>
            {renderSettingsCard('family head', 'Family Head')}
            {renderSettingsCard('user', 'User')}
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}