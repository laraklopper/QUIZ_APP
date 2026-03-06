# Accessible Rich Internet Applications (ARIA)

## TABLE OF CONTENTS
1. [Overview](#overview)
2. 

## **Overview**
The domain of web accessibility defines how to make web content usable by persons with disabilities. Accessible Rich Internet Applications (ARIA) define ways to make the web more accessible to people with disabilities. ARIA attributes improve accessibility for users relying on assistive technologies. Many standard HTML elements have built-in accessibility features. However, when developers create custom components (like modals, tabs, sliders, etc.), these features might not be present. 

ARIA bridges this gap by:

- Providing semantic information to assistive technologies (e.g., screen readers).
- Enhancing the usability of interactive elements for users with disabilities.
- Enabling dynamic content updates to be communicated effectively.

##  Key ARIA Roles

ARIA defines a number of **roles** that describe the type of widget presented to the user:

| Role | Description |
|------|-------------|
| `button` | Identifies an element as a button |
| `dialog` | Marks a dialog window |
| `navigation` | Denotes a navigation section |
| `alert` | Marks a message that should grab the user’s attention |
| `tooltip` | Describes a pop-up that provides more information |