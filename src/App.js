import React, { Component } from 'react'
import TodoCard from './components/TodoCard';

export default class App extends Component {
  state = {
    // hashtags: [],   Not required
    activeTodos: [],
    completedTodos: [],
    filteredTodos: [],
    filters: [],
  }

  componentDidMount() {
    // get list from localStorage
    let activeTodoList = localStorage.getItem('ActiveTodoItems') ? localStorage.getItem('ActiveTodoItems') : "[]";
    let completedTodoList = localStorage.getItem('CompletedTodoItems') ? localStorage.getItem('CompletedTodoItems') : "[]";
    let filters = localStorage.getItem('filters') ? localStorage.getItem('filters') : "[]";
    let filteredList = localStorage.getItem('filteredTodoItems') ? localStorage.getItem('filteredTodoItems') : "[]";

    this.setState({  
      activeTodos: JSON.parse(activeTodoList),
      completedTodos: JSON.parse(completedTodoList),
      filters: JSON.parse(filters),
      filteredTodos: JSON.parse(filteredList)
    })
  }

  handleOnSubmit = (e) => {
    // on enter
    if(e.keyCode === 13) {
      // let hashes = this.getHashtags(e.target.value) ? this.getHashtags(e.target.value) : [];
      
      // let uniqueHashes = [...this.state.hashtags, ...hashes].filter((value, index, self) => {
      //   return self.indexOf(value) === index
      // })

      this.setState({  
        // hashtags: uniqueHashes,
        activeTodos: [e.target.value.trim(), ...this.state.activeTodos ]
       },
       () => {
        localStorage.setItem("ActiveTodoItems", JSON.stringify(this.state.activeTodos))
       }
      )
    }
  }

  handleOnClickTodo = (e) => {
    // only for the todo Item not for hashtags
    if(e.target.tagName === 'P') {
      let currTodo = e.target.innerText.replaceAll(' ', '');

      // newActiveList will contain all tasks except the clicked one
      let newActiveList = this.state.activeTodos.filter((todo, idx) => {
        let t = todo.replaceAll(' ', '');
        return (t !== currTodo);
      })

      // if only clicked task is not already completed
      if(!this.state.completedTodos.includes(e.target.innerText)) {
        this.setState({ 
          activeTodos: newActiveList,
          completedTodos: [e.target.innerText, ...this.state.completedTodos] 
        }, 
        () => {
          localStorage.setItem("CompletedTodoItems", JSON.stringify(this.state.completedTodos))
          localStorage.setItem("ActiveTodoItems", JSON.stringify(this.state.activeTodos))
        })
      }
    }
    
  }

  filterList = (e) => {
    // console.log('filterList: ', e.target.innerHTML);
    let temp = [...this.state.filters];

    // check if the filter is already selected or not
    (!temp.includes(e.target.innerHTML)) &&
    this.setState({ filters: [...temp, e.target.innerHTML] },
      () => {
        localStorage.setItem("filters", JSON.stringify(this.state.filters))
        let filteredList = [];

        // this.state.activeTodos.forEach((todo) => {
        //   let containAllFilters = this.state.filters.every((filter) => todo.includes(filter))
        //   if(containAllFilters) {
        //     filteredList.push(todo)
        //   }
        // })
        // this.state.completedTodos.forEach((todo) => {
        //   let containAllFilters = this.state.filters.every((filter) => todo.includes(filter))
        //   if(containAllFilters) {
        //     filteredList.push(todo)
        //   }
        // })
        this.state.activeTodos.forEach((todo) => {
          let hashes = this.getHashtags(todo) ? this.getHashtags(todo) : [];
          let containAllFilters = this.state.filters.every((filter) => hashes.includes(filter))
          if(containAllFilters) {
            filteredList.push(todo)
          }
        })
        this.state.completedTodos.forEach((todo) => {
          let hashes = this.getHashtags(todo) ? this.getHashtags(todo) : [];
          let containAllFilters = this.state.filters.every((filter) => hashes.includes(filter))
          if(containAllFilters) {
            filteredList.push(todo)
          }
        })

        // to avoid duplicates
        // let uniqueFilteredList = filteredList.filter((value, index, self) => {
        //   return self.indexOf(value) === index
        // })
        this.setState({ filteredTodos: filteredList },
          () => {
            localStorage.setItem("filteredTodoItems", JSON.stringify(this.state.filteredTodos))
          }
        )
      })
  }

  removeFilters = () => {
    this.setState({ filters: [] },
      () => {
        localStorage.removeItem("filters")
      }
    )
  }

  deleteTodos = () => {
    this.setState({
      activeTodos: [],
      completedTodos: [],
      filteredTodos: [],
      hashtags: [],
      filters: [],
    },
    () => {
      localStorage.clear()
    })
  }

  getHashtags = (inp) => {
    return inp.match(/#[a-zA-Z0-9]+/gi);
  }

  render() {
    // console.log('activeTodos: ', this.state.activeTodos);
    // console.log('completedTodos: ', this.state.completedTodos);
    // console.log('filteredTodos: ', this.state.filteredTodos);
    // console.log('filters: ', this.state.filters);
    const { filters, filteredTodos, activeTodos, completedTodos } = this.state;
    return (
      <>
      <div className='container'>
        <input type="text" onKeyUp={this.handleOnSubmit}/>
        <button onClick={this.deleteTodos}>Reset</button>
        <div>
          <h4>Filters: 
            {filters.length > 0 && filters.map((filter, idx) => (<span key={idx} className='filters'>{filter}</span>))}
          </h4>
          <button 
            onClick={this.removeFilters}
            disabled={!filters.length}  
          >
            Clear filters
          </button>
        </div>

        <div className='taskList'>
          {filters.length > 0 ? 

          filteredTodos.map((todo, idx) => (
            <TodoCard 
              value={todo} 
              key={idx} 
              filterList={this.filterList}
              getHashtags={this.getHashtags}
              handleOnClickTodo={this.handleOnClickTodo}
              completedTodos={this.state.completedTodos}  
            />
          ))
          : 
          activeTodos.length > 0 &&
          activeTodos.map((todo, idx) => (
              <TodoCard 
                value={todo} 
                key={idx} 
                filterList={this.filterList}
                getHashtags={this.getHashtags}
                handleOnClickTodo={this.handleOnClickTodo}
              />
            ))
          }

          {filters.length === 0 && completedTodos.length > 0 &&
          completedTodos.map((todo, idx) => (
            <TodoCard 
              value={todo} 
              key={idx} 
              filterList={this.filterList}
              getHashtags={this.getHashtags}
              handleOnClickTodo={this.handleOnClickTodo}
              completed={true}
            />
          ))}
          
        </div>
      </div>
      <style>{`
        body {
          padding: 0px;
          margin: 0px;
        }
        .container {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .taskList {
          height: 200px;
          max-height: 200px;
          border: 1px solid black;
          overflow-y: auto;
        }
        .todoItem {
          color: blue;
        }
        .completed {
          color: green !important;
        }
        .chips {
            border: 1px solid black;
            border-radius: 50px;
            color: red;
            cursor: pointer;
            padding: 5px 8px;
        }
        .chips:hover {
            background: grey;
            color: white;
        }  
        .filters {
          padding: 4px 10px;
          border: 1px solid black;
          border-radius: 50px;
          margin-right: 6px;
        }
      `}</style>
      </>
    )
  }
}

