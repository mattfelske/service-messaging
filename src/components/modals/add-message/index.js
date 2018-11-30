import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';

import $ from 'jquery';

function getModalStyle() {
  return {
    top:       '50%',
    left:      '50%',
    transform: `translate(-${50}%, -${50}%)`
  };
}

const styles = (theme) => ({
  paper: {
    position:        'absolute',
    width:           theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow:       theme.shadows[5],
    padding:         theme.spacing.unit * 4
  },
  textField: {
    marginLeft:  theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  button: {
    margin:   theme.spacing.unit,
    position: 'absolute',
    bottom:   '10px',
    right:    '10px'
  }
});

class SimpleModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open:      false,
      multiline: ''
    };
  }


  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, multiline: '' });
  };

  addMessage = () => {
    console.log('POST', '/v1/message', {text: this.state.multiline});
    var xhr = $.post('/v1/message', {text: this.state.multiline});
    xhr.done((data) => {
      console.log(data);
      this.props.onClose(data);
      this.setState({open: false});
    });
    xhr.fail((err) => {
      console.error(err);
      // TODO set the state in an error state and display proper changes
    });
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button
          mini
          variant="fab"
          color="secondary"
          aria-label="Add"
          onClick={this.handleOpen}
        >
          <AddIcon />
        </Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="h6" id="modal-title">
              Enter the message you would like to post.
            </Typography>
            <TextField
              id="outlined-multiline-flexible"
              label="Enter Message"
              multiline
              rowsMax="4"
              value={this.state.multiline}
              onChange={this.handleChange('multiline')}
              className={classes.textField}
              margin="normal"
              variant="outlined"
            />
            <Button
              id="mybutton"
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => this.addMessage()}
            >
              Add Message
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}


SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
const SimpleModalWrapped = withStyles(styles)(SimpleModal);

export default SimpleModalWrapped;
