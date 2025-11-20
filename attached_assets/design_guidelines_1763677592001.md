# Design Guidelines: Plataforma de Gestión de Notas Académicas

## Design Approach
**System-Based Approach** inspired by modern productivity tools (Linear, Notion, Asana) emphasizing clarity, efficiency, and data hierarchy. This is a utility-focused educational dashboard requiring clean information architecture and intuitive navigation.

## Core Design Principles
1. **Data Clarity First**: Information hierarchy optimized for quick scanning and data entry
2. **Efficient Workflows**: Minimize clicks for common tasks (student registration, grade entry, viewing assignments)
3. **Consistent Patterns**: Reusable components across all administrative views

## Typography
- **Headings**: Inter or system font stack (`font-sans`)
  - Page titles: `text-3xl font-bold` (Dashboard sections)
  - Section headers: `text-xl font-semibold` (Tables, cards)
  - Subsections: `text-lg font-medium` (Form labels, categories)
- **Body Text**: `text-base` for data tables, forms, and content
- **Small Text**: `text-sm` for metadata, timestamps, helper text
- **Monospace**: `font-mono text-sm` for códigos (Aula 1001, Clase 1201)

## Layout System
**Spacing Primitives**: Use Tailwind units of **2, 4, 6, and 8** consistently
- Component padding: `p-4` or `p-6`
- Section margins: `mb-6` or `mb-8`
- Form field spacing: `space-y-4`
- Card gaps: `gap-4` or `gap-6`

**Grid Structure**:
- Dashboard layout: Sidebar navigation (w-64) + Main content area (flex-1)
- Content max-width: `max-w-7xl mx-auto px-6`
- Data tables: Full-width with responsive scroll
- Form layouts: Single column (`max-w-2xl`) for student registration

## Component Library

### Navigation
**Sidebar Navigation** (Fixed left, full-height):
- Width: `w-64`
- Navigation items with icons (Heroicons)
- Active state: Subtle background indicator
- Sections: Dashboard, Estudiantes, Aulas, Clases, Programas, Notas

### Data Display

**Hierarchical Tables**:
- Clean table design with `border-b` separators
- Header row: `font-semibold text-sm uppercase tracking-wide`
- Row padding: `py-3 px-4`
- Expandable rows for Aulas → Clases → Estudiantes hierarchy
- Pagination controls at bottom

**Info Cards**:
- Statistics cards for dashboard (Total Aulas: 30, Total Estudiantes, etc.)
- Card structure: `rounded-lg border p-6`
- Icon + Number + Label layout
- Grid display: `grid-cols-1 md:grid-cols-3 gap-6`

**Badges**:
- Semester indicators: `rounded-full px-3 py-1 text-xs font-medium`
- Program tags: Rounded badges with distinct visual treatment
- Status indicators for grade completion

### Forms

**Student Registration Form**:
- Label above input pattern: `block text-sm font-medium mb-2`
- Input fields: `rounded-md border px-4 py-2.5 w-full`
- Select dropdowns: Same styling as inputs with chevron icon
- Auto-assignment display: Read-only fields showing assigned Aula/Clase
- Submit button: `px-6 py-2.5 rounded-md font-medium`

**Grade Entry Interface**:
- Inline editable table cells
- Quick-save indicators
- Keyboard navigation support

### Overlays

**Modals**:
- Centered overlay with backdrop blur
- Modal content: `rounded-lg max-w-2xl w-full p-6`
- Header with title and close button
- Form content with action buttons at bottom

**Notifications/Toasts**:
- Top-right positioned: Fixed notifications for actions (Student created, Grade saved)
- Auto-dismiss after 3 seconds

## Specific Views

### Dashboard (Landing Page)
- Statistics overview: 4-column grid with key metrics
- Recent activity feed
- Quick actions: "Registrar Estudiante", "Ingresar Notas"

### Vista Jerárquica: Aulas → Clases → Estudiantes
- Accordion-style expandable list
- Aula row shows: Código (1001), Capacidad, # Estudiantes
- Expand to show Classes within that Aula
- Expand Clase to show Students list with Name, Program, Semester

### Vista: Programas → Semestre → Estudiantes
- Tab navigation for Programs (Ing. Sistemas, Ing. Civil, etc.)
- Within each program: Semester selector/filter
- Student list table with all relevant data

### Formulario de Registro
- Two-column layout on desktop: Student info | Auto-assignment preview
- Fields: Nombre, Programa (dropdown), Semestre (dropdown)
- Real-time preview showing assigned Aula and Clase based on selections
- Clear visual feedback on auto-assignment logic

## Responsive Behavior
- **Desktop** (lg): Sidebar + content area
- **Tablet** (md): Collapsible sidebar with hamburger menu
- **Mobile**: Stack all content, bottom navigation for key sections

## Accessibility
- All form inputs with proper labels and `aria-` attributes
- Keyboard navigation for tables and forms
- Focus indicators on interactive elements
- Color contrast meeting WCAG AA standards

## Images
No hero images required. This is a dashboard/admin interface focused on data and forms. Use icons throughout from **Heroicons** (via CDN) for navigation, actions, and visual hierarchy.