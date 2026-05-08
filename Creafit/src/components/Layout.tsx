import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import Cart from './Cart';
import Toast from './Toast';

export default function Layout() {
  return (
    <>
      <Nav />
      {/* Outlet renders the matched child route */}
      <main>
        <Outlet />
      </main>
      <Footer />
      <Cart />
      <Toast />
    </>
  );
}
