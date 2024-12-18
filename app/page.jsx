"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from "@clerk/nextjs";
import { 
  Library, 
  PlusCircle,
  Star,
  Clock
} from 'lucide-react';

// Dashboard Component
const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push('/sign-in');
      return;
    }

    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/books');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError("Received non-JSON response from server");
        }

        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error.message);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const BookCard = ({ book }) => (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="aspect-w-3 aspect-h-4 mb-4">
        <img
          src={book.images[0] || '/placeholder.png'}
          alt={book.title}
          className="object-cover rounded-md w-full h-full"
        />
      </div>
      <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
      <p className="text-sm text-gray-500 mb-4">{book.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {new Date(book.createdAt).toLocaleDateString()}
        </span>
        <button
          onClick={() => router.push(`/books/${book.id}`)}
          className="text-blue-600 hover:text-blue-800"
        >
          View Book →
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Welcome, {user.firstName || 'User'}
          </h2>
          <button
            onClick={() => router.push('/CreateBook')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Create New Book
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Recent Books Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {loading ? (
              <div>Loading books...</div>
            ) : error ? (
              <div className="text-gray-900 font-medium">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-105">
            <div className="flex items-center mb-4">
              <Star className="mr-3 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-800">Quick Stats</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Total Books", value: 12, color: "text-blue-600" },
                { label: "Total Pages", value: 45, color: "text-green-600" }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <div className={`text-4xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Book Creation */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-105">
            <div className="flex items-center mb-4">
              <PlusCircle className="mr-3 text-purple-500" />
              <h3 className="text-xl font-semibold text-gray-800">Create AI Book</h3>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-lg">
              <p className="text-sm mb-3">Generate a unique book using AI</p>
              <button className="w-full bg-white text-purple-600 font-bold py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Start AI Book
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const BookCreationApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <>
        {activeTab === 'dashboard' && <Dashboard />}
        
        {/* Placeholder for other tabs */}
        {activeTab === 'new-book' && (
          <div className="p-10 w-full">
            <h2 className="text-4xl font-bold text-gray-800">Create New Book</h2>
          </div>
        )}
        {activeTab === 'upload' && (
          <div className="p-10 w-full">
            <h2 className="text-4xl font-bold text-gray-800">Upload Images</h2>
          </div>
        )}
      </>
    </div>
  );
};

export default BookCreationApp;