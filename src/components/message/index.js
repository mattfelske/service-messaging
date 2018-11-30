import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import './index.css';

class MESSAGE extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id:         this.props.id,
      text:       this.props.text,
      loaded:     false,
      error:      false,
      flavorText: ''
    };
  }

  handleLoadEvent() {
    console.log('Message loaded');
    this.setState({
      loaded:     true,
      flavorText: ''
    });
  }

  handleErrorEvent() {
    console.error(new Error('An error occured while loading the user image'));
    this.setState({
      error:      true,
      flavorText: 'Error Occured '
    });
  }

  handleDeleteEvent() {
    console.log('handling a delete message event', this.state.id);
    this.props.onMessageDelete(this.state.id);
  }

  handleViewEvent() {
    console.log('handling a view message event', this.state.id);
    this.props.onMessageView(this.state.id);
  }

  render() {
    return (
      <Grid item xs={12}>
        <Paper className="paper" style={{position: 'relative', height: '50px', cursor: 'pointer'}} onClick={() => this.handleViewEvent()}>
          <img
            style={{height: '30px', width: '30px', position: 'absolute', top: '10px', left: '10px'}}
            alt='apples'
            src='img/default_user.png'
            onLoad={this.handleLoadEvent.bind(this)}
            onError={this.handleErrorEvent.bind(this)}
          />

          <Typography component="h3" style={{
            'font-weight':   'bold',
            'text-align':    'left',
            'width':         '50%',
            'position':      'absolute',
            top:             '15px',
            left:            '60px',
            'white-space':   'nowrap',
            'overflow':      'hidden',
            'text-overflow': 'ellipsis'}}
          >
            {this.state.text}
          </Typography>
          <IconButton
            aria-label="Delete"
            style={{position: 'absolute', top: '0px', right: '10px'}}
            onClick={() => this.handleDeleteEvent()}
          >
            <DeleteIcon />
          </IconButton>
          {this.state.flavorText}
        </Paper>
      </Grid>
    );
  }
}

export default MESSAGE;
