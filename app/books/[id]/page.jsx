'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import HTMLFlipBook from 'react-pageflip';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const BookViewer = () => {
  const router = useRouter();
  const params = useParams();
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const bookRef = useRef(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${params.id}`);
        if (!response.ok) throw new Error('Book not found');
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error('Error fetching book:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBook();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!book) return null;

  const handlePageFlip = (e) => {
    setCurrentPage(e.data);
  };

  return (
    <div className="p-4 md:p-8 bg-slate-800 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white">{book.title}</h2>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Library
          </button>
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-full max-w-[800px] h-[500px]">
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
              {book.images.map((image, index) => (
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

        <div className="flex justify-center gap-4">
          <button
            onClick={() => bookRef.current.pageFlip().flipPrev()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            disabled={currentPage === 0}
          >
            <ArrowLeft className="inline mr-2" /> Previous
          </button>
          <button
            onClick={() => bookRef.current.pageFlip().flipNext()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            disabled={currentPage === book.images.length - 1}
          >
            Next <ArrowRight className="inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookViewer;