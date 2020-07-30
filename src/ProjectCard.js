import React, { Component } from "react";

export default class ProjectCard extends React.Component {
  render() {
    return (
      <div className="project-card-container">
        <div className="project-card" style={{ background: "#9067c6" }}>
          <div className="card-top">{this.props.title}</div>
          <a
            href={this.props.projectURL}
            target="_blank"
            className="card-center"
            style={{ backgroundImage: `url(${this.props.image})` }}
          ></a>
          <div className="card-bottom">
            <div className="clamp">{this.props.description}</div>
          </div>
        </div>
      </div>
    );
  }
}

function randomColor() {
  return `hsl(${Math.random() * 180 + 180}deg, 50%, 60%)`;
}
