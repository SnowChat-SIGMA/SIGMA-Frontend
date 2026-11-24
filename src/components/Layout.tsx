import { Outlet } from 'react-router-dom';
import Header from './Header';
import Toast from './Toast';

export default function Layout() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 2rem 3.5rem' }}>
        <Outlet />
      </main>
      <Toast />
    </>
  );
}