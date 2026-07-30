# Theme Toggle Working

For toggling the theme `useTheme` from `next-themes` is used and it provides `setTheme` hook provided by `next-themes` library.

# Why theme toggler is a Client component

1. Interactive Event Handlers (onClick)

   Server Components generate static markup on the server. Functions like onClick, onChange, or addEventListener represent dynamic behavior that can only be attached to the browser's DOM elements during hydration.

   Because onClick={() => setTheme("dark")} needs to execute JavaScript on the user's browser when clicked, Next.js requires the component to be marked with "use client".

2. React Hooks & Context (useTheme)

The useTheme() hook from next-themes relies on React Context under the hood.

    React Context (createContext, useContext) is a client-side feature used to share state dynamically across the component tree.

    Hooks like useState, useEffect, and useContext do not exist in Server Components because Server Components do not maintain state or re-render interactively after being sent to the browser.

Since useTheme() needs to access the context provided by <ThemeProvider> and read/update client-side state (like localStorage and the document.documentElement class list), it can only be executed in a Client Component.
