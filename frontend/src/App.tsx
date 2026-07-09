import { Box } from '@mui/system';

function App() {
  return (
    <div>
      <Box
        data-testid="app-layout"
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
          data-testid="header"
          sx={{
            height: 70,
            borderBottom: '1px solid #BDBDBD',
          }}
        />

        {/* Toolbar */}
        <Box
          data-testid="toolbar"
          sx={{
            height: 70,
            borderBottom: '1px solid #BDBDBD',
          }}
        />

        {/* Body */}
        <Box
          data-testid="body"
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
            data-testid="sidebar"
            sx={{
              width: 280,
              border: '1px solid #BDBDBD',
            }}
          />

          {/* Main Content */}
          <Box
            data-testid="main-content"
            sx={{
              flex: 1,
              border: '1px solid #BDBDBD',
            }}
          />
        </Box>

        {/* Footer */}
        <Box
          data-testid="footer"
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
