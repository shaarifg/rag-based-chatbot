# Frontend Design Specification

## Visual Design

### Color Palette

```scss
--bg-primary: #0a0a0a       // Main background
--bg-secondary: #111111      // Secondary elements
--text-primary: #e0e0e0      // Main text
--text-secondary: #888888    // Muted text
--accent: #00ff88            // Primary accent (green)
--accent-dim: #00cc66        // Dimmed accent
--user-bg: #1a1a1a          // User message background
--bot-bg: #0f0f0f           // Bot message background
--input-bg: #151515         // Input field background
```

### Typography

- **Font Family**: 'Courier New', monospace
- **Body Size**: 14px
- **Header Size**: 20px
- **Small Text**: 11-12px
- **Line Height**: 1.6

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  HEADER (Fixed Top)                                 │
│  ┌─────────────────────────────────────────┐       │
│  │ ◆ NewsVoosh            [●] CONNECTED     │       │
│  │ Session: 550e8400...                    │       │
│  └─────────────────────────────────────────┘       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  CHAT MESSAGES (Scrollable)                        │
│  ┌────────────────────────────────────────┐        │
│  │ [U] User message...                    │        │
│  │                                 10:30  │        │
│  └────────────────────────────────────────┘        │
│                                                     │
│  ┌────────────────────────────────────────┐        │
│  │ [AI] Bot response with streaming...    │        │
│  │                                 10:31  │        │
│  └────────────────────────────────────────┘        │
│                                                     │
│  [AI] ⋯⋯⋯ (Typing indicator)                      │
│                                                     │
├─────────────────────────────────────────────────────┤
│  INPUT (Fixed Bottom)                               │
│  ┌──────────────────────────────────┬─────┬──────┐ │
│  │ Ask me anything...               │SEND │RESET │ │
│  └──────────────────────────────────┴─────┴──────┘ │
└─────────────────────────────────────────────────────┘
```

## Component Specifications

### 1. Background (Body)

**Layers** (bottom to top):

1. Base color: `#0a0a0a`
2. Horizontal lines (2px grid)
3. Vertical lines (2px grid)
4. 45° diagonal lines (10px spacing)
5. -45° diagonal lines (10px spacing)

**Pattern**:

- Grid opacity: 3%
- Diagonal opacity: 15%
- Creates "sketchy" technical aesthetic

**Implementation**:

```scss
background-image: repeating-linear-gradient(0deg, ...),
  // Horizontal
  repeating-linear-gradient(90deg, ...), // Vertical
  repeating-linear-gradient(45deg, ...),
  // Diagonal 1
  repeating-linear-gradient(-45deg, ...); // Diagonal 2
```

### 2. Header Component

**Structure**:

- Fixed at top
- Background: `#111111`
- Border bottom: 1px solid `#00cc66`
- Accent line: Gradient shimmer

**Elements**:

- Title with diamond symbol: `◆ NewsVoosh`
- Status indicator: Pulsing dot
- Session ID (first 8 chars)

**Styling**:

```scss
padding: 20px
border-bottom: 1px solid accent
no border-radius
no box-shadow
```

### 3. Message Component

**User Message**:

- Avatar: "U" on accent background
- Content: Right-aligned
- Background: `#1a1a1a`
- No border/shadow

**Assistant Message**:

- Avatar: "AI" on accent background
- Content: Left-aligned
- Background: `#0f0f0f`
- Left border: 2px solid accent

**Common**:

- Slide-in animation (0.3s)
- Timestamp (bottom right)
- No rounded corners

### 4. Typing Indicator

**Design**:

- Three dots (4x4px squares)
- Color: Accent green
- Animation: Sequential bounce
- Timing: 1.4s loop with delays

**Pattern**:

```
● ● ● (scale and fade in sequence)
```

### 5. Input Component

**Layout**:

- Fixed at bottom
- Flex row with gap: 12px
- Background: `#151515`
- Top border: Gradient line

**Input Field**:

- Flex: 1
- Border: 1px solid accent-dim
- Focus: Border accent
- No rounded corners
- Padding: 14px 16px

**Buttons**:

