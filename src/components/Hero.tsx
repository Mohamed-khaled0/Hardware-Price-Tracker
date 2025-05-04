
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const heroSlides = [
  {
    id: 1,
    title: "Mega Sales Extravaganza!",
    description: "Unbelievable Deals And Massive Discounts Await You At Our Mega Sales Extravaganza",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    image: "/lovable-uploads/display.webp",
    bgColor: "bg-[#d0e0ec]",
  },
  {
    id: 2,
    title: "New Tech Arrivals",
    description: "Discover the latest tech gadgets with exclusive launch offers",
    buttonText: "Explore Now",
    buttonLink: "/new-arrivals",
    image: "/lovable-uploads/laptopHero.webp",
    bgColor: "bg-[#d8e5f0]",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-scroll functionality
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };
  
  // Set up interval for auto-scrolling
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        className="flex transition-transform duration-500 ease-in-out " 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {heroSlides.map((slide) => (
          <div 
            key={slide.id}
            className={cn("min-w-full h-[450px] relative", slide.bgColor)}
          >
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="max-w-lg pr-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">{slide.title}</h1>
                <p className="text-xl text-gray-600 mb-8">{slide.description}</p>
                <Button 
                  className="bg-[#39536f] hover:bg-[#2a405a] text-white px-8 py-6 rounded-lg text-lg"
                  asChild
                >
                  <a href={slide.buttonLink}>{slide.buttonText}</a>
                </Button>
              </div>
              <div className="hidden md:block absolute right-8 bottom-0">
                <img 
                  src={slide.image} 
                  alt="Hero product" 
                  className="max-h-[400px] object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>

      {/* Indicator dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button 
            key={index}
            className={cn(
              "w-3 h-3 rounded-full",
              currentSlide === index ? "bg-[#39536f]" : "bg-gray-300"
            )}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
