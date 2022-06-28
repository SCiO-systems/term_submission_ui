import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppBreadcrumb from './AppBreadcrumb';
import MiniLogo from './assets/img/SCiO_v1_white_rgb.png';
import { ToastContext, UserContext } from './store';

const AppTopbar = ({ onMenuButtonClick, routers, displayName, signOut }) => {
  const { t } = useTranslation();
  const [notificationMenuVisible, setNotificationMenuVisible] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [loadingInvitation, setLoadingInvitation] = useState(0);
  const { setError } = useContext(ToastContext);
  const { avatar_url: avatarUrl } = useContext(UserContext);

  useEffect(() => {
    /* fetchInvites();
    const interval = setInterval(() => {
      fetchInvites();
    }, process.env.REACT_APP_INVITATION_POLLING_FREQUENCY * 1000);
    return () => {
      clearInterval(interval);
    }; */
  }, []);

  return (
    <div className="layout-topbar">
      <div className="topbar-left">
        <button type="button" className="menu-button p-link" onClick={onMenuButtonClick}>
          <i className="pi pi-chevron-left" />
        </button>
        <span className="topbar-separator" />

        <div className="layout-breadcrumb viewname" style={{ textTransform: 'uppercase' }}>
          <AppBreadcrumb routers={routers} />
        </div>

        <img id="logo-mobile" className="mobile-logo" src={MiniLogo} alt="Agrofims Logo" />
      </div>
    </div>
  );
};

export default AppTopbar;
