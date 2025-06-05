import './App.css';
import Navbar from './Components/Navbar/navbar';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import LoginSignup from './Pages/LoginSignup';
import Cart from './Pages/Cart';
import Shop from './Pages/Shop';
import SearchPage from './Pages/SearchPage';
import Footer from './Components/Footer/Footer';
import construction_banner from './Components/assets/Construction-banner-1.jpg';
import electricals_banner from './Components/assets/Electricals-banner-1.jpg';
import plumbing_banner from './Components/assets/Plumbing-banner-2.jpg';
import Farmtools_banner from './Components/assets/Farmtools-banner-1.jpg';

function App() {
  return (
    <div>
    <BrowserRouter>

     <Navbar />
     <Routes>
      <Route path='/' element={<Shop/>}/>
      <Route path='/CONSTRUCTION' element={<ShopCategory banner={construction_banner} category='construction'/>}/>
      <Route path='/ELECTRICALS' element={<ShopCategory banner={electricals_banner} category='electricals'/>}/>
      <Route path='/PLUMBING' element={<ShopCategory banner={plumbing_banner} category='plumbing'/>}/>
      <Route path='/FARM TOOLS' element={<ShopCategory banner={Farmtools_banner} category='farm Tools'/>}/>
      <Route path='/search' element={<SearchPage/>}/>
      <Route path='product' element={<Product/>}>
        <Route path=':productId' element={<Product/>}/>
      </Route>
      <Route path='/Cart' element={<Cart/>}/>
      <Route path='/Login' element={<LoginSignup/>}/>
     </Routes>
     <Footer/>
     
     </BrowserRouter>
    </div>
  );
}

export default App;