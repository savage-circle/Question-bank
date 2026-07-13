import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Question } from "../types";

const difficultyStyles: Record<
  string,
  { bgcolor: string; color: string; borderColor: string }
> = {
  EASY: { color: '#047857', bgcolor: '#ECFDF5', borderColor: '#D1FAE5' },
  MEDIUM: { color: '#C2410C', bgcolor: '#FFF7ED', borderColor: '#FFEDD5' },
  HARD: { color: '#BE123C', bgcolor: '#FFF1F2', borderColor: '#FFE4E6' },
};

const Card = ({ question }: { question: Question }) => {
  const difficultyStyle = difficultyStyles[question.levelName] ?? {
    bgcolor: '#f1f5f9',
    color: '#475569',
    borderColor: '#e2e8f0',
  };

  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: 4,
        border: '1px solid #f3f4f6',
        boxShadow: 1,
        p: 3,
        mb: 2,
        fontFamily: 'sans-serif',
      }}
    >
      <Typography
        sx={{
          fontFamily: 'Inter',
          fontWeight: 500,
          fontSize: '15px',
          lineHeight: '24px',
          letterSpacing: '0%',
          verticalAlign: 'middle',
          color: '#1E293B',
        }}
      >
        {question.description}
      </Typography>
      <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
        <Box
          component="span"
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            border: '1px solid',
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: '18px',
            letterSpacing: '0.19px',
            verticalAlign: 'middle',
            ...difficultyStyle,
          }}
        >
          {question.levelName}
        </Box>
      </Box>
    </Box>
  );
};

export default Card;
