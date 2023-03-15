import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';

const TinyText = styled(Typography)({
  // Style of the fonts used under the bar
  fontSize: '0.75rem',
  opacity: 0.60,
  fontWeight: 500,
  letterSpacing: 0.2,
});

/**
 * @return {JSX}
 */
function ProgressBar({position, duration, accessToken}) {
  /**
   *
   * @param {*} value
   * @return {object}
   */
  const formatDuration = (value) => {
    // Make sure it looks like minutes:seconds for the time
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  };

  return (
    <Box
      // sx={{width: 300}}
      sx={{width: '40vw'}}
    >
      <Slider
        aria-label="song-slider"
        size="small"
        value={position}
        min={0}
        step={1}
        max={duration}
        color='secondary'
        onChange={(_, value) => fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${value*1000}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        })}
        sx={{
          'height': 3,
          '& .MuiSlider-rail': {
            opacity: 0.28,
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: -2,
        }}
      >
        <TinyText>{formatDuration(position)}</TinyText>
        <TinyText>-{formatDuration(duration - position)}</TinyText>
      </Box>
    </Box>
  );
}

export default ProgressBar;
