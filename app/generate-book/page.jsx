/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBookData } from '@/context/BookContext';
import './styles.css';

const GenerateBook = () => {
  const router = useRouter();
  const { bookData, isLoading } = useBookData();
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef(null);

  useEffect(() => {
    if (!bookData) {
      router.push('/CreateBook');
    }
  }, [bookData, router]);

  if (!bookData) return null;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  const handlePageFlip = (e) => {
    if (e && e.data !== undefined) {
      setCurrentPage(e.data);
    }
  };

  const handlePrevPage = () => {
    if (bookRef.current && currentPage > 0) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const handleNextPage = () => {
    if (bookRef.current && currentPage < bookData.images.length - 1) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const handleFinish = async () => {
    try {
      // Save book to database
      const response = await fetch('/api/books/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: bookData.title,
          description: bookData.description,
          category: bookData.category,
          images: bookData.images,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save book');
      }

      router.push('/');
    } catch (error) {
      console.error('Error saving book:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-800 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white">{bookData.title}</h2>
        
        <div className="flex justify-center mb-4 md:mb-8">
          <div className="w-full max-w-[800px] h-[300px] md:h-[500px]">
            <HTMLFlipBook
              width={300}
              height={400}
              size="stretch"
              minWidth={200}
              maxWidth={1000}
              minHeight={250}
              maxHeight={1533}
              drawShadow={true}
              flippingTime={1000}
              className="demo-book"
              startPage={0}
              onFlip={handlePageFlip}
              ref={bookRef}
            >
              {/* Render all images as pages */}
              {bookData.images.map((image, index) => (
                <div key={index} className="bg-white p-4 rounded shadow">
                  <img
                    src={image}
                    alt={`page-${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </HTMLFlipBook>
          </div>
        </div>

        {/* Page Navigation Controls */}
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 mb-4 md:mb-8 px-2">
          <button
            onClick={handlePrevPage}
            className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center text-sm md:text-base"
            disabled={currentPage === 0}
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" /> Previous
          </button>
          <span className="text-white text-sm md:text-base">
            {currentPage + 1} / {bookData.images.length}
          </span>
          <button
            onClick={handleNextPage}
            className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center text-sm md:text-base"
            disabled={currentPage === bookData.images.length - 1}
          >
            Next <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => router.push('/sequence-adjustment')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center"
          >
            <ArrowLeft className="mr-2" /> Back to Sequence
          </button>
          <button
            onClick={handleFinish}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center"
          >
            Finish <ArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateBook;
