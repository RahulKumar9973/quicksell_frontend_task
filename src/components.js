import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import { LuMoreHorizontal, LuSettings2 } from 'react-icons/lu';
import { GrAdd } from 'react-icons/gr';
import { BiChevronDown } from 'react-icons/bi';
import { getStatusIcon, getPriorityIcon } from './utils/helper';
import './components.css';

// Card component to display individual tickets
function Card({ ticket, userData, hideStatusIcon, hideProfileIcon }) {
  return (
    <div className='card'>
      <div className='top-container'>
        <div className='ticket-id'>{ticket.id}</div>
        {!hideProfileIcon && <UserIcon name={userData.name} available={userData.available} />}
      </div>
      <div className='middle-container'>
        {!hideStatusIcon && getStatusIcon(ticket.status)}
        <div className='title'>{ticket.title}</div>
      </div>
      <div className='bottom-container'>
        <div className='more-icon-container'>
          <LuMoreHorizontal color="#797d84" />
        </div>
        {ticket.tag.map((tag) => (
          <div key={tag} className='tag-container'>
            <div className='tag-icon'></div>
            <div className='tag-text'>{tag}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Column component to group tickets based on a certain criteria
function Column({ tickets, grouping, groupBy, userIdToData }) {
  const title = useMemo(() => {
    if (grouping === "status" || grouping === "priority") return groupBy;
    if (grouping === "user") return userIdToData[groupBy]?.name;
  }, [grouping, groupBy, userIdToData]);

  const icon = useMemo(() => {
    if (grouping === "status") return getStatusIcon(groupBy);
    if (grouping === "priority") return getPriorityIcon(groupBy);
    if (grouping === "user") {
      const user = userIdToData[groupBy];
      return <UserIcon name={user.name} available={user.available} />;
    }
  }, [grouping, groupBy, userIdToData]);

  return (
    <div className='column'>
      <div className='column-header'>
        <div className='column-header-left-container'>
          {icon}
          <div className='column-title'>
            {title}
            <span className='count'>{tickets.length}</span>
          </div>
        </div>
        <div className='column-header-right-container'>
          <GrAdd color="#797d84" size={12} />
          <LuMoreHorizontal color="#797d84" size={14} />
        </div>
      </div>
      <div className='cards-container'>
        {tickets.map((ticket) => (
          <Card
            key={ticket.id}
            ticket={ticket}
            userData={userIdToData[ticket.userId]}
            hideStatusIcon={grouping === "status"}
            hideProfileIcon={grouping === "user"}
          />
        ))}
      </div>
    </div>
  );
}

// Dropdown component for grouping and ordering options
function DisplayDropdown({ grouping, setGrouping, ordering, setOrdering }) {
  const [visible, setVisible] = useState(false);
  const dropdownRef = useRef(null);

  const openDropdown = useCallback(() => {
    setVisible(true);
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setVisible(false);
    }
  }, []);

  const onGroupingChange = useCallback((e) => setGrouping(e.target.value), [setGrouping]);
  const onOrderingChange = useCallback((e) => setOrdering(e.target.value), [setOrdering]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className='display-dropdown' ref={dropdownRef}>
      <div className='dropdown-label-container' onClick={openDropdown}>
        <LuSettings2 color='#6b6f76' />
        <div className='dropdown-label'>Display</div>
        <BiChevronDown color='#6b6f76' />
      </div>
      <div className={`dropdown-content-container ${visible ? "visible" : ""}`}>
        <div className='dropdown-content-row'>
          <div className='dropdown-content-label'>Grouping</div>
          <select name="grouping" id="grouping" value={grouping} onChange={onGroupingChange}>
            <option value="status">Status</option>
            <option value="user">User</option>
            <option value="priority">Priority</option>
          </select>
        </div>
        <div className='dropdown-content-row'>
          <div className='dropdown-content-label'>Ordering</div>
          <select name="ordering" id="ordering" value={ordering} onChange={onOrderingChange}>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Grid component to display all columns
function Grid({ gridData, grouping, userIdToData }) {
  const keys = useMemo(() => Object.keys(gridData), [gridData]);

  return (
    <div className='grid'>
      {keys.map((key) => (
        <Column
          key={key}
          tickets={gridData[key]}
          grouping={grouping}
          groupBy={key}
          userIdToData={userIdToData}
        />
      ))}
    </div>
  );
}

// Header component to include the dropdown
function Header({ grouping, setGrouping, ordering, setOrdering }) {
  return (
    <header>
      <DisplayDropdown
        grouping={grouping}
        setGrouping={setGrouping}
        ordering={ordering}
        setOrdering={setOrdering}
      />
    </header>
  );
}

// Loader component to show loading state
function Loader({ fullscreen = true }) {
  return (
    <div className={`loader-container ${fullscreen ? "fullscreen" : ""}`}>
      <span className='loader'>Loading...</span>
    </div>
  );
}

// UserIcon component to display user's initials and status
function UserIcon({ name, available }) {
  const initials = useMemo(() => {
    return name.split(" ").map((item) => item[0]).join("");
  }, [name]);

  return (
    <div className='usericon-container'>
      <div className='usericon-text'>{initials}</div>
      <div className={`user-status ${available ? "available" : ""}`}></div>
    </div>
  );
}

export { Card, Column, DisplayDropdown, Grid, Header, Loader, UserIcon };
