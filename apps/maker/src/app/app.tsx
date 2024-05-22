import { UiFooter } from '@tunefields/shared-ui';
import NxWelcome from './nx-welcome';

import { useEffect } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

export function App() {

  // For a URL with "redirect" in its query (likely from 404.html), redirect
  // "/make/?redirect=page-2" to "/make/page-2".
  // The hash and any other query string values should be preserved, so redirect
  // "/make/?a=b&redirect=page-2#hash" to "/make/page-2?a=b#hash".
  const { hash, search } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    let redirect = searchParams.get('redirect');
    if (!redirect) return; // null or empty string, so no redirect is needed
    searchParams.delete('redirect');
    if (searchParams.size) redirect = `${redirect}?${searchParams}`;
    redirect += hash; // either an empty string, or "#starts-with-hash"
    navigate(redirect, { replace: true }); // remove current URL from history
  }, [hash, navigate, search]);

  return (
    <div>
      <style jsx>{`
        /** your style here **/
      `}</style>

      <NxWelcome title="maker" />

      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes>
      {/* END: routes */}
      <UiFooter />
    </div>
  );
}

export default App;
