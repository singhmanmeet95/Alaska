# Chat Page UI Guide

## 🎨 Visual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  DESKTOP VIEW (> 768px)                                         │
├─────────────────┬───────────────────────────────────────────────┤
│                 │  CHAT HEADER                                  │
│   CHAT LIST     │  ┌─────────────────────────────────────────┐ │
│                 │  │ [Avatar] Alice Johnson    [🔍] [⋮]     │ │
│  ┌───────────┐  │  │ Online                                  │ │
│  │ Search    │  │  └─────────────────────────────────────────┘ │
│  └───────────┘  │                                              │
│                 │  MESSAGE LIST                                │
│  Alice Johnson  │  ┌─────────────────────────────────────────┐ │
│  Hey! How...  ⓶│  │           Today                         │ │
│                 │  │                                         │ │
│  Bob Smith      │  │  ┌──────────────┐                      │ │
│  Thanks for...  │  │  │ Hey there!   │ 10:30 AM            │ │
│                 │  │  └──────────────┘                      │ │
│  Carol Williams │  │                                         │ │
│  Can we...    ⓹│  │                    ┌──────────────┐    │ │
│                 │  │     11:45 AM Hi!   │              │    │ │
│  [+ New Chat]   │  │                    └──────────────┘ ✓✓ │ │
│                 │  └─────────────────────────────────────────┘ │
│                 │                                              │
│                 │  MESSAGE INPUT                               │
│                 │  ┌─────────────────────────────────────────┐ │
│                 │  │ [😊] [📎] Type a message...      [➤]  │ │
│                 │  └─────────────────────────────────────────┘ │
└─────────────────┴───────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────┐
│  MOBILE VIEW (< 768px)                  │
│                                         │
│  CHAT LIST VIEW                         │
│  ┌───────────────────────────────────┐  │
│  │ Chats                    [+]      │  │
│  ├───────────────────────────────────┤  │
│  │ [Search chats...]                │  │
│  ├───────────────────────────────────┤  │
│  │ [👤] Alice Johnson      5m      ⓶│  │
│  │ Hey! How are you...              │  │
│  ├───────────────────────────────────┤  │
│  │ [👤] Bob Smith          2h        │  │
│  │ Thanks for your help...          │  │
│  ├───────────────────────────────────┤  │
│  │ [👤] Carol Williams     1d      ⓹│  │
│  │ Can we schedule...               │  │
│  └───────────────────────────────────┘  │
│                                         │
│  → Tap chat to open full view           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  CHAT VIEW (after selecting)            │
│  ┌───────────────────────────────────┐  │
│  │ [←] Alice Johnson  [📞] [⋮]      │  │
│  │     Online                        │  │
│  ├───────────────────────────────────┤  │
│  │           Today                   │  │
│  │                                   │  │
│  │  ┌────────────┐                  │  │
│  │  │ Message... │ 10:30 AM         │  │
│  │  └────────────┘                  │  │
│  │                  ┌────────────┐  │  │
│  │   11:45 AM Reply │            │  │  │
│  │                  └────────────┘  │  │
│  ├───────────────────────────────────┤  │
│  │ [😊] [📎] Type...         [➤]   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  [←] Back returns to chat list          │
└─────────────────────────────────────────┘
```

## 🎨 Color Reference

### Gradients

- **Primary**: `from-indigo-500 to-purple-600` (#6366F1 → #9333EA)
- **Background**: `from-gray-50 to-white` (#F9FAFB → #FFFFFF)

### Status Colors

- **Online**: Green #10B981
- **Offline**: Gray #6B7280
- **Away**: Yellow #F59E0B

### Message Bubbles

- **Sent**: Gradient (indigo to purple) with white text
- **Received**: White with gray border and dark text

### UI Elements

- **Unread Badge**: Indigo #6366F1
- **Read Status**: Blue #3B82F6
- **Borders**: Gray #E5E7EB
- **Hover**: Gray #F3F4F6

## 📐 Spacing & Sizing

### Components

- **Sidebar Width**: 384px (24rem) on desktop
- **Header Height**: 64px (4rem)
- **Avatar Size**:
  - Large: 48px (12rem) - Chat list
  - Medium: 40px (10rem) - Header
  - Small: 32px (8rem) - Message bubbles

### Padding

- **Container**: 16px (p-4)
- **Chat Items**: 12px (p-3)
- **Message Bubbles**: 16px horizontal, 8px vertical (px-4 py-2)

### Borders

- **Radius**:
  - Full: `rounded-full` - Buttons, search
  - Large: `rounded-2xl` - Message bubbles
  - Medium: `rounded-xl` - Containers

## 🎭 Animations

### Transitions

```css
transition-all duration-300  /* Sidebar toggle */
transition-colors            /* Button hovers */
hover:scale-105             /* Send button */
```

### Bounce Animation

Used for typing indicator dots:

```css
animate-bounce
animationDelay: 0.1s, 0.2s
```

## 📱 Interactive Elements

### Hover States

- Chat items: `hover:bg-gray-100`
- Buttons: `hover:bg-white/20` (on gradient) or `hover:bg-gray-100` (on white)
- Send button: `hover:shadow-lg hover:scale-105`

### Active States

- Selected chat: `bg-indigo-50` with left border `border-l-4 border-l-indigo-500`
- Focus: `focus:ring-2 focus:ring-indigo-500`

### Disabled States

- Input disabled: `bg-gray-200 text-gray-400 cursor-not-allowed`

## 🔤 Typography

### Font Sizes

- **Headers**: `text-xl` (20px) - 24px (text-2xl)
- **Body**: `text-sm` (14px) - 16px (text-base)
- **Small**: `text-xs` (12px)

### Font Weights

- **Bold**: `font-bold` (700) - Headers
- **Semibold**: `font-semibold` (600) - Names
- **Medium**: `font-medium` (500) - Emphasis
- **Regular**: Default (400) - Body text

## 📊 Component States

### Message Status

1. **Sent** (✓): Single gray checkmark
2. **Delivered** (✓✓): Double gray checkmarks
3. **Read** (✓✓): Double blue checkmarks

### User Status

1. **Online**: Green dot next to avatar
2. **Offline**: "Last seen X ago"
3. **Away**: Yellow dot (optional)

### Chat States

1. **Unread**: Bold text + badge counter
2. **Typing**: "Typing..." in italic + indigo color
3. **Normal**: Regular text + timestamp

## 🎯 Responsive Breakpoints

```css
/* Mobile First */
default: < 768px

/* Tablet & Desktop */
md: 768px {
  .sidebar {
    display: block;
    width: 384px;
  }
  .chat-window {
    display: flex;
  }
}
```

## 💡 Best Practices

1. **Images**: Use UI Avatars or real profile pictures
2. **Timestamps**: Format relative (5m, 2h, 1d) for recent, dates for old
3. **Overflow**: Use `truncate` for long text in lists
4. **Accessibility**: Include alt text and aria labels
5. **Performance**: Virtualize long message lists if needed

---

This guide helps maintain consistent styling across the chat interface.
