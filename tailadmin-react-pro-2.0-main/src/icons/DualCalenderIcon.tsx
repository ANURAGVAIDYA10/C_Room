import React from 'react';
import { Calendar as IconoirCal } from 'iconoir-react';
import { Calendar as PhosphorCalendar } from 'phosphor-react';


const DualCalendarIcon = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <IconoirCal width={16} height={16} />
      <PhosphorCalendar size={16} />
    </div>
  );
};

export default DualCalendarIcon;