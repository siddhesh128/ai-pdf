"use client";

import { createContext, useContext, useState } from 'react';

const BookContext = createContext();

export function BookProvider({ children }) {
  const [bookData, setBookData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <BookContext.Provider value={{ bookData, setBookData, isLoading, setIsLoading }}>
      {children}
    </BookContext.Provider>
  );
}

export const useBookData = () => useContext(BookContext);