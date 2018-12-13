import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js'; // <--- add this line
import { PanelGroup, Panel, Button, ButtonToolbar, ListGroup, ListGroupItem } from 'react-bootstrap';
import { AddRecipe } from './components/addrecipe';

class App extends Component {
  constructor() {
    super();
    this.state = {
      ingredients: '',
      name: '',
      items: [],
      showAdd: false,
      toggleOn: false
    }
    this.showAddModal = this.showAddModal.bind(this);
    this.addRecipe = this.addRecipe.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  showAddModal() {//show the new recipe modal
    this.setState({ showAdd: !this.state.showAdd });
  }

  addRecipe(item) {//create a new recipe
    let items = this.state.items;
    items.push(item);
    this.setState({ items: items });
    this.showAddModal();
  }

  toggle = () => {
    this.setState({
      toggleOn: !this.state.toggleOn
    })
  }


  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      ingredients: this.state.ingredients,
      name: this.state.title
    }
    itemsRef.push(item);
    this.setState({
      ingredients: '',
      name: ''
    });
  }

  componentDidMount() {
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          name: items[item].name,
          ingredients: items[item].ingredients
        });
      }
      this.setState({
        items: newState
      });
    });
  }

  render() {
    return (
      <div className='app jumbotron'>
        <header>
          <div className='wrapper'>
            <h1>RECIPE BOX</h1>
          </div>
        </header>
        <div className='container'>

          <section className='display-item'>
            <div className="wrapper">
              <ul>
                <PanelGroup accordion id="recipes">
                  {this.state.items.map((item, index) => {
                    console.log(item.name);
                    console.log(item, "hela item");
                    console.log(index, "iteration index")

                    return (
                      <li key={item.id}>
                        <h3 onClick = {this.toggle} className="title"> {item.name}</h3>
                        <div>
                          {this.state.toggleOn && (
                            <p className = "ingredients">{item.ingredients}</p>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </PanelGroup>
              </ul>
              <Button onClick={this.showAddModal}>ADD RECIPE</Button>
              <AddRecipe onShow={this.state.showAdd} onAdd={this.addRecipe} onAddModal={this.showAddModal} />
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default App;