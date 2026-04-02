
import { useEffect, useState, useRef } from 'react';
import './App.css'
import MyNavbar from './Components/MyNavbar';
import CartSidebar from './Components/CartSidebar';
import WishlistSidebar from './Components/WishlistSidebar';
// Add these to your imports at the top
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Shop from './Pages/Shop';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import AdminDashboard from './Pages/AdminDashboard';
import Footer from './Components/Footer';



function App() {


  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async (retries = 3) => {
      try {
        const res = await fetch("https://techmarkett.onrender.com/api/products");

        if (!res.ok) throw new Error("Server not ready");

        const data = await res.json();

        const productsArray = data.data || [];

        const formattedProducts = productsArray.map(item => ({
          ...item,
          id: item.id || item._id
        }));

        if (isMounted) {
          setProducts(formattedProducts);
        }

      } catch (err) {
        console.log("Retrying...", err);

        if (retries > 0) {
          setTimeout(() => fetchProducts(retries - 1), 3000);
        }
      }
    };

    // 🔥 Wake backend first
    // fetch("https://techmarkett.onrender.com"); // Not needed for localhost

    // ⏳ Then fetch data
    setTimeout(fetchProducts, 2000);

    return () => { isMounted = false; };
  }, []);

  const top = useRef(null);

  function scrollontop() {
    if (top.current) {
      top.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ✅ Get all unique brands from our products data
  const allbrands = [...new Set(products.map((p) => p.brand))];

  // ✅ STATE: Cart items — each item has product data + quantity
  const [cartItem, setcartItem] = useState(() => {
    const saveditems = localStorage.getItem("myitems");
    if (saveditems) {
      return JSON.parse(saveditems);
    }
    return [];
  });

  useEffect(() => {
    const storeitems = JSON.stringify(cartItem);
    localStorage.setItem("myitems", storeitems);
  }, [cartItem])

  // ✅ STATE: Wishlist — stores product IDs (just numbers)
  const [wishlist, setwishlist] = useState(() => {
    const savedlist = localStorage.getItem("mylist");

    if (savedlist) {
      return JSON.parse(savedlist);
    }
    return [];
  });

  useEffect(() => {
    const storelist = JSON.stringify(wishlist);
    localStorage.setItem("mylist", storelist);

  }, [wishlist])

  // ✅ STATE: Search term — filters products by name
  const [searchTerm, SetsearchTerm] = useState("");

  // ✅ STATE: Selected brand — "All" means show all brands
  const [selectbrand, setselectbrand] = useState("All");

  // ✅ STATE: Sort option — "default", "price-low", "price-high", "rating-high", "rating-low"
  const [sort, setSort] = useState("default");

  // ✅ STATE: Cart sidebar open/close
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ✅ STATE: Dark/Light mode — starts in dark mode
  const [isDarkMode, setIsDarkMode] = useState(true);



  // ═══════════════════════════════════════════
  // 🛒 ADD TO CART — adds product or increases quantity
  // ═══════════════════════════════════════════
  function addtoCart(product) {
    const existing = cartItem.find(item => item.id === product.id);

    if (existing) {
      setcartItem(
        cartItem.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setcartItem([...cartItem, { ...product, quantity: 1 }]);
    }
  }

  // ═══════════════════════════════════════════
  // ➖ DECREASE QUANTITY — reduce by 1, remove if quantity becomes 0
  // ═══════════════════════════════════════════
  // How it works:
  //   1. If quantity > 1 → decrease by 1 using .map()
  //   2. If quantity === 1 → remove the item using .filter()
  function decreaseQuantity(productId) {
    const item = cartItem.find(item => item.id === productId);

    if (item.quantity === 1) {
      // Last one → remove entirely
      setcartItem(cartItem.filter(item => item.id !== productId));
    } else {
      // More than 1 → decrease by 1
      setcartItem(
        cartItem.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }
  }

  // ═══════════════════════════════════════════
  // 🗑️ REMOVE FROM CART — completely remove an item
  // ═══════════════════════════════════════════
  function removeFromCart(productId) {
    setcartItem(cartItem.filter(item => item.id !== productId));
  }

  // ═══════════════════════════════════════════
  // 🔢 CART CALCULATIONS
  // ═══════════════════════════════════════════
  const cartcount = cartItem.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const cartsum = cartItem.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // ═══════════════════════════════════════════
  // ❤️ WISHLIST TOGGLE — add/remove product ID
  // ═══════════════════════════════════════════
  function addtowishlist(productid) {
    if (wishlist.includes(productid)) {
      setwishlist(wishlist.filter((id) => id !== productid));
    } else {
      setwishlist([...wishlist, productid]);
    }
  }

  // ✅ STATE: Wishlist sidebar open/close
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // ═══════════════════════════════════════════
  // ❤️ WISHLIST SIDEBAR DATA
  // ═══════════════════════════════════════════
  // Wishlist only stores IDs. We need to map those IDs back to the actual product objects
  // We use .filter(Boolean) to ignore any IDs that haven't loaded from the backend yet!
  const wishlistedItems = wishlist
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  // ═══════════════════════════════════════════
  // 🔍 UNIFIED FILTER + SORT PIPELINE
  // ═══════════════════════════════════════════
  let displayProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectbrand !== "All") {
    displayProducts = displayProducts.filter((p) =>
      p.brand.toLowerCase() === selectbrand.toLowerCase()
    );
  }

  if (sort === "price-low") {
    displayProducts = [...displayProducts].sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    displayProducts = [...displayProducts].sort((a, b) => b.price - a.price);
  } else if (sort === "rating-high") {
    displayProducts = [...displayProducts].sort((a, b) => b.rating - a.rating);
  } else if (sort === "rating-low") {
    displayProducts = [...displayProducts].sort((a, b) => a.rating - b.rating);
  }

  return (
    // ✅ Dark/Light mode: we add a class to the root div
    // CSS uses this class to swap ALL colors at once
    <div className={`App ${isDarkMode ? "dark-mode" : "light-mode"}`}>

      {/* ═══════════════════════════════════════════ */}
      {/* 🛒 CART SIDEBAR (slides in from right)     */}
      {/* ═══════════════════════════════════════════ */}
      <CartSidebar
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItem={cartItem}
        decreaseQuantity={decreaseQuantity}
        addtoCart={addtoCart}
        removeFromCart={removeFromCart}
        cartcount={cartcount}
        cartsum={cartsum}
      />

      {/* ═══════════════════════════════════════════ */}
      {/* ❤️ WISHLIST SIDEBAR (slides in from right) */}
      {/* ═══════════════════════════════════════════ */}
      <WishlistSidebar
        isWishlistOpen={isWishlistOpen}
        setIsWishlistOpen={setIsWishlistOpen}
        wishlist={wishlist}
        wishlistedItems={wishlistedItems}
        addtoCart={addtoCart}
        addtowishlist={addtowishlist}
      />

      {/* ═══════════════════════════════════════════ */}
      {/* 🧭 NAVIGATION BAR                         */}
      {/* ═══════════════════════════════════════════ */}
      <MyNavbar
        cartcount={cartcount}
        cartsum={cartsum}
        wishlistLength={wishlist.length}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        setIsCartOpen={setIsCartOpen}
        setIsWishlistOpen={setIsWishlistOpen}
      />

      {/* ═══════════════════════════════════════════ */}
      {/* 🦸 HERO SECTION                            */}
      {/* ═══════════════════════════════════════════ */}
      {/* <Hero scrollontop={scrollontop} /> */}

      {/* ═══════════════════════════════════════════ */}
      {/* 🛍️ PRODUCTS SECTION                        */}
      {/* ═══════════════════════════════════════════ */}
      {/* <ProductsSection
        searchTerm={searchTerm}
        SetsearchTerm={SetsearchTerm}
        selectbrand={selectbrand}
        setselectbrand={setselectbrand}
        allbrands={allbrands}
        sort={sort}
        setSort={setSort}
        displayProducts={displayProducts}
        cartItem={cartItem}
        wishlist={wishlist}
        addtoCart={addtoCart}
        addtowishlist={addtowishlist}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
        topRef={top}
      /> */}

      {/* ═══════════════════════════════════════════ */}
      {/* 🛣️ PAGE ROUTES                            */}
      {/* ═══════════════════════════════════════════ */}
      <Routes>
        {/* When the URL is exact root "/", show the Home page (Hero) */}
        <Route
          path="/"
          element={<Home scrollontop={scrollontop} />}
        />

        {/* When the URL is "/shop", show the Shop page (Products) */}
        <Route
          path="/shop"
          element={
            <Shop
              searchTerm={searchTerm}
              SetsearchTerm={SetsearchTerm}
              selectbrand={selectbrand}
              setselectbrand={setselectbrand}
              allbrands={allbrands}
              sort={sort}
              setSort={setSort}
              displayProducts={displayProducts}
              cartItem={cartItem}
              wishlist={wishlist}
              addtoCart={addtoCart}
              addtowishlist={addtowishlist}
              decreaseQuantity={decreaseQuantity}
              removeFromCart={removeFromCart}
              topRef={top}
            />
          }
        />

        {/* When the URL is "/about", show the About page */}
        <Route
          path="/about"
          element={<About />}
        />
        {/* When the URL is "/contact", show the Contact page */}
        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin dashboard (protected inside the component) */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>


      {/* ═══════════════════════════════════════════ */}
      {/* 📋 PROFESSIONAL FOOTER                     */}
      {/* ═══════════════════════════════════════════ */}
      <Footer scrollontop={scrollontop} />
    </div>
  )
}

export default App
