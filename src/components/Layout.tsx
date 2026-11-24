import { Outlet } from 'react-router-dom';
import Header from './Header';
import Toast from './Toast';

export default function Layout() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 32px 56px' }}>
        <Outlet />
      </main>
      <Toast />
    </>
  );
}