- SEND: Accent background, bold
- RESET: Transparent with border
- Hover: Lift effect (translateY -1px)
- No rounded corners
- No shadows

### 6. Empty State

**Elements**:

- Large diamond icon: ◆
- Title: "Welcome to NewsVoosh"
- Subtitle: Description
- Suggestion chips

**Animations**:

- Icon: Float animation (3s)
- Chips: Hover border change

## Animations

### 1. Message Slide-In

```scss
@keyframes messageSlide {
  from: opacity 0, translateY(10px)
  to: opacity 1, translateY(0)
}
```

### 2. Typing Dots

```scss
@keyframes typing {
  0%, 60%, 100%: scale(1), opacity(0.4)
  30%: scale(1.2), opacity(1)
}
```

### 3. Pulse (Status Dot)

```scss
@keyframes pulse {
  0%, 100%: opacity(1)
  50%: opacity(0.5)
}
```

### 4. Float (Empty State)

```scss
@keyframes float {
  0%, 100%: translateY(0)
  50%: translateY(-10px)
}
```

## Spacing System

- Extra small: 4px
- Small: 8px
- Medium: 12px
- Large: 16px
- Extra large: 20px

## Responsive Breakpoints

```scss
// Mobile
@media (max-width: 768px) {
  .message__content {
    max-width: 85%;
  }
  .chat-input {
    padding: 16px;
  }
}

// Tablet
@media (max-width: 1024px) {
  .message__content {
    max-width: 80%;
  }
}

// Desktop
@media (min-width: 1025px) {
  .message__content {
    max-width: 70%;
  }
}
```

## Interaction States

### Buttons

- **Normal**: Solid color
- **Hover**: Slight lift + brightness
- **Active**: Reset position
- **Disabled**: 50% opacity, no cursor

### Input

- **Normal**: Dim border
- **Focus**: Accent border
- **Disabled**: 50% opacity

### Messages

- **Sending**: Fade in
- **Received**: Slide in
- **Streaming**: Content updates

## Accessibility

- **Focus Indicators**: Accent border on focus
- **Keyboard Nav**: Tab through inputs/buttons
- **Screen Readers**: Semantic HTML
- **Contrast**: WCAG AA compliant

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- **CSS**: SCSS compiled to optimized CSS
- **Animations**: GPU-accelerated (transform, opacity)
- **Images**: None (pure CSS design)
- **Fonts**: System monospace fallback

## Design Principles

1. **No Borders** (except functional 1px lines)
2. **No Rounded Corners** (geometric, sharp)
3. **No Shadows** (flat design)
4. **Monospace** (technical aesthetic)
5. **Minimal** (content-first)
6. **Functional** (every element serves purpose)

## Sketchy Background Details

The background creates a "blueprint" or "technical schematic" aesthetic:

```scss
// Layer 1: Horizontal grid
repeating-linear-gradient(
  0deg,
  transparent,
  transparent 2px,
  rgba(255, 255, 255, 0.03) 2px,
  rgba(255, 255, 255, 0.03) 4px
)

// Layer 2: Vertical grid
repeating-linear-gradient(
  90deg,
  transparent,
  transparent 2px,
  rgba(255, 255, 255, 0.03) 2px,
  rgba(255, 255, 255, 0.03) 4px
)

// Layer 3: Diagonal accent
repeating-linear-gradient(
  45deg,
  transparent,
  transparent 10px,
  rgba(0, 255, 136, 0.15) 10px,
  rgba(0, 255, 136, 0.15) 11px
)

// Layer 4: Counter-diagonal accent
repeating-linear-gradient(
  -45deg,
  transparent,
  transparent 10px,
  rgba(0, 255, 136, 0.15) 10px,
  rgba(0, 255, 136, 0.15) 11px
)
```

Result: Complex layered pattern that appears hand-drawn or technical.

## Design Verification Checklist

- [ ] No `border-radius` anywhere
- [ ] No `box-shadow` anywhere
- [ ] Only 1px solid borders (functional)
- [ ] Background has multiple layers
- [ ] Monospace font applied
- [ ] Accent color used consistently
- [ ] Animations are smooth
- [ ] Full viewport height
- [ ] Responsive on mobile
- [ ] High contrast (dark theme)
