You've mixed up **Tailwind's token naming convention**.

Let's break it down.

## What you have

```css
@theme inline {
  --border-input: var(--border-input);
}
```

This is effectively:

```css
--border-input -> --border-input
```

It doesn't create a Tailwind color token.

---

## How Tailwind v4 expects colors

Inside `@theme`, **colors must be prefixed with `--color-`**.

For example:

```css
@theme inline {
  --color-border-input: var(--border-input);
}
```

Now Tailwind generates utilities like:

```tsx
border - border - input;
bg - border - input;
text - border - input;
```

---

## But here's the bigger question...

**Why are you creating `--border-input` at all?**

shadcn already has:

```css
:root {
  --input: ...;
}
```

and in `@theme`:

```css
--color-input: var(--input);
```

which gives you:

```tsx
className = "border-input";
```

So if your goal is:

> "Change the default border color of all inputs"

just change:

```css
:root {
  --input: oklch(...);
}

.dark {
  --input: oklch(...);
}
```

That's all.

---
