import React, { Component } from "react";
import io from "socket.io-client";

class IndexPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timers: []
    };
  }

  componentDidMount() {
    const socket = io.connect();

    socket.on("timers:new", ({ timer }) => {
      return this.setState({ timers: [...this.state.timers, timer] });
    });
  }

  render() {
    return (
      <div>
        {this.state.timers.map(timer => {
          return <p>{timer.time}</p>;
        })}
      </div>
    );
  }
}

export default IndexPage;
