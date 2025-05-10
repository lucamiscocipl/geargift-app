// filepath: geargift-react/src/components/Layout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
// You can also import a Footer component here if you create one

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* Page content will be rendered here */}
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default Layout;