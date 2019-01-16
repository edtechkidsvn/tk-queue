import React, { Component } from 'react';
import './App.css';
import './react-big-calendar.css';

import BigCalendar from 'react-big-calendar'
import moment from 'moment';
import Popup from './Popup';
import _ from 'lodash';

const localizer = BigCalendar.momentLocalizer(moment);

class App extends Component {
  constructor() {
    super();
    this.state = {
      events: [],
      dialogOpen: false,
      handleEdit: null,
      selectedEvent: null,
    };
    this.onSelectSlot = this.onSelectSlot.bind(this);
    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  onSelectSlot(e) {
    const start = moment(e.start)
                    .set("hours", 7)
                    .set("minutes", 15)
                    .toDate();
    const end = moment(start)
                  .add("hours", 3)
                  .toDate();
    const newEvent = {
      start,
      end,
      title: "",
    };
    this.setState({
      events: [
        ...this.state.events,
        newEvent,
      ],
    });
  }

  onSelectEvent(e) {
    const handleEdit = ((modifier) => {
      this.setState({ dialogOpen: false });
      e.title = modifier.note;
    });
    
    const handleDelete = () => {
      this.setState({ dialogOpen: false });
      const newEvents = _.filter(this.state.events, (ei) => ei !== e);
      this.setState({
        events: newEvents
      });
    };

    this.setState({
      dialogOpen: true,
      selectedEvent: e,
      handleEdit: handleEdit,
      handleDelete: handleDelete,
    });
  }

  handleClose() {
    this.setState({
      dialogOpen: false,
    })
  }

  render() {
    return (
      <div className="App" id="appRoot">
        <BigCalendar
          selectable={true}
          onSelectSlot={this.onSelectSlot}
          onSelectEvent={this.onSelectEvent}
          localizer={localizer}
          events={this.state.events}
          startAccessor="start"
          endAccessor="end"
        />
        <Popup
          open={this.state.dialogOpen}
          selectedEvent={this.state.selectedEvent}
          handleClose={this.handleClose}
          handleEdit={this.state.handleEdit}
          handleDelete={this.state.handleDelete}
        />
      </div>
    );
  }
}

export default App;
