import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const importCSV = () => {

  const [openTerms, setOpen] = React.useState(false);

  const openTermsDialog = () => {
    setOpen(true);
  };

  const handleCloseTerms = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={openTerms}
      onClose={handleCloseTerms}
      aria-labelledby="terms-dialog-title"
      aria-describedby="terms-dialog-description"
    >
      <DialogTitle id="terms-dialog-title">{"Terms of Use"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="terms-dialog-description">
          Terms go here
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseTerms} color="primary" autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  )
}



export default importCSV;