import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';

import { UserContext } from './store';

const AppMenu = ({ onMenuClick }) => {
  const { t } = useTranslation();
  const { availableProjects, currentProject, setUser } = useContext(UserContext);

  const setCurrentProject = async (e) => {
    const selectedProject = availableProjects.filter((p) => p.id === e.value)[0];
    if (selectedProject) {
      setUser({ currentProject: selectedProject });
    }
  };

  return (
    <div className="layout-sidebar" role="button" tabIndex="0" onClick={onMenuClick}>
      <div className="logo">
        <NavLink to="/">
          <div className="p-d-flex p-ai-center">
            <h3 style={{ color: 'white', textAlign: 'left' }}>
              DataScribe
              <small className="p-d-block">Term Helper</small>
            </h3>
          </div>
        </NavLink>
      </div>

      <div className="layout-menu-container">
        <ul className="layout-menu" role="menu">
          {(availableProjects && availableProjects.length > 0) && (
            <>
              <li className="layout-root-menuitem" role="menuitem">
                <div className="layout-root-menuitem">
                  <div className="layout-menuitem-root-text">{t('ACTIVE_PROJECT')}</div>
                </div>
                <ul className="layout-menu" role="menu">
                  <li className="p-mb-1 p-fluid" role="menuitem">
                    <Dropdown
                      className="p p-mb-2"
                      options={availableProjects}
                      optionLabel="shortTitle"
                      optionValue="id"
                      value={currentProject?.id}
                      onChange={setCurrentProject}
                      placeholder="Select Project"
                    />
                  </li>
                </ul>
              </li>
              <li className="menu-separator" role="separator" />
            </>
          )}
          <li className="layout-root-menuitem" role="menuitem">
            <div className="layout-root-menuitem">
              <div className="layout-menuitem-root-text">TERM HELPER</div>
            </div>
            <ul className="layout-menu" role="menu">
              <li className="p-mb-1" role="menuitem">
                <NavLink to="/" activeClassName="p-button" exact>
                  <i className="layout-menuitem-icon fa-duotone fa-telescope" />
                  <span className="layout-menuitem-text">Search Term</span>
                </NavLink>
              </li>
              <li className="p-mb-1" role="menuitem">
                <NavLink to="/submit-term" activeClassName="p-button" exact>
                  <i className="layout-menuitem-icon fa-duotone fa-calendar-lines-pen" />
                  <span className="layout-menuitem-text">Submit Term</span>
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AppMenu;
