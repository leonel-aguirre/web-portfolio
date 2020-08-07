import React, { Component } from "react";

export default class ProjectCard extends React.Component {
  state = {
    buttonText: "mostrar descripción",
    color: randomColor(),
  };

  toggleDescription = () => {
    if (this.state.buttonText == "mostrar descripción") {
      this.setState({ buttonText: "ocultar descripción" });
    } else {
      this.setState({ buttonText: "mostrar descripción" });
    }
  };

  render() {
    const { buttonText, color } = this.state;

    return (
      <div className="project-card-container" style={{ background: color }}>
        <div className="card-title">{this.props.title}</div>
        <div
          className="card-image"
          style={{ backgroundImage: `url(${this.props.image})` }}
        ></div>
        <div className="card-description">
          <button
            className="description-toggler"
            onClick={this.toggleDescription}
          >
            {buttonText}
          </button>
          <div className="description">
            <p>{this.props.description}</p>
          </div>
        </div>
        <div className="card-bottom">
          <span className="card-date">{this.props.projectDate}</span>
          <a href={this.props.projectURL} target="_blank">
            <i className="fas fa-globe-americas"></i>
          </a>
          <a href={this.props.githubURL} target="_blank">
            <i className="fab fa-github"></i>
          </a>
        </div>
      </div>
    );
  }
}

function randomColor() {
  return `hsl(${Math.random() * 180 + 180}deg, 50%, 60%)`;
}
