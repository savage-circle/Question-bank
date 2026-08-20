import Box from '@mui/material/Box';
import MenuBookSharpIcon from '@mui/icons-material/MenuBookSharp';

const Header = () => {
  return (
    <Box className="flex items-center gap-4 px-6 py-3">
      <Box className=" bg-(--color-primary) p-3 pt-2 rounded-2xl">
        <MenuBookSharpIcon className="text-white" />
      </Box>
      <p
        className="text-(--color-primary) text-2xl font-bold"
        data-testid="header"
      >
        Question Bank
      </p>
    </Box>
  );
};

export default Header;
