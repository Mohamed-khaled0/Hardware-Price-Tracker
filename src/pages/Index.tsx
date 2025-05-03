
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to TECO</h1>
          <p className="text-xl text-gray-600">Your one-stop shop for all your needs!</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
