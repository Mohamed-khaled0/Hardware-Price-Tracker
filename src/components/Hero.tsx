import { Button } from "@/components/ui/button";

const heroData = {
  title: "Mega Sales Extravaganza!",
  description: "Unbelievable Deals And Massive Discounts Await You At Our Mega Sales Extravaganza",
  buttonText: "Shop Now",
  buttonLink: "/shop",
  image: "/lovable-uploads/display.webp",
  bgColor: "bg-[#d0e0ec]",
};

const Hero = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <div className={`min-w-full h-[450px] relative ${heroData.bgColor}`}>
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-lg pr-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">{heroData.title}</h1>
            <p className="text-xl text-gray-600 mb-8">{heroData.description}</p>
            <Button 
              className="bg-[#39536f] hover:bg-[#2a405a] text-white px-8 py-6 rounded-lg text-lg"
              asChild
            >
              <a href={heroData.buttonLink}>{heroData.buttonText}</a>
            </Button>
          </div>
          <div className="hidden md:block absolute right-20 bottom-0">
            <img 
              src={heroData.image} 
              alt="Hero product" 
              className="max-h-[400px] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
