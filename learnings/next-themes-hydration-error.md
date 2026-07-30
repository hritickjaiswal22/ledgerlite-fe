# Why do we need suppressHydrationWarning with next-themes?

The server can't know the user's persisted theme preference because it can't access browser APIs like localStorage or matchMedia. After hydration, next-themes reads the preference and updates the <html> element, which causes an expected difference between the server-rendered HTML and the client-rendered HTML. suppressHydrationWarning suppresses this known, intentional mismatch.

# From next-themes docs

Note! If you do not add suppressHydrationWarning to your <html> you will get warnings because next-themes updates that element. This property only applies one level deep, so it won't block hydration warnings on other elements.

# Error Trace

## Error Type

Console Error

## Error Message

A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

```
<HotReload globalError={[...]} webSocket={WebSocket} staticIndicatorState={{pathname:null, ...}}>
<AppDevOverlayErrorBoundary globalError={[...]}>
<ReplaySsrOnlyErrors>
<DevRootHTTPAccessFallbackBoundary>
<HTTPAccessFallbackBoundary notFound={<NotAllowedRootHTTPFallbackError>}>
<HTTPAccessFallbackErrorBoundary pathname="/" notFound={<NotAllowedRootHTTPFallbackError>} ...>
<RedirectBoundary>
<RedirectErrorBoundary router={{...}}>
<Head>
<**next_root_layout_boundary**>
<SegmentViewNode type="layout" pagePath="layout.tsx">
<SegmentTrieNode>
<link>
<script>
<script>
<script>
<RootLayout>
<html
lang="en"

-                         className="geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__varia..."

*                         className="geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__varia..."
*                         style={{color-scheme:"dark"}}
                        >
                  ...

  at html (unknown:0:0)
  at RootLayout (src/app/layout.tsx:28:5)
```

## Code Frame

```
26 | }>) {
27 | return (

> 28 | <html

     |     ^

29 | lang="en"
30 | // suppressHydrationWarning
31 | className={`${geistSans.variable} ${geistMo...
```

Next.js version: 16.2.12 (Turbopack)
