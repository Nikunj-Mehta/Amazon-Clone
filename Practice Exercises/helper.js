// 15e
export function isWeekend(date) 
{
  const day = date.format('dddd');

  day === 'Saturday' || day === 'Sunday'
    ? console.log('Saturday or Sunday') 
    : console.log('WeekDay');
}

export default isWeekend;