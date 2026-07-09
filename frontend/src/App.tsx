import { Box } from '@mui/system';

function App() {
  return (
    <div>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          border: '1px solid #BDBDBD',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#fff',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            height: 70,
            borderBottom: '1px solid #BDBDBD',
          }}
        ></Box>

        {/* Toolbar */}
        <Box
          sx={{
            height: 70,
            borderBottom: '1px solid #BDBDBD',
          }}
        >
          {' '}
        </Box>

        {/* Body */}
        <Box
          sx={{
            flex: 1,
            px: 3,
            py: 4,
            display: 'flex',
            gap: 5,
          }}
        >
          {/* Sidebar */}
          <Box
            sx={{
              width: 280,
              border: '1px solid #BDBDBD',
            }}
          />

          {/* Main Content */}
          <Box
            sx={{
              flex: 1,
              border: '1px solid #BDBDBD',
            }}
          />
        </Box>

        {/* Footer */}
        <Box
          sx={{
            height: 80,
            borderTop: '1px solid #BDBDBD',
          }}
        />
      </Box>
    </div>
  );
}

export default App;
