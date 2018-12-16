import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js'; // <--- add this line
import { Button } from 'react-bootstrap';
import { AddRecipe } from './components/addrecipe';

class App extends Component {
  constructor() {
    super();
    this.state = {
      ingredients: [],
      name: '',
      items: [],
      showAdd: false,
      toggleOn: false
    }
    this.showAddModal = this.showAddModal.bind(this);
    this.addRecipe = this.addRecipe.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
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

  // handleSubmit(e) {
  //   e.preventDefault();
  //   const itemsRef = firebase.database().ref('items');
  //   const regExp = /\s*,\s*/;
  //   var newName = this.state.name;
  //   var newIngredients = this.state.ingredients.split(regExp);
  //   const item = {
  //     ingredients: newIngredients,
  //     name: newName
      
  //   }
  //   itemsRef.push(item);
  //   this.setState({
  //     ingredients: '',
  //     name: ''
  //   });
  // }

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
        {/* <section className='add-item'>
                <form onSubmit={this.handleSubmit}>
                  <input type="text" name="name" placeholder="Name?" onChange={this.handleChange} value={this.state.name} />
                  <input type="text" name="ingredients" placeholder="Ingredients?" onChange={this.handleChange} value={this.state.ingredients} />
                  <button type = "submit">Add Item</button>
                </form>
          </section> */}
          <section className='display-item'>
            <div className="wrapper">
              <ul>
              
                  {this.state.items.map((item) => {
                    console.log(item.name);
                    console.log(item, "hela item");
                
                    return (
                      <li key={item.id}>
                        <h3 onClick = {this.toggle} className="title"> {item.name}</h3>
                        <div>
                          {this.state.toggleOn && (
                             item.ingredients.map((ingredient) => {
                             return <p className="ingredients">{ingredient}</p>
                            })
                          )}
                        </div>
                      </li>
                    )
                  })}
 
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