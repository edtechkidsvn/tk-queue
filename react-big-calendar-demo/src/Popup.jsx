import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core';

export default class Popup extends Component {
  constructor() {
    super();
    this.state = {
      note: ""
    };
  }

  render() {
    return (
      <Dialog
          open={this.props.open}
          onClose={this.props.handleClose}
          aria-labelledby="form-dialog-title"
        >
          {/* <DialogTitle id="form-dialog-title">Subscribe</DialogTitle> */}
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Note"
              type="email"
              fullWidth
              onChange={(e) => {
                this.setState({ note: e.target.value });
              }}
            />
            
          </DialogContent>
          <DialogActions>
            <Grid justify="space-between" container={true}>
              <Button
                onClick={this.props.handleDelete}
                color="secondary"
              >
                Delete
              </Button>
              <Button
                onClick={(() => this.props.handleEdit({
                  note: this.state.note,
                  
                }))}
                color="primary"
              >
                Edit
              </Button>
            </Grid>
          </DialogActions>
        </Dialog>
    );
  }
}