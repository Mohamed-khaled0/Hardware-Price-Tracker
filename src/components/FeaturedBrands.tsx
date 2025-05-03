
import React from "react";

const brands = [
  {
    id: 1,
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    id: 2,
    name: "HP",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg",
  },
  {
    id: 3,
    name: "Dell",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg",
  },
  {
    id: 4,
    name: "Lenovo",
    logo: "https://1000logos.net/wp-content/uploads/2017/03/Lenovo-Logo-768x432.png"
  },
  {
    id: 5,
    name: "Samsung",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
  },
];

const FeaturedBrands = () => {
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Featured brands</h2>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {brands.map((brand) => (
            <div key={brand.id} className="w-24 md:w-32">
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="w-full h-auto object-contain max-h-16"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedBrands;
