
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#e6eef1] py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Contact Info */}
          <div className="col-span-1">
            <img 
              src="/lovable-uploads/bf098ade-1f1f-4fb7-9c5e-1b97aab674b8.png" 
              alt="TECO Logo" 
              className="h-12 mb-4 object-contain"
            />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-navy" />
                <span>Egypt, Mansoura</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-navy" />
                <span>Ahmeelmadawy32@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-navy" />
                <span>+201024710326</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/smartphones" className="hover:text-navy hover:underline">Smartphones</Link></li>
              <li><Link to="/watches" className="hover:text-navy hover:underline">Watches</Link></li>
              <li><Link to="/laptops" className="hover:text-navy hover:underline">Laptops</Link></li>
              <li><Link to="/camera" className="hover:text-navy hover:underline">Camera</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="hover:text-navy hover:underline">Faq</Link></li>
              <li><Link to="/shipping" className="hover:text-navy hover:underline">Shipping</Link></li>
              <li><Link to="/return-policy" className="hover:text-navy hover:underline">Return And Refund Policy</Link></li>
            </ul>
          </div>

          {/* About */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="hover:text-navy hover:underline">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-navy hover:underline">About Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Payment method</h3>
          <div className="flex flex-wrap gap-2">
            <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-8 w-auto object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/2560px-Google_Pay_Logo_%282020%29.svg.png" alt="Google Pay" className="h-8 w-auto object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-8 w-auto object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" alt="PayPal" className="h-8 w-auto object-contain" />
            <img src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/4_Alibaba_logo_logos-512.png" alt="Alibaba" className="h-8 w-auto object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/JCB_logo.svg/2560px-JCB_logo.svg.png" alt="JCB" className="h-8 w-auto object-contain" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
