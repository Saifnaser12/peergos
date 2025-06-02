import * as React from 'react';
import { Grid as MuiGrid } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';

/**
 * GridProps interface for the Grid component.
 * This interface provides proper typing for responsive breakpoints and grid behavior props.
 */
export interface GridProps {
  children?: React.ReactNode;
  container?: boolean;
  spacing?: number;
  size?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  sx?: SxProps<Theme>;
}

/**
 * A wrapper component around Material-UI's Grid that provides proper TypeScript support.
 * This component maintains all the functionality of MUI's Grid while fixing type-related issues.
 *
 * @component
 * @param {GridProps} props - The props for the Grid component
 * @returns {React.ReactElement} A Grid component with proper TypeScript support
 *
 * @example
 * // Grid container with responsive items
 * <Grid container spacing={2}>
 *   <Grid size={{ xs: 12, sm: 6 }}>
 *     <div>Content</div>
 *   </Grid>
 * </Grid>
 */
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ children, container, spacing, size, sx, ...props }, ref) => {
    // Convert the new size prop to the appropriate grid props
    const gridProps = React.useMemo(() => {
      if (!size) return {};
      if (typeof size === 'number') return { xs: size };
      return Object.entries(size).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value,
      }), {});
    }, [size]);

    return (
      <MuiGrid
        ref={ref}
        container={container}
        spacing={spacing}
        {...gridProps}
        sx={sx}
        {...props}
      >
        {children}
      </MuiGrid>
    );
  }
); 