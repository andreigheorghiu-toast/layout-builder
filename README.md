# React playground: Layout Builder

### Stack

React + TS on Vite

### Concept: Layout builder

Loose project for getting used to React.  
Main purpose: achieving a set of defined UX features using React (e.g: dynamic components, state management, understanding re-rendering and hooks in React, etc...)

- the main reason I'm making this public is because I welcome any feedback (anti-patterns, etc...)

(self imposed) requirements:

- the project should be an empty skeleton, loading dynamically any modules and their widgets, from `/config` folder
  (achieved via `/components/async`)
- the project advances an opinionated layout design, grid based, best described by the following terms

**MODULE**
: a pluggable sub-system

- a module can have 0 or more widgets
- upon selection, a module pushes 0 or more widgets to the widgets track. If any of the widgets already exist, they should not be re-added (this can be changed, on a case-by-case basis)
- upon selection, a module should have the ability to focus/make active a particular widget (e.g: scroll to it)
- ideally an app should function without any module (so no module should be assumed as always available)

---

**WIDGET**
: reusable card containing interface elements for interacting with modules, data / app state

- widgets are displayed in widget tracks
- widgets can be minimized or removed. the underlying principle is to allow swift access to configurations and then recover the screen real-estate

---

**LAYOUT**
: configurable and editable document/report, aimed at displaying data

- a layout contains 1 or more (layout-)sections
- the layout should only contain references to components
- layout responsiveness levels:
  - `default` (a.k.a `xs`) `< 540px`
  - `sm` `< 768px`
  - `md` `< 992px`
  - `lg` `< 1200px`
  - `xl` `< 1540px`
  - `xxl` `>= 1540px`  
    The layout rules are always applied in the order specified above. So if you want layout A up to `lg`, layout B on `lg` and layout A on `xl` and above, you have to specify:

```json
{
  "xs": "Layout A",
  "lg": "Layout B",
  "xl": "Layout A"
}
```

---

(LAYOUT-) **SECTION**
: a slice of a layout

- a section contains 1 or more cells
- a layout section spans across the entire width of its layout container

---

(LAYOUT-) **CELL**
: empty slot containing 1 layout-component for displaying data.

---

(LAYOUT-) **COMPONENT**
: slottable component to occupy a layout cell and render available data

---

**DATA**
: layout, section or component configuration, containing rules about fetching data to be consumed by report components

- data config should be key-ed, to allow children to override parts of the parent data configuration, via deep merging.

---

---

###Notes:

- I haven't written any tests for it. I might, when I get some time for it.
