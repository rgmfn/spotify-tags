import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const [reverse, setReverse] = React.useState(false);
  const [primary, setPrimary] = React.useState('Song Name');
  const [secondary, setSecondary] = React.useState('Song Name');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const printOut = () => {
    console.log(reverse, primary, secondary);
  }
  const handleChangeReverse = (event) => {
    setReverse(event.target.value);
  };
  const handleChangePrimary = (event) => {
    setPrimary(event.target.value);
  };
  const handleChangeSecondary = (event) => {
    setSecondary(event.target.value);
  };

  return (
    <div>
      <Button onClick={handleOpen}>Sort</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Sort Options
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Sort Type</InputLabel>
            <Select
              value={reverse}
              label="sort-type"
              onChange={handleChangeReverse}
            >
              <MenuItem value={false}>Normal</MenuItem>
              <MenuItem value={true}>Reverse</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Primary</InputLabel>
            <Select
              value={primary}
              label="primary"
              onChange={handleChangePrimary}
            >
              <MenuItem value={'trackName'}>Song Name</MenuItem>
              <MenuItem value={'artistName'}>Artist Name</MenuItem>
              <MenuItem value={'albumName'}>Album Name</MenuItem>
              <MenuItem value={'releaseDate'}>Release Date</MenuItem>
              <MenuItem value={'songLength'}>Song Length</MenuItem>
              <MenuItem value={'popularity'}>Popularity</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Secondary</InputLabel>
            <Select
              value={secondary}
              label="secondary"
              onChange={handleChangeSecondary}
            >
              <MenuItem value={'trackName'}>Song Name</MenuItem>
              <MenuItem value={'artistName'}>Artist Name</MenuItem>
              <MenuItem value={'albumName'}>Album Name</MenuItem>
              <MenuItem value={'releaseDate'}>Release Date</MenuItem>
              <MenuItem value={'songLength'}>Song Length</MenuItem>
              <MenuItem value={'popularity'}>Popularity</MenuItem>
            </Select>
          </FormControl>
          <Button onClick={printOut}>Sort</Button>
        </Box>
      </Modal>
    </div>
  );
}
