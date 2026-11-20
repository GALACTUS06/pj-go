# PJ Go — Brand & Design Tokens

Locked for MVP. Implement as CSS variables in `src/styles/tokens.css`.

---

## Colors

| Token | Hex | Use |
|-------|-----|-----|
| `--pj-navy` | `#0B1F33` | Primary text, headers, follow chrome |
| `--pj-navy-ink` | `#06141F` | Darkest surfaces |
| `--pj-ferry-red` | `#C8102E` | Primary CTA, collected accent |
| `--pj-sea` | `#2F6F8F` | Water mesh / links |
| `--pj-foam` | `#F4F7FA` | App background |
| `--pj-mist` | `#E2E8EE` | Dividers, disabled |
| `--pj-sand` | `#D9C7A8` | Ground plane tint (subtle) |
| `--pj-marker` | `#F0B429` | Uncollected checkpoint glow |
| `--pj-marker-done` | `#5B8C5A` | Collected marker |
| `--pj-white` | `#FFFFFF` | Sheets, puzzle tiles |

Do **not** use purple gradients or cream+terracotta AI-default palettes.

---

## Typography

```css
--pj-font: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
--pj-size-title: clamp(1.75rem, 5vw, 2.25rem);
--pj-size-body: 1rem;
--pj-size-small: 0.875rem;
--pj-weight-bold: 700;
--pj-weight-medium: 600;
```

Expressive display fonts deferred post-MVP.

---

## Spacing & controls

| Token | Value |
|-------|-------|
| Safe area | `env(safe-area-inset-*)` |
| Min tap target | 44×44 px |
| Joystick base | 120 px diameter |
| Sheet radius | 16 px |
| HUD chip radius | 10 px |

---

## Motion

| Token | Value |
|-------|-------|
| Camera lerp τ | 0.2 s |
| GPS lerp τ | 0.3 s |
| Sheet enter | 180 ms ease-out |
| Reduce motion | honor `prefers-reduced-motion` + save flag |

Intentional motions (ship ≥2): (1) check-in sheet slide-up, (2) piece unlock toast, (3) finale fade-in.

---

## 3D materials

| Surface | Color |
|---------|-------|
| Buildings | `#D8DEE6` matte |
| Ground | `#C5B79A` |
| Water | `#2F6F8F` opacity 0.85 |
| Avatar | `#0B1F33` body + `#C8102E` accent band |
| Checkpoint uncollected | emissive `#F0B429` |
| Checkpoint collected | `#5B8C5A` |

Fog: light `#F4F7FA`, near 40 / far 220 (tune).
