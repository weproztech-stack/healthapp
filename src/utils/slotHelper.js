/**
 * Time slots generate karta hai start aur end time ke beech
 *
 * @param {string} start - "HH:MM" format e.g. "09:00"
 * @param {string} end   - "HH:MM" format e.g. "17:00"
 * @param {number} intervalMinutes - default 30 min
 * @returns {string[]} - ["09:00", "09:30", "10:00", ...]
 */
const generateSlots = (start, end, intervalMinutes = 30) => {
    const slots = [];
  
    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);
  
    let current = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;
  
    while (current + intervalMinutes <= endTotal) {
      const h = Math.floor(current / 60).toString().padStart(2, "0");
      const m = (current % 60).toString().padStart(2, "0");
      slots.push(`${h}:${m}`);
      current += intervalMinutes;
    }
  
    return slots;
  };
  
  module.exports = { generateSlots };

  
