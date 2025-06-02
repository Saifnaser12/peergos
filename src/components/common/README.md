# Common Components

This directory contains shared components that are used throughout the application.

## Grid Component

The `Grid` component is a wrapper around Material-UI's Grid component that provides proper TypeScript support while maintaining all the functionality of the original component.

### Usage

```tsx
import { Grid } from '../common/Grid';

// Basic container with items
<Grid container spacing={2}>
  <Grid item xs={12} sm={6}>
    <div>Content</div>
  </Grid>
</Grid>

// Responsive grid with custom styling
<Grid
  container
  spacing={2}
  sx={{
    padding: 2,
    backgroundColor: 'background.paper'
  }}
>
  <Grid item xs={12} sm={6} md={4}>
    <div>Content 1</div>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <div>Content 2</div>
  </Grid>
</Grid>
```

### Props

The Grid component accepts all props from Material-UI's Grid component with proper TypeScript support for:

- `container`: boolean - Makes the grid a container
- `item`: boolean - Makes the grid an item
- `spacing`: number - Sets the spacing between grid items
- Responsive breakpoints:
  - `xs`: number | 'auto' | boolean - Extra small devices (0px+)
  - `sm`: number | 'auto' | boolean - Small devices (600px+)
  - `md`: number | 'auto' | boolean - Medium devices (900px+)
  - `lg`: number | 'auto' | boolean - Large devices (1200px+)
  - `xl`: number | 'auto' | boolean - Extra large devices (1536px+)
- `sx`: object - The system prop for applying custom styles

### Examples

1. Basic Grid Layout:
```tsx
<Grid container spacing={2}>
  <Grid item xs={12} sm={6}>
    <Card>
      <CardContent>Item 1</CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6}>
    <Card>
      <CardContent>Item 2</CardContent>
    </Card>
  </Grid>
</Grid>
```

2. Complex Responsive Layout:
```tsx
<Grid container spacing={3}>
  <Grid item xs={12}>
    <Header />
  </Grid>
  <Grid item xs={12} md={8}>
    <MainContent />
  </Grid>
  <Grid item xs={12} md={4}>
    <Sidebar />
  </Grid>
</Grid>
```

3. Grid with Custom Styling:
```tsx
<Grid
  container
  spacing={2}
  sx={{
    padding: { xs: 1, sm: 2, md: 3 },
    backgroundColor: 'background.paper',
    borderRadius: 1
  }}
>
  <Grid
    item
    xs={12}
    sm={6}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Content />
  </Grid>
</Grid>
```

### Best Practices

1. Always use the Grid component for layout purposes
2. Use the responsive breakpoints to create mobile-friendly layouts
3. Avoid deeply nested Grid containers
4. Use the `spacing` prop for consistent gaps between items
5. Use the `sx` prop for custom styling instead of inline styles

### Testing

The Grid component comes with comprehensive unit tests that verify:
- Proper rendering of children
- Application of container and item props
- Responsive breakpoint classes
- Custom styling through the sx prop

Run the tests using:
```bash
npm test src/components/common/__tests__/Grid.test.tsx
``` 