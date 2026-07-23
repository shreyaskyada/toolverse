'use client';

import { useState, useMemo } from 'react';
import { calculateAge } from './engine';

export function useAgeCalculator() {
  // Format Date safely as local YYYY-MM-DD
  const today = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
  }, []);

  const [birthDateInput, setBirthDateInput] = useState('1995-01-01');
  const [targetDateInput, setTargetDateInput] = useState(today);

  const birthDate = useMemo(() => {
    return new Date(birthDateInput);
  }, [birthDateInput]);

  const targetDate = useMemo(() => {
    return new Date(targetDateInput);
  }, [targetDateInput]);

  const result = useMemo(() => {
    if (isNaN(birthDate.getTime()) || isNaN(targetDate.getTime())) {
      return null;
    }
    return calculateAge(birthDate, targetDate);
  }, [birthDate, targetDate]);

  return {
    state: {
      birthDateInput,
      targetDateInput,
      result,
    },
    setBirthDateInput,
    setTargetDateInput,
  };
}
export default useAgeCalculator;
