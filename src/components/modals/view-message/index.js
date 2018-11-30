import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';

import $ from 'jquery';
import moment from 'moment';

function getModalStyle() {
  return {
    top:       '50%',
    left:      '50%',
    transform: `translate(-${50}%, -${50}%)`
  };
}

const styles = (theme) => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
    position: 'absolute',
    bottom: '10px',
    right:  '10px'
  }
});

class SimpleModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open,
      msg:  this.props.msg
    };
  }

  render() {
    const { classes } = this.props;
    const id = (this.state.msg) ? this.state.msg._id : null;
    console.log('Viewing message');
    
    var created = '';
    var updated = '';
    var text = '';
    var isPalindrome = 'NO';
    if (this.props.msg) {
      if (this.props.msg.isPalindrome) isPalindrome = 'YES';
      text = this.props.msg.text;
      created = moment(this.props.msg.dateCreated).format('YYYY-MM-DD');
      updated = moment(this.props.msg.lastUpdated).format('YYYY-MM-DD');
    }

    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.open}
        onClose={() => { this.props.onClose(); }}
      >
        <div style={getModalStyle()} className={classes.paper}>
          <Typography variant="h6" id="modal-title">
            Message Viewer {this.props.open}
          </Typography>
          <Typography>
            <b>Date Created:</b> {created}
          </Typography>
          <Typography>
            <b>Last Updated:</b> {updated}
          </Typography>
          <Typography>
            <b>Palindrome</b> {isPalindrome}
          </Typography>
          <br/>
          <Typography variant="p">
            {text}
          </Typography>
        </div>
      </Modal>
    );
  }
}


SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
const SimpleModalWrapped = withStyles(styles)(SimpleModal);

export default SimpleModalWrapped;
