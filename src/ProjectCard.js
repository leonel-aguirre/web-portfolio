import React, { Component } from "react";

export default class ProjectCard extends React.Component {
  render() {
    return (
      <div class="project-card" style={{ background: randomHex() }}>
        <div class="card-top">{this.props.title}</div>
        <div class="card-center">
          <img src={this.props.image}></img>
        </div>
        <div class="card-bottom">{this.props.description}</div>
      </div>
    );
  }
}

function randomHex() {
  let letters = "0123456789ABCDEF";
  let newColor = "#";

  for (let i = 0; i < 6; i++)
    newColor += letters[Math.floor(Math.random() * 16)];

  return newColor;
}
