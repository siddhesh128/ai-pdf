/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBookData } from "@/context/BookContext";
import { storage } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const SequenceAdjustment = () => {
  const router = useRouter();
  const { bookData, setBookData } = useBookData();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const draggedItemRef = useRef(null);

  useEffect(() => {
    if (bookData) {
      setImages(
        bookData.previews.map((url, index) => ({
          id: `image-${index}`,
          url,
          file: bookData.files[index],
        }))
      );
    }
  }, [bookData]);

  const handleDragStart = (e, index) => {
    draggedItemRef.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = draggedItemRef.current;
    if (dragIndex === null || dragIndex === dropIndex) return;

    const newImages = [...images];
    const [draggedItem] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);

    setImages(newImages);
    draggedItemRef.current = null;
  };

  const handleTouchStart = (e, index) => {
    draggedItemRef.current = index;
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);

    if (targetElement && targetElement.dataset.index) {
      const dropIndex = parseInt(targetElement.dataset.index, 10);
      const dragIndex = draggedItemRef.current;

      if (dragIndex !== null && dragIndex !== dropIndex) {
        const newImages = [...images];
        const [draggedItem] = newImages.splice(dragIndex, 1);
        newImages.splice(dropIndex, 0, draggedItem);

        setImages(newImages);
      }
    }

    draggedItemRef.current = null;
  };

  const handleContinue = async () => {
    try {
      setUploading(true);
      const uploadedUrls = [];
      const folderName = bookData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const fileExtension = image.file.name.split(".").pop();
        const storageRef = ref(
          storage,
          `books/${folderName}/page${i + 1}.${fileExtension}`
        );
        await uploadBytes(storageRef, image.file);
        const url = await getDownloadURL(storageRef);
        uploadedUrls.push(url);
      }

      setBookData({
        ...bookData,
        images: uploadedUrls,
      });

      router.push("/generate-book");
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
          Adjust Image Sequence
        </h2>
        <p className="text-gray-600 mb-6 md:mb-8">
          Drag and drop images to reorder them for your book.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onTouchStart={(e) => handleTouchStart(e, index)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              data-index={index}
              className="relative aspect-square cursor-move hover:opacity-75 transition-opacity"
            >
              <img
                src={image.url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 md:mt-8 flex flex-col md:flex-row justify-between gap-4 md:gap-0">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-200 rounded-lg flex items-center"
            disabled={uploading}
          >
            <ArrowLeft className="mr-2" /> Back
          </button>
          <button
            onClick={handleContinue}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Uploading...
              </>
            ) : (
              <>
                Continue <ArrowRight className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SequenceAdjustment;
