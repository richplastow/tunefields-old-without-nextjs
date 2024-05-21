# Step 3: 'Not Found' and deep links

[^ Notes](./00-notes.md)

Following [Step 1: Setting up Nx,](./01-setting-up-nx.md) app routing has
several issues when served using GitHub Pages:

1. There is no '404 Not Found' page
2. Deep linking to /tunefields/make/page-2/ does not work
3. The 'maker' app's generated 'page-2' and 'home' links show non-canonical URLs
   in the browser's address bar

## Add a '404 Not Found' page

Add a docs/404.html file with basic forwarding:

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
