# Module Planner

Module Planner helps you easily plan your modules for each semester with a simple drag-and-drop interface and smart prerequisite checking. 

# Demo
![enter image description here](https://media.giphy.com/media/MFOrvMpBmbK8ZwE0zy/giphy.gif)

Visit [https://darrelhong.github.io/modplanner/](https://darrelhong.github.io/modplanner/) for live demo.

# Progress
### Milestone 2 to 3
- Improved prerequisite checking
- Updated module card
- Various UI/UX improvements
- Save session state
- Export png function
- Module credit counter
- Improved search function

View commit history for detailed code history and updates.

## Implemented features

## Intuitive drag & drop interface

Draggable elements created using SortableJS API.

## Multi-year view
![enter image description here](https://media.giphy.com/media/cmxx6kOnOA7leOM5uP/giphy.gif)

Collapsable multi-year view using Bootstrap.

## Prerequisite checking
![enter image description here](https://media.giphy.com/media/Qtw042ro3fLaj3pNrg/giphy.gif)

Uses NUSMods API to fetch module data which contains prerequisite tree/fulfilled requirements. Some modules have AND/OR conditions which our current algorithm does not support.

## Core module generation
Select your course of study to generate a list of your core modules.

## Autocomplete module search function
Search for any module by module code or name and add to module list.

## Download as PNG
![enter image description here](https://media.giphy.com/media/fqsTHIG4aWf4oQKCh2/giphy.gif)

Export completed module plan as png image.

# UI/UX
- Simple one page design.
- Resizable bootstrap grid for flexible column widths and module cards that adapts to displays of all sizes including mobile.
- Added informative tooltips and popovers to help users easily get used to the website.
- Module credit counter
- Maximum of 7 modules can be put into one semester.
- Links to module pages open in new tab.
- Convenient delete module button.
- Feedback link at bottom of site.

# User testing
- Self testing on local branch.
- Live website based on master branch hosted on GitHub pages.
- Feedback link on website
- Evaluation of live website by orbital peers and advisor.
- Feedback gathered from NUS students after using live website.

# Optimisations

- Store JSON data in [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) to reduce fetch calls. 
- Data will be re-fetched after set expiry date.
- Module plan stored in LocalStorage for persistence.

# Future/proposed features

### Automatically populate modules

Core modules will be automatically placed into most suitable semester.

### Module list sorting options

Sort module buffer list by name, module code or level.

# APIs used

- [NUSMods API](https://nusmods.com/api/v2) - To retrieve module information (MCs, Prerequisites etc.)
- [SortarbleJS](https://github.com/SortableJS/Sortable) - JS library for implementing drag-and-drop lists
- [Autocomplete](https://github.com/kraaden/autocomplete) - Lightweight autocomplete library for module search function
- [html2canvas](https://html2canvas.hertzen.com/) - Take screenshot for export function

# Source code

Source code available on [GitHub](https://github.com/darrelhong/modplanner).

# Feedback

Feel free to file an issue on GitHub if you have any feedback!
