
import NavBar from "@/components/NavBar";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to TECO</h1>
          <p className="text-xl text-gray-600">Your one-stop shop for all your needs!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
