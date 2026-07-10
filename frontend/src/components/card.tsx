import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Question } from '../types/question';

const difficultyStyles: Record<string, { bgcolor: string; color: string }> = {
    EASY: { bgcolor: '#ecfdf5', color: '#059669' },
    MEDIUM: { bgcolor: '#fff7ed', color: '#c2410c' },
    HARD: { bgcolor: '#fef2f2', color: '#dc2626' },
};

const Card = ({question}: {question: Question}) => {
    const difficultyStyle = difficultyStyles[question.levelName] ?? { bgcolor: '#f1f5f9', color: '#475569' };

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
            <Typography sx={{ fontSize: 17, lineHeight: 1.7, color: '#111827', fontWeight: 400 }}>
                {question.description}
            </Typography>
            <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                <Box
                    component="span"
                    sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 999,
                        fontSize: 14,
                        fontWeight: 500,
                        ...difficultyStyle,
                    }}
                >
                    {question.levelName}
                </Box>
            </Box>
        </Box>
    )
}

export default Card;