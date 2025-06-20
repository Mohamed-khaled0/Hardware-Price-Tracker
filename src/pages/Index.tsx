
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturesBar from "@/components/FeaturesBar";
import PopularCategories from "@/components/PopularCategories";
import PromoBanners from "@/components/PromoBanners";
import FeaturedBrands from "@/components/FeaturedBrands";
import Newsletter from "@/components/Newsletter";
import FeaturedProducts from "@/components/FeaturedProducts";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />
        <FeaturesBar />
        <PopularCategories />
        <FeaturedProducts />
        <PromoBanners />
        <FeaturedBrands />
        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
