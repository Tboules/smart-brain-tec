import React, { Component } from "react";
import "./App.css";
import Navigation from "./Components/Navigation/Navigation";
import Logo from "./Components/Logo/Logo";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import Rank from "./Components/Rank/Rank";
import Particles from "react-particles-js";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import SignIn from "./Components/SignIn/SignIn";
import Register from "./Components/Register/Register";

const particlesOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 650,
      },
    },
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      faceBox: [],
      route: "signin",
      user: {
        id: "",
        name: "",
        email: "",
        password: "",
        entries: 0,
        joined: "",
      },
    };
    this.imageRef = null;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  calculateFaceLocation = (data) => {
    const info = data.outputs[0].data.regions;
    const boxes = info.map((box) => box.region_info.bounding_box);
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    const faceBoxes = boxes.map((faceBox) => {
      return {
        leftCol: faceBox.left_col * width,
        topRow: faceBox.top_row * height,
        rightCol: width - faceBox.right_col * width,
        bottomRow: height - faceBox.bottom_row * height,
      };
    });
    return faceBoxes;
  };

  displayFaceBox = (faceBox) => {
    this.setState({ faceBox: faceBox });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch("https://thawing-retreat-11147.herokuapp.com/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          fetch("https://thawing-retreat-11147.herokuapp.com/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    this.setState({ route: route });
    this.setState({ imageUrl: "" });
  };

  isSignedIn = () => {
    return this.state.route === "home" ? true : false;
  };

  render() {
    const { imageUrl, faceBox, route } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={this.isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onButtonSubmit={this.onButtonSubmit}
              onInputChange={this.onInputChange}
            />
            <FaceRecognition faceBox={faceBox} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
