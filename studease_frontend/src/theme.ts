import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#006666', light: '#e6f2ee', dark: '#004f4f' },
    secondary: { main: '#5a8c2a', light: '#edf4e5', dark: '#416b20' },
    background: { default: '#f6f8f3', paper: '#ffffff' },
    text: { primary: '#163c37', secondary: '#516b63' },
    divider: '#e0e8df',
    success: { main: '#3b7528' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-.04em', lineHeight: 1.15 },
    h2: { fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-.035em', lineHeight: 1.2 },
    h3: { fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, letterSpacing: '-.025em' },
    h4: { fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-.025em', lineHeight: 1.25 },
    h5: { fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', fontWeight: 650, letterSpacing: '-.02em', lineHeight: 1.35 },
    h6: { fontSize: '1.125rem', fontWeight: 650, lineHeight: 1.4 },
    body1: { fontSize: '1rem', lineHeight: 1.7 },
    body2: { fontSize: '.875rem', lineHeight: 1.65 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { margin: 0, WebkitFontSmoothing: 'antialiased' },
      },
    },
    MuiTypography: { styleOverrides: { root: { overflowWrap: 'anywhere' } } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          minHeight: 44,
          padding: '10px 20px',
          lineHeight: 1.4,
          transition: 'background-color 180ms, box-shadow 180ms',
          '&.Mui-focusVisible': { outline: '3px solid #7fba3c', outlineOffset: 3 },
        },
        sizeSmall: { minHeight: 36, padding: '6px 12px' },
        outlined: { borderColor: '#a7bcb0' },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { flexShrink: 0, minWidth: 44, minHeight: 44, '&.Mui-focusVisible': { outline: '3px solid #008080', outlineOffset: 2 } },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { backgroundImage: 'none', border: '1px solid #e0e8df' } },
    },
    MuiCard: { styleOverrides: { root: { borderRadius: 18, minWidth: 0 } } },
    MuiCardContent: {
      styleOverrides: {
        root: { padding: 24, '&:last-child': { paddingBottom: 24 }, '@media (max-width:599px)': { padding: 20, '&:last-child': { paddingBottom: 20 } } },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { backgroundColor: '#ffffff', minWidth: 0, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#86a797' } },
        notchedOutline: { borderColor: '#c6d4ca' },
        input: { minWidth: 0 },
      },
    },
    MuiFormControl: { styleOverrides: { root: { minWidth: 0 } } },
    MuiInputLabel: { styleOverrides: { root: { maxWidth: 'calc(100% - 32px)' } } },
    MuiFormHelperText: { styleOverrides: { root: { lineHeight: 1.5 } } },
    MuiSelect: {
      styleOverrides: {
        select: { minHeight: '1.5em', '& .MuiBox-root': { minWidth: 0, maxWidth: '100%' } },
      },
    },
    MuiMenuItem: { styleOverrides: { root: { whiteSpace: 'normal', overflowWrap: 'anywhere', minHeight: 44 } } },
    MuiChip: {
      styleOverrides: {
        root: { maxWidth: '100%', height: 'auto', minHeight: 30, borderRadius: 8 },
        label: { whiteSpace: 'normal', overflowWrap: 'anywhere', paddingBlock: 5 },
        icon: { flexShrink: 0 },
        deleteIcon: { flexShrink: 0 },
        colorError: { backgroundColor: '#fce9e7', color: '#a43229' },
        colorSuccess: { backgroundColor: '#edf4e5', color: '#3b7528' },
      },
    },
    MuiTabs: {
      defaultProps: { variant: 'scrollable', scrollButtons: 'auto', allowScrollButtonsMobile: true },
      styleOverrides: {
        root: { backgroundColor: '#ffffff', border: '1px solid #e0e8df', borderRadius: 16, minHeight: 56 },
        indicator: { backgroundColor: '#006666', height: 3, borderRadius: 3 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, minHeight: 64, '&.Mui-selected': { backgroundColor: '#edf5f1' } },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 20, maxHeight: 'calc(100% - 32px)', '@media (max-width:599px)': { margin: 12, width: 'calc(100% - 24px)', maxWidth: 'calc(100% - 24px)' } },
      },
    },
    MuiDialogTitle: { styleOverrides: { root: { padding: '24px', '@media (max-width:599px)': { padding: '20px 16px' } } } },
    MuiDialogContent: { styleOverrides: { root: { padding: 24, '@media (max-width:599px)': { padding: 16 } } } },
    MuiDialogActions: {
      styleOverrides: {
        root: { padding: '16px 24px', gap: 8, flexWrap: 'wrap', '& > :not(:first-of-type)': { marginLeft: 0 }, '@media (max-width:599px)': { padding: 16, '& .MuiButton-root': { flex: '1 1 auto' } } },
      },
    },
    MuiAlert: { styleOverrides: { root: { borderRadius: 12, alignItems: 'flex-start' }, message: { minWidth: 0, overflowWrap: 'anywhere' } } },
    MuiListItem: { styleOverrides: { root: { paddingInline: 0 } } },
    MuiListItemIcon: { styleOverrides: { root: { minWidth: 36, flexShrink: 0, color: '#6a8578' } } },
    MuiListItemText: { styleOverrides: { root: { minWidth: 0, overflowWrap: 'anywhere' } } },
    MuiTableCell: {
      styleOverrides: {
        root: { padding: '16px', borderColor: '#e0e8df' },
        head: { backgroundColor: '#f2f5ee', color: '#516b63', fontWeight: 650, whiteSpace: 'nowrap' },
      },
    },
    MuiStepper: { styleOverrides: { root: { paddingBlock: 16 } } },
  },
});

export default theme;
