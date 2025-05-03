
import React from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Laptops",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071",
    link: "/categories/laptops",
  },
  {
    id: 2,
    name: "Smartphones",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02ff9?q=80&w=1780",
    link: "/categories/smartphones",
  },
  {
    id: 3,
    name: "Cameras",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1770",
    link: "/categories/cameras",
  },
  {
    id: 4,
    name: "Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1770",
    link: "/categories/headphones",
  },
  {
    id: 5,
    name: "Smart TV",
    image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?q=80&w=1933",
    link: "/categories/smart-tv",
  },
  {
    id: 6,
    name: "Smart Watches",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1772",
    link: "/categories/smart-watches",
  },
];

const PopularCategories = () => {
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={category.link}
              className="group flex flex-col items-center"
            >
              <div className="bg-[#d0e0ec] rounded-lg p-4 mb-4 w-full aspect-square flex items-center justify-center overflow-hidden group-hover:bg-[#c0d5e8] transition-colors">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <h3 className="text-center font-medium">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCategories;
