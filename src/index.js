import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Material-UI Components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';


import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import MESSAGE from './components/message';
import MODAL_ADDMESSAGE from './components/modals/add-message';
import MODAL_VIEWMESSAGE from './components/modals/view-message';

import $ from 'jquery';

// UTILITY FUNCTIONS
import sendXHR from './utilities/sendXHR';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:       true,
      error:         false,
      open:          true,
      messages:      [],
      viewMessage:   false,
      viewedMessage: null
    };
    console.log('Getting current messages');
    getMessages((err, result) => {
      if (err) {
        console.error(err);
        return this.setState({ error: true });
      }
      console.log('success', result);

      var newArray = this.state.messages.slice();
      result.map((elem) => newArray.push(elem));
      this.setState({
        messages: newArray,
        loading:  false
      });
    });
  }

  handleAddUser() {
    this.state.open = true;
  }

  handleDeleteMessage(id) {
    if (!id) return console.error('Unable to delete message, missing messageID');
    sendXHR('DELETE', '/v1/message', {qs: {id}}, (err, statusCode, result) => {
      if (err) return console.error(err);
      console.log(statusCode, result);
      if (statusCode === 200) {
        var newArray = this.state.messages.slice();
        this.setState({
          messages: newArray.filter((elem) => elem._id !== id)
        });
      }
    });
  }

  handleViewMessage(id) {
    if (!id) return console.error('Unable to view message, missing messageID');
    sendXHR('GET', '/v1/message', {qs: {id}}, (err, statusCode, result) => {
      if (err) return console.error(err);
      console.log(statusCode, result);
      if (!result || result.length !== 1) return console.error('Invalid response from server, expected 1 record');

      this.setState({ viewMessage: true, viewedMessage: result[0]});
    });
  }

  handleClose(i) {
    console.error('close', i);
    if (i) {
      var newArray = this.state.messages.slice();
      newArray.push(i);
      this.setState({messages: newArray });
    }
  }

  handleCloseViewMessage() {
    this.setState({ viewMessage: false, viewedMessage: null});
  }

  render() {
    var messages = this.state.messages.map((msg, index) => {
      return (
        <MESSAGE
          key={msg._id}
          text={msg.text}
          id={msg._id}
          onMessageDelete={(id) => this.handleDeleteMessage(id)}
          onMessageView={(id) => this.handleViewMessage(id)}
        />
      );
    });

    return (
      <div>
        <AppBar position="sticky" color="primary">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Message Center
            </Typography>
            <div style={{position: 'absolute', right: '10px'}}>
              <MODAL_ADDMESSAGE onClose={(i) => this.handleClose(i)}></MODAL_ADDMESSAGE>
            </div>

          </Toolbar>
        </AppBar>
        <Grid container className="root" spacing={24}>
          {messages}
        </Grid>

        <MODAL_VIEWMESSAGE
          msg={this.state.viewedMessage}
          open={this.state.viewMessage}
          onClose={() => this.handleCloseViewMessage()}
        ></MODAL_VIEWMESSAGE>

      </div>
    );
  }
}

/**
 * Retrieves an array of GIF objects based on function parameters, and return the array
 * @param {Function} callback - The callback function (err, result)
 */
var getMessages = (callback) => {

  console.log('GET', '/v1/message');
  var xhr = $.get('/v1/message');
  xhr.done((data) => callback(null, data));
  xhr.fail((err) => callback(err));
};


ReactDOM.render(
  <App />,
  document.getElementById('root')
);
