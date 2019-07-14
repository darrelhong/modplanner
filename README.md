
# Module Planner

Module Planner helps you easily plan your modules for each semester with a simple drag-and-drop interface and smart prerequisite checking. 

# Demo
![enter image description here](https://media.giphy.com/media/cm56DtxRtY6b1s45Kx/giphy.gif)

Visit [https://darrelhong.github.io/modplanner/](https://darrelhong.github.io/modplanner/) for live demo.

# Progress
### Milestone 1 Goals

- **Drag-and-drop functionality** - Achieved
- **Multi-year view** - Achieved
- **Prerequisite checking** - Partially Achieved

## Implemented features

### Drag-drop

Draggable elements created using SortableJS API.

### Multi-year view

Collapsable multi-year view using Bootstrap.

### Prerequisite checking
![enter image description here](https://media.giphy.com/media/icJjbM9fDcpo5XdP0m/giphy.gif)

Uses NUSMods API to fetch module data which contains prerequisite tree/fulfilled requirements. Some modules have AND/OR conditions which our current algorithm does not support.

### Module search function

Search for any module and add to module list.

## Optimisations

- Store JSON data in [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) to reduce fetch calls. 
- Data will be re-fetched after set expiry date.

## Work-in-progress/proposed features

### Generate list of core modules for each course

### Improved prerequisite checking

Improve prerequisite checking to account for AND/OR conditions.

### Persist state 

Save current state of modules in LocalStorage.

### Export as PDF function

Export completed module planner view as PDF.

### Automatically populate modules

Core modules will be automatically placed into most suitable semester.

# APIs used

- [NUSMods API](https://nusmods.com/api/v2) - To retrieve module information (MCs, Prerequisites etc.)
- [SortarbleJS](https://github.com/SortableJS/Sortable) - JS library for implementing drag-and-drop lists
- [Autocomplete](https://github.com/kraaden/autocomplete) - Lightweight autocomplete library for module search function
- [html2canvas](https://html2canvas.hertzen.com/) - Take screenshot for export function

# Source code

Source code available on [GitHub](https://github.com/darrelhong/modplanner).

# Feedback

Feel free to file an issue on GitHub if you have any feedback!
