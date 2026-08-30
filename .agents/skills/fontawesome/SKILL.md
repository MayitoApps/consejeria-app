---
name: fontawesome
description: Integrated Font Awesome and MCP Universal Icons helper to search, fetch, and embed Font Awesome icons (SVG, CSS, and React components) into applications.
---

# Font Awesome & MCP Icons Skill

This skill allows the agent to search and embed Font Awesome icons into HTML, React, Vue, Svelte, and CSS applications using `mcp-universal-icons` and `@fortawesome/fontawesome-free`.

## Capabilities

1. **Search Icons**: Search over 60,000+ SVG icons including Font Awesome Free (solid, regular, brands).
2. **SVG & CSS Embedding**: Generate SVG markup, Font Awesome CSS class tags (`<i className="fa-solid fa-icon"></i>`), or Font Awesome React components.
3. **CLI Integration**: Interacts via globally installed `mcp-universal-icons` and `@fortawesome/fontawesome-free`.

## Quick Reference

- **Font Awesome Free CDN / HTML**:
  ```html
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <i class="fa-solid fa-user"></i>
  <i class="fa-regular fa-heart"></i>
  <i class="fa-brands fa-github"></i>
  ```

- **React FontAwesome Component**:
  ```tsx
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faUser, faHeart } from '@fortawesome/free-solid-svg-icons';

  <FontAwesomeIcon icon={faUser} />
  ```

- **MCP Universal Icons Command**:
  ```bash
  npx mcp-universal-icons
  ```
