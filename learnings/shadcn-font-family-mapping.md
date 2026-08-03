# Create the font

```
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
```

Now make sure the variable name used is same as in `global.css`

```
@theme inline {
  ...
  --font-sans: var(--font-sans);
  --font-mono: var(--font-geist-mono);
  --font-heading: var(--font-sans);
  ...
}

@layer base {
  ...
  html {
    @apply font-sans;
  }
}

```
