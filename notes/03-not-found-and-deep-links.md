# Step 3: 'Not Found' and deep links

[^ Notes](./00-notes.md)

Following [Step 1: Setting up Nx,](./01-setting-up-nx.md) app routing has
several issues when served using GitHub Pages:

1. There is no '404 Not Found' page
2. Deep linking to /tunefields/make/page-2/ does not work
3. The 'maker' app's generated 'page-2' and 'home' links show non-canonical URLs
   in the browser's address bar

React Router provides a `<HashRouter>` which would solve some of these problems.
But the way that `<BrowserRouter>` URLs look is nicer, I think.

## Add a '404 Not Found' page

The docs/404.html file below shows 'Tunefields Not Found' for deep-link requests
which do not point to a subdirectory of /make/ or /view/ (or /tunefields/make/
or /tunefields/view/ on richplastow.com).

However, all deep-link requests which __*do*__ point to such a subdirectory are
redirected, with the subdirectory details moved into a URL query. For example:

```
If on richplastow.com:
/tunefields/make/someID/123/edit -> /tunefields/make/?redirect=someID/123/edit

If not on richplastow.com:
/view/a/?b&c=d#e&f=g -> /tunefields/view/?b&c=d&redirect=a/#e&f=g
```

> Note that redirection is done using replace(), which means that the unservable
> deep link is removed from the browser's history. So if the user clicks the
> 'Back' button after the redirect, they will return to whatever URL they were
> at __*before*__ they clicked the unservable deep link.

```html
<!DOCTYPE html>
<html lang="en" />
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="view/favicon.ico" />
    <title>Tunefields</title>
</head>
<body>
    <noscript>
        <h1>Tunefields</h1>
        <p>Not Found</p>
    </noscript>
    <div id="not-found" style="display:none">
        <h1>Tunefields</h1>
        <p>Not Found</p>
    </div>
    <script>!function(){ // ES3, for maximum compatibility
        var hasGHPagesRoot = false;
        var parts = location.pathname.split('/');
        if (parts[0] !== '') throw Error('location.pathname does not begin "/"');
        parts.shift(); // remove "/" from start of pathname
        if (location.hostname === 'richplastow.com' && parts[0] === 'tunefields') {
            hasGHPagesRoot = true;
            parts.shift(); // normalise prod and dev
        }
        switch (parts[0]) {
            // TODO add 'admin'
            case 'make':
            case 'view':
                redirectTo(hasGHPagesRoot, parts);
                break;
            default:
                show404();
        }
        function redirectTo(hasGHPagesRoot, parts) {
            location.replace( // replace() will remove current URL from history
                location.origin + // eg "https://richplastow.com" or "http://localhost:9080"
                (hasGHPagesRoot ? '/tunefields/' : '/') +
                parts[0] + // must be "admin", "make" or "view"
                '/' + // needed for local static-server, but not for GitHub Pages
                location.search + // eg "" or "?a&b=c"
                (location.search ? '&' : '?') +
                'redirect=' + parts.slice(1).join('/') + // eg "someId/123/edit/"
                location.hash // eg "" or "#d&e=f"
            );
        }
        function show404() {
            document.getElementById('not-found').style.display = 'block';
        }
    }()</script>
</body>
</html>
```

## Fix the 'maker' app's generated 'Page 2' and 'Home' links

Currently, although these do work, the links show non-canonical URLs in the
browser's address bar. For example:

```
While at:
    https://richplastow.com/tunefields/make/
Click the 'Page 2' link, and the address bar will change to:
    https://richplastow.com/page-2

While at:
    http://localhost:9080/make/
Click the 'Page 2' link, and the address bar will change to:
    http://localhost:9080/page-2
```

In both cases, Page 2 renders and works without any problems. But refreshing
the page (or deep linking to this unservable URL) shows 'Tunefields Not Found'.

The solution is to add a `basename` prop to the 'maker' app's `<BrowserRouter>`,
in the apps/maker/src/main.tsx file:

```tsx
// ...
root.render(
  <StrictMode>
    <BrowserRouter basename={
      location.hostname === 'richplastow.com' ? '/tunefields/make/' : '/make/'
    }>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

> If `build` generates extra docs/make/assets/main-SOME_ID.js files which don't
> seem to be used, delete the .nx/cache/ folder and try `build` again.

```
Now, while at:
    https://richplastow.com/tunefields/make/
Click the 'Page 2' link, and the address bar will change to:
    https://richplastow.com/tunefields/make/page-2

While at:
    http://localhost:9080/make/
Click the 'Page 2' link, and the address bar will change to:
    http://localhost:9080/make/page-2
```

In both cases, Page 2 still renders and works without any problems. But now
refreshing the page (or deep linking to this unservable URL) redirects to the
correct /make/?redirect=page-2 URL.

## Get the 'maker' app to deal with a "redirect" query-string

Add some hooks to apps/maker/src/app/app.tsx which redirect to the correct deep
link, if "redirect" is in the URL's query-string.

```tsx
// ...
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
  }, []);

  // ...
}

export default App;
```