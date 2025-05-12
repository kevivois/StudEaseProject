import { Typography, Box } from '@mui/material';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box 
      component="footer" 
      className="w-full py-4 px-4 mt-auto bg-gray-50 border-t border-gray-200"
    >
      <Typography 
        variant="body2" 
        align="center" 
        color="text.secondary"
        className="text-sm"
      >
        © {currentYear}{' '}
        <a 
          href="https://jevs.ch" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-dark transition-colors"
        >
          JEVS.ch
        </a>
        {' '}- Tous droits réservés
      </Typography>
    </Box>
  );
}