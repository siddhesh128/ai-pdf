/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { storage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useBookData } from '@/context/BookContext';

const CreateBook = () => {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [bookDetails, setBookDetails] = useState({
    title: '',
    description: '',
    category: 'children'
  });
  const { setBookData } = useBookData();

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setImages(prev => [...prev, ...files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    setBookData({
      title: bookDetails.title,
      description: bookDetails.description,
      category: bookDetails.category,
      files: images.map(img => img.file),
      previews: images.map(img => img.preview)
    });
    router.push('/sequence-adjustment');
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-6 md:mb-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[500px] md:max-w-3xl mx-auto">
            {['Upload Images', 'Book Details', 'Generate Book'].map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {i + 1}
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-900">{step}</span>
                </div>
                {i < 2 && <div className="h-1 w-24 mx-2 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column - Image Upload */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-black">Upload Images</h2>
            <div
              onClick={() => document.getElementById('fileInput').click()}
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-blue-500"
            >
              <input
                id="fileInput"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">Click to select files</p>
              <p className="text-sm text-gray-500 mt-2">Supported formats: JPG, PNG</p>
            </div>

            {/* Image Preview Grid */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.preview}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {images.length > 0 && images.length < 9 && (
                <div
                  onClick={() => document.getElementById('fileInput').click()}
                  className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500"
                >
                  <Plus className="text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Book Details */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-black">Book Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Book Title
                </label>
                <input
                  type="text"
                  value={bookDetails.title}
                  onChange={(e) => setBookDetails(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Enter book title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={bookDetails.category}
                  onChange={(e) => setBookDetails(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="children">Childrens Book</option>
                  <option value="photo">Photo Book</option>
                  <option value="comic">Comic Book</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={bookDetails.description}
                  onChange={(e) => setBookDetails(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  rows={4}
                  placeholder="Enter book description"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleContinue}
              className={`mt-6 w-full py-3 px-4 rounded-lg text-white font-medium
                ${images.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}
              `}
              disabled={images.length === 0}
            >
              Continue to Arrange Images
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBook;
