import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import Cart from './Cart';
import Toast from './Toast';
import FloatingWhatsApp from './FloatingWhatsApp';
import CartSaveIndicator from './CartSaveIndicator';

export default function Layout() {
  return (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Cart />
      <Toast />
      <FloatingWhatsApp />
      <CartSaveIndicator />
    </>
  );
}
